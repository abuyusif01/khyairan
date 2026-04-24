import { describe, it, expect, vi, type MockInstance } from 'vitest'

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

describe('fetchAllProducts', () => {
  it('returns all products regardless of published status', async () => {
    vi.resetModules()
    const { createClient } = await import('@supabase/supabase-js')
    const selectSpy = vi.fn().mockResolvedValue({ data: [], error: null })
    ;(createClient as unknown as MockInstance).mockReturnValue({
      from: vi.fn().mockReturnValue({ select: selectSpy }),
    })

    const { fetchAllProducts } = await import('./supabase')
    await fetchAllProducts()

    expect(selectSpy).toHaveBeenCalled()
    // Must NOT filter by published — returns all products for dashboard admin
    const selectCall: string = selectSpy.mock.calls[0][0] as string
    expect(selectCall).toContain('id')
  })
})

describe('updateProductPrices', () => {
  it('sends batch updates for each changed product', async () => {
    vi.resetModules()
    const { createClient } = await import('@supabase/supabase-js')
    const eqSpy = vi.fn().mockResolvedValue({ error: null })
    const updateSpy = vi.fn().mockReturnValue({ eq: eqSpy })
    ;(createClient as unknown as MockInstance).mockReturnValue({
      from: vi.fn().mockReturnValue({ update: updateSpy }),
    })

    const { updateProductPrices } = await import('./supabase')
    await updateProductPrices([
      { id: 'p1', price_ngn: 5000 },
      { id: 'p2', price_ngn: 4500 },
    ])

    expect(updateSpy).toHaveBeenCalledTimes(2)
    expect(updateSpy).toHaveBeenCalledWith({ price_ngn: 5000 })
    expect(updateSpy).toHaveBeenCalledWith({ price_ngn: 4500 })
    expect(eqSpy).toHaveBeenCalledWith('id', 'p1')
    expect(eqSpy).toHaveBeenCalledWith('id', 'p2')
  })
})
