/**
 * admin-users handler — testable core logic.
 *
 * Accepts a Request and two Supabase clients:
 *   - callerClient: created with the caller's JWT (for identity verification)
 *   - serviceClient: created with the service role key (for admin API calls)
 */

type GetUserResult = { data: { user: { id: string } | null }; error: { message: string } | null }
type QueryResult<T = unknown> = { data: T[] | null; error: { message: string } | null }
type MutateResult = { error: { message: string } | null }
type InviteResult = { data: { user: { id: string } } | null; error: { message: string } | null }

type QueryBuilder<T = unknown> = {
  eq: (col: string, val: string) => Promise<QueryResult<T>>
}

type SupabaseTable<T = unknown> = {
  select: (cols: string) => QueryBuilder<T>
  insert: (row: object) => Promise<MutateResult>
  delete: () => { eq: (col: string, val: string) => Promise<MutateResult> }
}

export type SupabaseClient = {
  from: <T = unknown>(table: string) => SupabaseTable<T>
  auth: {
    getUser: () => Promise<GetUserResult>
    admin: {
      inviteUserByEmail: (email: string, opts?: object) => Promise<InviteResult>
      deleteUser: (id: string) => Promise<MutateResult>
    }
  }
}

type InviteBody = { action: 'invite'; email: string; full_name: string; role: 'owner' | 'manager' }
type RemoveBody = { action: 'remove'; userId: string }
type ActionBody = InviteBody | RemoveBody | { action: string }

function json(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

async function verifyOwner(callerClient: SupabaseClient): Promise<boolean> {
  const { data: userData, error: userError } = await callerClient.auth.getUser()
  if (userError || !userData.user) return false

  const { data, error } = await callerClient
    .from<{ role: string }>('profiles')
    .select('role')
    .eq('id', userData.user.id)

  if (error || !data || data.length === 0) return false
  return (data[0] as { role: string }).role === 'owner'
}

export async function handleAdminUsers(
  req: Request,
  callerClient: SupabaseClient,
  serviceClient: SupabaseClient,
): Promise<Response> {
  const isOwner = await verifyOwner(callerClient)
  if (!isOwner) {
    return json({ error: 'Forbidden — owner role required' }, 403)
  }

  let body: ActionBody
  try {
    body = await req.json() as ActionBody
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  if (body.action === 'invite') {
    const { email, full_name, role } = body as InviteBody

    const { data, error } = await serviceClient.auth.admin.inviteUserByEmail(email)
    if (error || !data) {
      return json({ error: error?.message ?? 'Invite failed' }, 500)
    }

    const userId = data.user.id
    const { error: insertError } = await serviceClient
      .from('profiles')
      .insert({ id: userId, full_name, role })
    if (insertError) {
      return json({ error: insertError.message }, 500)
    }

    return json({ userId })
  }

  if (body.action === 'remove') {
    const { userId } = body as RemoveBody

    const { error: deleteProfileError } = await serviceClient
      .from('profiles')
      .delete()
      .eq('id', userId)
    if (deleteProfileError) {
      return json({ error: deleteProfileError.message }, 500)
    }

    const { error: deleteAuthError } = await serviceClient.auth.admin.deleteUser(userId)
    if (deleteAuthError) {
      return json({ error: deleteAuthError.message }, 500)
    }

    return json({ removed: true })
  }

  return json({ error: `Unknown action: ${body.action}` }, 400)
}
