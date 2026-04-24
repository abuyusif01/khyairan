import { supabase } from './supabase'
import type { Role } from '../components/layout'

export async function checkSession(): Promise<Role | null> {
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

  return (data?.role as Role) ?? null
}
