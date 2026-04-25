import { supabase } from './supabase'
import type { Role } from '../components/layout'

export interface Session {
  role: Role
  userId: string
}

export async function checkSession(): Promise<Session | null> {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    window.location.href = '/'
    return null
  }

  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!data?.role) return null
  return { role: data.role as Role, userId: session.user.id }
}
