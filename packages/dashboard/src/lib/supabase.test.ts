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

describe('createProduct', () => {
  it('inserts product and returns id', async () => {
    vi.resetModules()
    const { createClient } = await import('@supabase/supabase-js')
    const selectSpy = vi.fn().mockResolvedValue({ data: [{ id: 'new-p1' }], error: null })
    const insertSpy = vi.fn().mockReturnValue({ select: selectSpy })
    ;(createClient as unknown as MockInstance).mockReturnValue({
      from: vi.fn().mockReturnValue({ insert: insertSpy }),
    })

    const { createProduct } = await import('./supabase')
    const result = await createProduct({
      name: 'Coca-Cola',
      size: '35CL',
      unit_type: 'bottle',
      units_per_carton: 24,
      price_ngn: 4500,
      published: false,
    })

    expect(insertSpy).toHaveBeenCalledWith({
      name: 'Coca-Cola',
      size: '35CL',
      unit_type: 'bottle',
      units_per_carton: 24,
      price_ngn: 4500,
      published: false,
    })
    expect(result.id).toBe('new-p1')
  })
})

describe('setProductTags', () => {
  it('upserts product_tag rows', async () => {
    vi.resetModules()
    const { createClient } = await import('@supabase/supabase-js')
    const upsertSpy = vi.fn().mockResolvedValue({ error: null })
    const deleteSpy = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) })
    ;(createClient as unknown as MockInstance).mockReturnValue({
      from: vi.fn().mockReturnValue({ upsert: upsertSpy, delete: deleteSpy }),
    })

    const { setProductTags } = await import('./supabase')
    await setProductTags('new-p1', ['tag1', 'tag2'])

    expect(upsertSpy).toHaveBeenCalledWith([
      { product_id: 'new-p1', tag_id: 'tag1', sort_order: 0 },
      { product_id: 'new-p1', tag_id: 'tag2', sort_order: 1 },
    ])
  })
})

describe('fetchAllTags', () => {
  it('returns all tags without type filter', async () => {
    vi.resetModules()
    const { createClient } = await import('@supabase/supabase-js')
    const orderSpy = vi.fn().mockResolvedValue({ data: [], error: null })
    const selectSpy = vi.fn().mockReturnValue({ order: orderSpy })
    ;(createClient as unknown as MockInstance).mockReturnValue({
      from: vi.fn().mockReturnValue({ select: selectSpy }),
    })

    const { fetchAllTags } = await import('./supabase')
    await fetchAllTags()

    expect(selectSpy).toHaveBeenCalled()
    // Must NOT filter by type — returns all tags for product assignment
  })
})

describe('updateProduct', () => {
  it('sends update for given fields with id filter', async () => {
    vi.resetModules()
    const { createClient } = await import('@supabase/supabase-js')
    const eqSpy = vi.fn().mockResolvedValue({ error: null })
    const updateSpy = vi.fn().mockReturnValue({ eq: eqSpy })
    ;(createClient as unknown as MockInstance).mockReturnValue({
      from: vi.fn().mockReturnValue({ update: updateSpy }),
    })

    const { updateProduct } = await import('./supabase')
    await updateProduct('p1', { name: 'New Name', price_ngn: 5000 })

    expect(updateSpy).toHaveBeenCalledWith({ name: 'New Name', price_ngn: 5000 })
    expect(eqSpy).toHaveBeenCalledWith('id', 'p1')
  })
})

describe('toggleTagPublished', () => {
  it('updates published field for given tag id', async () => {
    vi.resetModules()
    const { createClient } = await import('@supabase/supabase-js')
    const eqSpy = vi.fn().mockResolvedValue({ error: null })
    const updateSpy = vi.fn().mockReturnValue({ eq: eqSpy })
    ;(createClient as unknown as MockInstance).mockReturnValue({
      from: vi.fn().mockReturnValue({ update: updateSpy }),
    })

    const { toggleTagPublished } = await import('./supabase')
    await toggleTagPublished('tag1', false)

    expect(updateSpy).toHaveBeenCalledWith({ published: false })
    expect(eqSpy).toHaveBeenCalledWith('id', 'tag1')
  })
})

describe('uploadProductImage', () => {
  it('uploads to product-images bucket and returns path', async () => {
    vi.resetModules()
    const { createClient } = await import('@supabase/supabase-js')
    const uploadSpy = vi.fn().mockResolvedValue({ data: { path: 'products/p1' }, error: null })
    ;(createClient as unknown as MockInstance).mockReturnValue({
      from: vi.fn(),
      storage: {
        from: vi.fn().mockReturnValue({ upload: uploadSpy }),
      },
    })

    const { uploadProductImage } = await import('./supabase')
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    const path = await uploadProductImage('p1', file)

    expect(uploadSpy).toHaveBeenCalledWith('products/p1', file, { upsert: true })
    expect(path).toBe('products/p1')
  })
})
