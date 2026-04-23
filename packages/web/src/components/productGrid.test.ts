import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { ProductGroup } from '../types'
import { renderProductGrid } from './productGrid'

vi.mock('./bottomSheet', () => ({
  showBottomSheet: vi.fn(),
}))

import { showBottomSheet } from './bottomSheet'

const sampleGroups: ProductGroup[] = [
  {
    tag: { id: 'tag1', name: 'Carbonated Drinks', slug: 'carbonated-drinks', type: 'category', sort_order: 1, published: true },
    products: [
      { id: 'p1', name: 'Coca-Cola', size: '35CL', unit_type: 'bottle', units_per_carton: 12, price_ngn: 4500, image_path: 'coca-cola.webp', published: true },
    ],
  },
  {
    tag: { id: 'tag2', name: 'Juices', slug: 'juices', type: 'category', sort_order: 2, published: true },
    products: [
      { id: 'p2', name: 'Chivita', size: '1L', unit_type: 'pack', units_per_carton: 12, price_ngn: 6000, image_path: null, published: true },
    ],
  },
]

describe('renderProductGrid', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
  })

  it('renders category headings', () => {
    renderProductGrid(sampleGroups, container, 'https://test.supabase.co/storage')
    const headings = Array.from(container.querySelectorAll('.category-heading')).map(h => h.textContent)
    expect(headings).toContain('Carbonated Drinks')
    expect(headings).toContain('Juices')
  })

  it('renders product card with all fields', () => {
    renderProductGrid(sampleGroups, container, 'https://test.supabase.co/storage')
    const card = container.querySelector('.product-card')
    expect(card?.textContent).toContain('Coca-Cola')
    expect(card?.textContent).toContain('35CL')
    expect(card?.textContent).toContain('bottle')
    expect(card?.textContent).toContain('12')
  })

  it('formats price with naira symbol and thousands separator', () => {
    renderProductGrid(sampleGroups, container, 'https://test.supabase.co/storage')
    expect(container.textContent).toContain('₦4,500')
  })

  it('sets lazy loading on product images', () => {
    renderProductGrid(sampleGroups, container, 'https://test.supabase.co/storage')
    const imgs = container.querySelectorAll('img')
    imgs.forEach(img => expect(img.getAttribute('loading')).toBe('lazy'))
  })

  it('category sections have slug-based id attributes', () => {
    renderProductGrid(sampleGroups, container, 'https://test.supabase.co/storage')
    expect(container.querySelector('#category-carbonated-drinks')).toBeTruthy()
    expect(container.querySelector('#category-juices')).toBeTruthy()
  })

  it('product card is a div not a link', () => {
    renderProductGrid(sampleGroups, container, 'https://test.supabase.co/storage')
    expect(container.querySelector('div.product-card')).toBeTruthy()
    expect(container.querySelector('a.product-card')).toBeNull()
  })

  it('card click invokes showBottomSheet with product', () => {
    vi.mocked(showBottomSheet).mockClear()
    renderProductGrid(sampleGroups, container, 'https://test.supabase.co/storage')
    const card = container.querySelector('div.product-card') as HTMLElement
    card.click()
    expect(showBottomSheet).toHaveBeenCalledTimes(1)
    expect(showBottomSheet).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Coca-Cola' }),
      'https://test.supabase.co/storage'
    )
  })
})
