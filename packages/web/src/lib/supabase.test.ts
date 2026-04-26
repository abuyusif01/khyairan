import { describe, it, expect, vi, beforeEach, type MockInstance } from 'vitest'
import type { Product, Tag, ProductTag } from '../types'

// We test the module-level functions; mock createClient before importing
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

describe('fetchPublishedProducts', () => {
  it('selects only published columns and filters by published = true', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const selectSpy = vi.fn().mockReturnThis()
    const eqSpy = vi.fn().mockResolvedValue({ data: [], error: null })
    ;(createClient as unknown as MockInstance).mockReturnValue({
      from: vi.fn().mockReturnValue({ select: selectSpy, eq: eqSpy }),
    })
    selectSpy.mockReturnValue({ eq: eqSpy })

    const { fetchPublishedProducts } = await import('./supabase')
    await fetchPublishedProducts()

    expect(selectSpy).toHaveBeenCalledWith(
      expect.stringContaining('id')
    )
    // Must NOT select internal columns
    const selectCall: string = selectSpy.mock.calls[0][0] as string
    expect(selectCall).not.toContain('metadata')
    expect(selectCall).not.toContain('internal_notes')
    expect(selectCall).not.toContain('created_at')
    expect(selectCall).not.toContain('updated_at')
    expect(eqSpy).toHaveBeenCalledWith('published', true)
  })
})

describe('fetchPublishedCategoryTags', () => {
  it('filters by type = category and published = true, ordered by sort_order', async () => {
    vi.resetModules()
    const { createClient } = await import('@supabase/supabase-js')
    const selectSpy = vi.fn().mockReturnThis()
    const eq1Spy = vi.fn().mockReturnThis()
    const eq2Spy = vi.fn().mockReturnThis()
    const orderSpy = vi.fn().mockResolvedValue({ data: [], error: null })
    ;(createClient as unknown as MockInstance).mockReturnValue({
      from: vi.fn().mockReturnValue({
        select: selectSpy,
        eq: eq1Spy,
        order: orderSpy,
      }),
    })
    selectSpy.mockReturnValue({ eq: eq1Spy })
    eq1Spy.mockReturnValue({ eq: eq2Spy })
    eq2Spy.mockReturnValue({ order: orderSpy })

    const { fetchPublishedCategoryTags } = await import('./supabase')
    await fetchPublishedCategoryTags()

    expect(eq1Spy).toHaveBeenCalledWith('published', true)
    expect(eq2Spy).toHaveBeenCalledWith('type', 'category')
    expect(orderSpy).toHaveBeenCalledWith('sort_order', expect.anything())
  })
})

describe('loadCatalog', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('fetches products, tags, and productTags from Supabase', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const fromSpy = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    })
    ;(createClient as unknown as MockInstance).mockReturnValue({ from: fromSpy })

    const { loadCatalog } = await import('./supabase')
    const result = await loadCatalog()

    expect(result).toHaveProperty('products')
    expect(result).toHaveProperty('tags')
    expect(result).toHaveProperty('productTags')
    expect(fromSpy).toHaveBeenCalledTimes(3)
  })

  it('fetches fresh data on every call', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    const fromSpy = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    })
    ;(createClient as unknown as MockInstance).mockReturnValue({ from: fromSpy })

    const { loadCatalog } = await import('./supabase')
    await loadCatalog()
    await loadCatalog()

    expect(fromSpy).toHaveBeenCalledTimes(6)
  })
})

describe('groupProductsByCategory', () => {
  const tags: Tag[] = [
    { id: 'tag1', name: 'Carbonated', slug: 'carbonated', type: 'category', sort_order: 1, published: true },
    { id: 'tag2', name: 'Juices', slug: 'juices', type: 'category', sort_order: 2, published: true },
  ]
  const products: Product[] = [
    { id: 'p1', name: 'Coke', size: '35CL', unit_type: 'bottle', units_per_carton: 24, price_ngn: 4500, image_path: null, published: true },
    { id: 'p2', name: 'Sprite', size: '35CL', unit_type: 'bottle', units_per_carton: 24, price_ngn: 4500, image_path: null, published: true },
    { id: 'p3', name: 'Chivita', size: '1L', unit_type: 'pack', units_per_carton: 12, price_ngn: 6000, image_path: null, published: true },
  ]
  const productTags: ProductTag[] = [
    { product_id: 'p1', tag_id: 'tag1', sort_order: 1 },
    { product_id: 'p2', tag_id: 'tag1', sort_order: 2 },
    { product_id: 'p3', tag_id: 'tag2', sort_order: 1 },
  ]

  it('groups and sorts correctly', async () => {
    const { groupProductsByCategory } = await import('./supabase')
    const grouped = groupProductsByCategory(products, tags, productTags)

    expect(grouped).toHaveLength(2)
    expect(grouped[0].tag.id).toBe('tag1')
    expect(grouped[0].products.map(p => p.id)).toEqual(['p1', 'p2'])
    expect(grouped[1].tag.id).toBe('tag2')
    expect(grouped[1].products.map(p => p.id)).toEqual(['p3'])
  })

  it('excludes products with no category tag', async () => {
    const { groupProductsByCategory } = await import('./supabase')
    const orphan: Product = { id: 'p_orphan', name: 'Unknown', size: '1L', unit_type: 'bottle', units_per_carton: 12, price_ngn: 3000, image_path: null, published: true }
    const grouped = groupProductsByCategory([...products, orphan], tags, productTags)

    const allGroupedIds = grouped.flatMap(g => g.products.map(p => p.id))
    expect(allGroupedIds).not.toContain('p_orphan')
  })
})
