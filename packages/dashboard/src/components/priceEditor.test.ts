import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Product } from '../types'

const products: Product[] = [
  { id: 'p1', name: 'Coca-Cola', size: '35CL', unit_type: 'bottle', units_per_carton: 24, price_ngn: 4500, image_path: null, published: true, metadata: {}, internal_notes: null },
  { id: 'p2', name: 'Sprite', size: '35CL', unit_type: 'bottle', units_per_carton: 24, price_ngn: 4200, image_path: null, published: false, metadata: {}, internal_notes: null },
  { id: 'p3', name: 'Chivita', size: '1L', unit_type: 'pack', units_per_carton: 12, price_ngn: 6000, image_path: null, published: true, metadata: {}, internal_notes: null },
]

describe('renderPriceEditor', () => {
  let container: HTMLElement
  let updateFn: ReturnType<typeof vi.fn>

  beforeEach(() => {
    container = document.createElement('div')
    updateFn = vi.fn().mockResolvedValue(undefined)
  })

  it('renders rows for each product with name and price input', async () => {
    const { renderPriceEditor } = await import('./priceEditor')
    renderPriceEditor(container, products, updateFn)

    const rows = container.querySelectorAll('[data-product-id]')
    expect(rows.length).toBe(3)

    const p1Row = container.querySelector('[data-product-id="p1"]')
    expect(p1Row?.textContent).toContain('Coca-Cola')
    const p1Input = p1Row?.querySelector<HTMLInputElement>('input[type="number"]')
    expect(p1Input?.value).toBe('4500')
  })

  it('marks row as changed when price input changes', async () => {
    const { renderPriceEditor } = await import('./priceEditor')
    renderPriceEditor(container, products, updateFn)

    const p1Row = container.querySelector('[data-product-id="p1"]')
    const input = p1Row?.querySelector<HTMLInputElement>('input[type="number"]')
    expect(input).toBeTruthy()

    input!.value = '5000'
    input!.dispatchEvent(new Event('input'))

    expect(p1Row?.hasAttribute('data-changed')).toBe(true)
  })

  it('save button disabled when no changes', async () => {
    const { renderPriceEditor } = await import('./priceEditor')
    renderPriceEditor(container, products, updateFn)

    const saveBtn = container.querySelector<HTMLButtonElement>('[data-action="save-prices"]')
    expect(saveBtn?.disabled).toBe(true)
  })

  it('save button enabled when at least one row changed', async () => {
    const { renderPriceEditor } = await import('./priceEditor')
    renderPriceEditor(container, products, updateFn)

    const p1Row = container.querySelector('[data-product-id="p1"]')
    const input = p1Row?.querySelector<HTMLInputElement>('input[type="number"]')
    input!.value = '5000'
    input!.dispatchEvent(new Event('input'))

    const saveBtn = container.querySelector<HTMLButtonElement>('[data-action="save-prices"]')
    expect(saveBtn?.disabled).toBe(false)
  })

  it('calls updateFn with only changed rows on save', async () => {
    const { renderPriceEditor } = await import('./priceEditor')
    renderPriceEditor(container, products, updateFn)

    const p1Row = container.querySelector('[data-product-id="p1"]')
    const input = p1Row?.querySelector<HTMLInputElement>('input[type="number"]')
    input!.value = '5000'
    input!.dispatchEvent(new Event('input'))

    const saveBtn = container.querySelector<HTMLButtonElement>('[data-action="save-prices"]')
    saveBtn!.click()

    await vi.waitFor(() => expect(updateFn).toHaveBeenCalledOnce())
    expect(updateFn).toHaveBeenCalledWith([{ id: 'p1', price_ngn: 5000 }])
  })

  it('shows success feedback and clears changed state after save', async () => {
    const { renderPriceEditor } = await import('./priceEditor')
    renderPriceEditor(container, products, updateFn)

    const p1Row = container.querySelector('[data-product-id="p1"]')
    const input = p1Row?.querySelector<HTMLInputElement>('input[type="number"]')
    input!.value = '5000'
    input!.dispatchEvent(new Event('input'))

    const saveBtn = container.querySelector<HTMLButtonElement>('[data-action="save-prices"]')
    saveBtn!.click()

    await vi.waitFor(() => {
      const feedback = container.querySelector('[data-feedback]')
      expect(feedback?.textContent).toContain('saved')
    })
    expect(p1Row?.hasAttribute('data-changed')).toBe(false)
  })

  it('shows error feedback when update throws', async () => {
    updateFn.mockRejectedValueOnce(new Error('network error'))
    const { renderPriceEditor } = await import('./priceEditor')
    renderPriceEditor(container, products, updateFn)

    const p1Row = container.querySelector('[data-product-id="p1"]')
    const input = p1Row?.querySelector<HTMLInputElement>('input[type="number"]')
    input!.value = '5000'
    input!.dispatchEvent(new Event('input'))

    const saveBtn = container.querySelector<HTMLButtonElement>('[data-action="save-prices"]')
    saveBtn!.click()

    await vi.waitFor(() => {
      const feedback = container.querySelector('[data-feedback="error"]')
      expect(feedback).toBeTruthy()
    })
    expect(p1Row?.hasAttribute('data-changed')).toBe(true)
  })
})
