import { describe, it, expect, vi } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({})),
}))

describe('supabase client', () => {
  it('creates Supabase client with env vars', async () => {
    vi.resetModules()
    const { createClient } = await import('@supabase/supabase-js')
    const mockCreateClient = createClient as ReturnType<typeof vi.fn>
    mockCreateClient.mockClear()

    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'test-anon-key')

    await import('./supabase')

    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    )
  })
})
