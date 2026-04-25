import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Product, Tag, ProductTag } from '../types'

const products: Product[] = [
  { id: 'p1', name: 'Coca-Cola', size: '35CL', unit_type: 'bottle', units_per_carton: 24, price_ngn: 4500, image_path: null, published: true, metadata: {}, internal_notes: null },
  { id: 'p2', name: 'Sprite', size: '35CL', unit_type: 'bottle', units_per_carton: 24, price_ngn: 4200, image_path: null, published: false, metadata: {}, internal_notes: null },
  { id: 'p3', name: 'Chivita', size: '1L', unit_type: 'pack', units_per_carton: 12, price_ngn: 6000, image_path: null, published: true, metadata: {}, internal_notes: null },
]

const tags: Tag[] = [
  { id: 'tag1', name: 'Carbonated', slug: 'carbonated', type: 'category', sort_order: 1, published: true },
  { id: 'tag2', name: 'Juices', slug: 'juices', type: 'category', sort_order: 2, published: true },
]

const productTags: ProductTag[] = [
  { product_id: 'p1', tag_id: 'tag1', sort_order: 1 },
  { product_id: 'p2', tag_id: 'tag1', sort_order: 2 },
  { product_id: 'p3', tag_id: 'tag2', sort_order: 1 },
]

describe('renderProductList', () => {
  let container: HTMLElement

  beforeEach(async () => {
    container = document.createElement('div')
  })

  it('renders product rows with name and price', async () => {
    const { renderProductList } = await import('./productList')
    renderProductList(container, products, tags, productTags)
    const text = container.textContent ?? ''
    expect(text).toContain('Coca-Cola')
    expect(text).toContain('Sprite')
    expect(text).toContain('₦4,500')
    expect(text).toContain('₦4,200')
  })

  it('shows published indicator for published products', async () => {
    const { renderProductList } = await import('./productList')
    renderProductList(container, products, tags, productTags)
    const rows = container.querySelectorAll('[data-product-id="p1"]')
    expect(rows.length).toBeGreaterThan(0)
    const row = rows[0]
    expect(row.querySelector('[data-status="published"]')).toBeTruthy()
  })

  it('shows draft indicator for draft products', async () => {
    const { renderProductList } = await import('./productList')
    renderProductList(container, products, tags, productTags)
    const row = container.querySelector('[data-product-id="p2"]')
    expect(row?.querySelector('[data-status="draft"]')).toBeTruthy()
  })

  it('search filters rows by name', async () => {
    const { renderProductList } = await import('./productList')
    const searchInput = document.createElement('input')
    searchInput.setAttribute('data-search', '')
    container.appendChild(searchInput)
    renderProductList(container, products, tags, productTags)

    const input = container.querySelector<HTMLInputElement>('[data-search]')
    if (input) {
      input.value = 'sprite'
      input.dispatchEvent(new Event('input'))
    }

    const rows = container.querySelectorAll('[data-product-id]')
    const visibleRows = Array.from(rows).filter(r => (r as HTMLElement).style.display !== 'none')
    expect(visibleRows.some(r => r.getAttribute('data-product-id') === 'p2')).toBe(true)
    expect(visibleRows.every(r => r.getAttribute('data-product-id') !== 'p1')).toBe(true)
  })

  it('filter by tag hides non-matching products', async () => {
    const { renderProductList } = await import('./productList')
    const filterSelect = document.createElement('select')
    filterSelect.setAttribute('data-tag-filter', '')
    container.appendChild(filterSelect)
    renderProductList(container, products, tags, productTags)

    const select = container.querySelector<HTMLSelectElement>('[data-tag-filter]')
    if (select) {
      select.value = 'tag2'
      select.dispatchEvent(new Event('change'))
    }

    const rows = container.querySelectorAll('[data-product-id]')
    const visibleRows = Array.from(rows).filter(r => (r as HTMLElement).style.display !== 'none')
    expect(visibleRows.length).toBe(1)
    expect(visibleRows[0].getAttribute('data-product-id')).toBe('p3')
  })

  it('renders delete button only when isOwner', async () => {
    const { renderProductList } = await import('./productList')
    const deleteFn = vi.fn().mockResolvedValue(undefined)

    renderProductList(container, products, tags, productTags, { deleteFn, isOwner: false })
    expect(container.querySelectorAll('[data-action="delete-product"]').length).toBe(0)

    container.innerHTML = ''
    renderProductList(container, products, tags, productTags, { deleteFn, isOwner: true })
    expect(container.querySelectorAll('[data-action="delete-product"]').length).toBe(3)
  })

  it('delete button calls deleteFn after confirmation', async () => {
    const { renderProductList } = await import('./productList')
    const deleteFn = vi.fn().mockResolvedValue(undefined)
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderProductList(container, products, tags, productTags, { deleteFn, isOwner: true })

    const p1Row = container.querySelector('[data-product-id="p1"]')!
    const deleteBtn = p1Row.querySelector<HTMLButtonElement>('[data-action="delete-product"]')!
    deleteBtn.click()

    await vi.waitFor(() => expect(deleteFn).toHaveBeenCalledWith('p1'))
    expect(container.querySelector('[data-product-id="p1"]')).toBeNull()
  })
})
