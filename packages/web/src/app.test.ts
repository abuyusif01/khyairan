import { describe, it, expect, vi } from 'vitest'

vi.mock('./lib/supabase', () => ({
  fetchPublishedProducts: vi.fn().mockResolvedValue([]),
  fetchPublishedCategoryTags: vi.fn().mockResolvedValue([]),
  fetchProductTags: vi.fn().mockResolvedValue([]),
  groupProductsByCategory: vi.fn().mockReturnValue([]),
}))

describe('Web app', () => {
  it('initApp does not throw', async () => {
    const { initApp } = await import('./main')
    await expect(initApp()).resolves.not.toThrow()
  })
})
