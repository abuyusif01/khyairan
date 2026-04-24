import { describe, it, expect, vi } from 'vitest'

vi.mock('./lib/supabase', () => ({
  loadCatalog: vi.fn().mockResolvedValue({ products: [], tags: [], productTags: [] }),
  groupProductsByCategory: vi.fn().mockReturnValue([]),
}))

describe('Web app', () => {
  it('initApp does not throw', async () => {
    const { initApp } = await import('./main')
    await expect(initApp()).resolves.not.toThrow()
  })
})
