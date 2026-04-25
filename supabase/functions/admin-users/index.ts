/**
 * admin-users — Supabase Edge Function
 *
 * Proxies admin user operations (invite, remove) that require the service role key.
 * Verifies the caller is an owner before performing any admin action.
 *
 * Deploy: supabase functions deploy admin-users
 *
 * Request body:
 *   { action: 'invite', email: string, full_name: string, role: 'owner' | 'manager' }
 *   { action: 'remove', userId: string }
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleAdminUsers } from './handler.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

  // Caller client: uses caller's JWT so auth.getUser() and RLS work correctly
  const callerClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
    global: { headers: { Authorization: authHeader } },
  })

  // Service client: uses service role key for admin API calls
  const serviceClient = createClient(supabaseUrl, serviceRoleKey)

  return await handleAdminUsers(req.clone(), callerClient, serviceClient, corsHeaders)
})
