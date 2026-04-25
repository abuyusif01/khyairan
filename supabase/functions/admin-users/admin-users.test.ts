/**
 * Unit tests for admin-users Edge Function handler.
 *
 * Run with: deno test supabase/functions/admin-users/admin-users.test.ts
 * (from repo root, with Deno available via flox install deno)
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { handleAdminUsers } from './handler.ts'

type MockClient = {
  from: (table: string) => MockQueryBuilder
  auth: { admin: MockAdmin }
}

type MockQueryBuilder = {
  select: (cols: string) => MockQueryBuilder
  eq: (col: string, val: string) => Promise<{ data: unknown[]; error: null }>
  insert: (row: unknown) => Promise<{ error: null }>
  delete: () => MockQueryBuilder
}

type MockAdmin = {
  inviteUserByEmail: (email: string, opts?: unknown) => Promise<{ data: { user: { id: string } }; error: null }>
  deleteUser: (id: string) => Promise<{ error: null }>
}

function makeRequest(body: unknown, jwt = 'valid-jwt'): Request {
  return new Request('http://localhost/admin-users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

function makeOwnerClient(): MockClient {
  return {
    from: (table: string) => ({
      select: () => ({
        eq: async () => ({
          data: table === 'profiles'
            ? [{ role: 'owner' }]
            : [],
          error: null,
        }),
      }),
      insert: async () => ({ error: null }),
      delete: () => ({
        eq: async () => ({ data: [], error: null }),
      }),
    }),
    auth: {
      admin: {
        inviteUserByEmail: async () => ({ data: { user: { id: 'new-user-id' } }, error: null }),
        deleteUser: async () => ({ error: null }),
      },
    },
  }
}

function makeManagerClient(): MockClient {
  return {
    ...makeOwnerClient(),
    from: (table: string) => ({
      select: () => ({
        eq: async () => ({
          data: table === 'profiles'
            ? [{ role: 'manager' }]
            : [],
          error: null,
        }),
      }),
      insert: async () => ({ error: null }),
      delete: () => ({
        eq: async () => ({ data: [], error: null }),
      }),
    }),
  }
}

Deno.test('rejects non-owner caller with 403', async () => {
  const req = makeRequest({ action: 'invite', email: 'a@b.com', full_name: 'A', role: 'manager' })
  const managerClient = makeManagerClient()
  const res = await handleAdminUsers(req, managerClient as unknown as MockClient, managerClient as unknown as MockClient)
  assertEquals(res.status, 403)
})

Deno.test('invite creates auth user and inserts profile row', async () => {
  const inviteCalls: string[] = []
  const insertCalls: unknown[] = []

  const client = makeOwnerClient()
  const serviceClient: MockClient = {
    from: (table: string) => ({
      select: () => ({ eq: async () => ({ data: [], error: null }) }),
      insert: async (row: unknown) => { insertCalls.push({ table, row }); return { error: null } },
      delete: () => ({ eq: async () => ({ data: [], error: null }) }),
    }),
    auth: {
      admin: {
        inviteUserByEmail: async (email: string) => { inviteCalls.push(email); return { data: { user: { id: 'new-id' } }, error: null } },
        deleteUser: async () => ({ error: null }),
      },
    },
  }

  const req = makeRequest({ action: 'invite', email: 'new@user.com', full_name: 'New User', role: 'manager' })
  const res = await handleAdminUsers(req, client as unknown as MockClient, serviceClient as unknown as MockClient)

  assertEquals(res.status, 200)
  assertEquals(inviteCalls[0], 'new@user.com')
  assertEquals(insertCalls.length, 1)
})

Deno.test('remove deletes profile then auth user', async () => {
  const deleteCalls: string[] = []
  const authDeleteCalls: string[] = []

  const client = makeOwnerClient()
  const serviceClient: MockClient = {
    from: () => ({
      select: () => ({ eq: async () => ({ data: [], error: null }) }),
      insert: async () => ({ error: null }),
      delete: () => ({
        eq: async (_col: string, val: string) => { deleteCalls.push(val); return { data: [], error: null } },
      }),
    }),
    auth: {
      admin: {
        inviteUserByEmail: async () => ({ data: { user: { id: '' } }, error: null }),
        deleteUser: async (id: string) => { authDeleteCalls.push(id); return { error: null } },
      },
    },
  }

  const req = makeRequest({ action: 'remove', userId: 'u1' })
  const res = await handleAdminUsers(req, client as unknown as MockClient, serviceClient as unknown as MockClient)

  assertEquals(res.status, 200)
  assertEquals(deleteCalls[0], 'u1')
  assertEquals(authDeleteCalls[0], 'u1')
})

Deno.test('unknown action returns 400', async () => {
  const client = makeOwnerClient()
  const req = makeRequest({ action: 'unknown' })
  const res = await handleAdminUsers(req, client as unknown as MockClient, client as unknown as MockClient)
  assertEquals(res.status, 400)
})
