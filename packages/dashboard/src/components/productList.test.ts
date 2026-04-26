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

  it('status badge updates data-status on toggle', async () => {
    const { renderProductList } = await import('./productList')
    const toggleFn = vi.fn().mockResolvedValue(undefined)

    renderProductList(container, products, tags, productTags, { toggleFn })

    const row = container.querySelector('[data-product-id="p1"]')!
    const badge = row.querySelector<HTMLElement>('[data-status]')!
    expect(badge.getAttribute('data-status')).toBe('published')

    const toggleBtn = row.querySelector<HTMLButtonElement>('[data-action="unpublish"]')!
    toggleBtn.click()

    await vi.waitFor(() => expect(toggleFn).toHaveBeenCalledWith('p1', false))
    expect(badge.getAttribute('data-status')).toBe('draft')
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
    expect(container.querySelectorAll('[data-action="delete"]').length).toBe(0)

    container.innerHTML = ''
    renderProductList(container, products, tags, productTags, { deleteFn, isOwner: true })
    expect(container.querySelectorAll('[data-action="delete"]').length).toBe(3)
  })

  it('delete button calls deleteFn after confirmation', async () => {
    const { renderProductList } = await import('./productList')
    const deleteFn = vi.fn().mockResolvedValue(undefined)
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderProductList(container, products, tags, productTags, { deleteFn, isOwner: true })

    const p1Row = container.querySelector('[data-product-id="p1"]')!
    const deleteBtn = p1Row.querySelector<HTMLButtonElement>('[data-action="delete"]')!
    deleteBtn.click()

    await vi.waitFor(() => expect(deleteFn).toHaveBeenCalledWith('p1'))
    expect(container.querySelector('[data-product-id="p1"]')).toBeNull()
  })

  it('reorder buttons hidden when no tag selected', async () => {
    const { renderProductList } = await import('./productList')
    const reorderFn = vi.fn().mockResolvedValue(undefined)
    renderProductList(container, products, tags, productTags, { reorderFn })

    // No tag selected — reorder buttons must not exist
    expect(container.querySelectorAll('[data-action="move-up"]').length).toBe(0)
    expect(container.querySelectorAll('[data-action="move-down"]').length).toBe(0)
  })

  it('reorder buttons appear when tag selected', async () => {
    const { renderProductList } = await import('./productList')
    const reorderFn = vi.fn().mockResolvedValue(undefined)
    renderProductList(container, products, tags, productTags, { reorderFn })

    const select = container.querySelector<HTMLSelectElement>('[data-tag-filter]')!
    select.value = 'tag1'
    select.dispatchEvent(new Event('change'))

    // p1 and p2 are in tag1 — each should have move buttons
    expect(container.querySelectorAll('[data-action="move-up"]').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('[data-action="move-down"]').length).toBeGreaterThan(0)
  })

  it('first visible row has no move-up button; last visible row has no move-down button', async () => {
    const { renderProductList } = await import('./productList')
    const reorderFn = vi.fn().mockResolvedValue(undefined)
    renderProductList(container, products, tags, productTags, { reorderFn })

    const select = container.querySelector<HTMLSelectElement>('[data-tag-filter]')!
    select.value = 'tag1'
    select.dispatchEvent(new Event('change'))

    // tag1 has p1 (sort_order 1) and p2 (sort_order 2)
    const visibleRows = Array.from(container.querySelectorAll<HTMLElement>('[data-product-id]'))
      .filter(r => r.style.display !== 'none')

    const firstRow = visibleRows[0]
    const lastRow = visibleRows[visibleRows.length - 1]

    expect(firstRow.querySelector('[data-action="move-up"]')).toBeNull()
    expect(lastRow.querySelector('[data-action="move-down"]')).toBeNull()
  })

  it('move-up button calls reorderFn with swapped sort_orders', async () => {
    const { renderProductList } = await import('./productList')
    const reorderFn = vi.fn().mockResolvedValue(undefined)
    renderProductList(container, products, tags, productTags, { reorderFn })

    const select = container.querySelector<HTMLSelectElement>('[data-tag-filter]')!
    select.value = 'tag1'
    select.dispatchEvent(new Event('change'))

    // p1 sort_order=1, p2 sort_order=2; click move-up on p2 to swap with p1
    const visibleRows = Array.from(container.querySelectorAll<HTMLElement>('[data-product-id]'))
      .filter(r => r.style.display !== 'none')
    const secondRow = visibleRows[1]
    const moveUpBtn = secondRow.querySelector<HTMLButtonElement>('[data-action="move-up"]')!
    moveUpBtn.click()

    await vi.waitFor(() => expect(reorderFn).toHaveBeenCalledOnce())

    const [calledTagId, calledUpdates] = reorderFn.mock.calls[0] as [string, Array<{productId: string, sortOrder: number}>]
    expect(calledTagId).toBe('tag1')
    expect(calledUpdates.length).toBe(2)

    // Verify sort_orders are actually swapped (p1 was sort_order=1, p2 was sort_order=2)
    const p1Update = calledUpdates.find(u => u.productId === 'p1')!
    const p2Update = calledUpdates.find(u => u.productId === 'p2')!
    expect(p1Update.sortOrder).toBe(2)  // p1 takes p2's old sort_order
    expect(p2Update.sortOrder).toBe(1)  // p2 takes p1's old sort_order
  })


  it('renders Add product link', async () => {
    const { renderProductList } = await import('./productList')
    renderProductList(container, products, tags, productTags)

    const addLink = container.querySelector<HTMLAnchorElement>('a[href="#add-product"]')
    expect(addLink).toBeTruthy()
    expect(addLink!.textContent?.trim()).toContain('Add product')
  })
})
