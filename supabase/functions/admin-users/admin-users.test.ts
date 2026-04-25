/**
 * Unit tests for admin-users Edge Function handler.
 *
 * Run with: deno test supabase/functions/admin-users/admin-users.test.ts
 * (from repo root, with Deno available via flox install deno)
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { handleAdminUsers } from './handler.ts'
import type { SupabaseClient } from './handler.ts'

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/admin-users', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer valid-jwt',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

function makeClient(role: 'owner' | 'manager'): SupabaseClient {
  return {
    from: () => ({
      select: () => ({
        eq: async () => ({ data: [{ role }], error: null }),
      }),
      insert: async () => ({ error: null }),
      delete: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
    }),
    auth: {
      getUser: async () => ({ data: { user: { id: 'caller-id' } }, error: null }),
      admin: {
        inviteUserByEmail: async () => ({ data: { user: { id: 'new-user-id' } }, error: null }),
        deleteUser: async () => ({ error: null }),
      },
    },
  }
}

Deno.test('rejects non-owner caller with 403', async () => {
  const callerClient = makeClient('manager')
  const serviceClient = makeClient('owner')
  const req = makeRequest({ action: 'invite', email: 'a@b.com', full_name: 'A', role: 'manager' })
  const res = await handleAdminUsers(req, callerClient, serviceClient)
  assertEquals(res.status, 403)
})

Deno.test('invite creates auth user and inserts profile row', async () => {
  const inviteCalls: string[] = []
  const insertCalls: unknown[] = []

  const callerClient = makeClient('owner')
  const serviceClient: SupabaseClient = {
    from: (table) => ({
      select: () => ({ eq: async () => ({ data: [], error: null }) }),
      insert: async (row) => { insertCalls.push({ table, row }); return { error: null } },
      delete: () => ({ eq: async () => ({ data: null, error: null }) }),
    }),
    auth: {
      getUser: async () => ({ data: { user: { id: 'caller-id' } }, error: null }),
      admin: {
        inviteUserByEmail: async (email) => { inviteCalls.push(email); return { data: { user: { id: 'new-id' } }, error: null } },
        deleteUser: async () => ({ error: null }),
      },
    },
  }

  const req = makeRequest({ action: 'invite', email: 'new@user.com', full_name: 'New User', role: 'manager' })
  const res = await handleAdminUsers(req, callerClient, serviceClient)

  assertEquals(res.status, 200)
  assertEquals(inviteCalls[0], 'new@user.com')
  assertEquals(insertCalls.length, 1)
})

Deno.test('remove deletes profile then auth user', async () => {
  const deleteCalls: string[] = []
  const authDeleteCalls: string[] = []

  const callerClient = makeClient('owner')
  const serviceClient: SupabaseClient = {
    from: () => ({
      select: () => ({ eq: async () => ({ data: [], error: null }) }),
      insert: async () => ({ error: null }),
      delete: () => ({
        eq: async (_col, val) => { deleteCalls.push(val); return { data: null, error: null } },
      }),
    }),
    auth: {
      getUser: async () => ({ data: { user: { id: 'caller-id' } }, error: null }),
      admin: {
        inviteUserByEmail: async () => ({ data: { user: { id: '' } }, error: null }),
        deleteUser: async (id) => { authDeleteCalls.push(id); return { error: null } },
      },
    },
  }

  const req = makeRequest({ action: 'remove', userId: 'u1' })
  const res = await handleAdminUsers(req, callerClient, serviceClient)

  assertEquals(res.status, 200)
  assertEquals(deleteCalls[0], 'u1')
  assertEquals(authDeleteCalls[0], 'u1')
})

Deno.test('unknown action returns 400', async () => {
  const callerClient = makeClient('owner')
  const serviceClient = makeClient('owner')
  const req = makeRequest({ action: 'unknown' })
  const res = await handleAdminUsers(req, callerClient, serviceClient)
  assertEquals(res.status, 400)
})
