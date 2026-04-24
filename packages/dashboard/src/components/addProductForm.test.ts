import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Tag } from '../types'

const tags: Tag[] = [
  { id: 'tag1', name: 'Carbonated', slug: 'carbonated', type: 'category', sort_order: 1, published: true },
  { id: 'tag2', name: 'Juices', slug: 'juices', type: 'category', sort_order: 2, published: true },
  { id: 'tag3', name: 'Chivita', slug: 'chivita', type: 'brand', sort_order: 1, published: true },
]

const validFields = {
  name: 'Coca-Cola',
  size: '35CL',
  unit_type: 'bottle',
  units_per_carton: '24',
  price_ngn: '4500',
}

describe('renderAddProductForm', () => {
  let container: HTMLElement
  let createProductFn: ReturnType<typeof vi.fn>
  let setProductTagsFn: ReturnType<typeof vi.fn>
  let onSuccess: ReturnType<typeof vi.fn>

  beforeEach(() => {
    container = document.createElement('div')
    createProductFn = vi.fn().mockResolvedValue({ id: 'new-p1' })
    setProductTagsFn = vi.fn().mockResolvedValue(undefined)
    onSuccess = vi.fn()
  })

  it('renders all required form fields', async () => {
    const { renderAddProductForm } = await import('./addProductForm')
    renderAddProductForm(container, tags, onSuccess, createProductFn, setProductTagsFn)

    expect(container.querySelector('input[name="name"]')).toBeTruthy()
    expect(container.querySelector('input[name="size"]')).toBeTruthy()
    expect(container.querySelector('select[name="unit_type"]')).toBeTruthy()
    expect(container.querySelector('input[name="units_per_carton"]')).toBeTruthy()
    expect(container.querySelector('input[name="price_ngn"]')).toBeTruthy()

    const unitTypeSelect = container.querySelector<HTMLSelectElement>('select[name="unit_type"]')
    expect(unitTypeSelect?.options.length).toBe(5)
  })

  it('renders tag checkboxes for each tag', async () => {
    const { renderAddProductForm } = await import('./addProductForm')
    renderAddProductForm(container, tags, onSuccess, createProductFn, setProductTagsFn)

    const checkboxes = container.querySelectorAll('input[type="checkbox"][data-tag-id]')
    expect(checkboxes.length).toBe(3)
    expect(container.textContent).toContain('Carbonated')
    expect(container.textContent).toContain('Juices')
    expect(container.textContent).toContain('Chivita')
  })

  it('calls createProduct and setProductTags on valid submit', async () => {
    const { renderAddProductForm } = await import('./addProductForm')
    renderAddProductForm(container, tags, onSuccess, createProductFn, setProductTagsFn)

    const nameInput = container.querySelector<HTMLInputElement>('input[name="name"]')!
    const sizeInput = container.querySelector<HTMLInputElement>('input[name="size"]')!
    const unitTypeSelect = container.querySelector<HTMLSelectElement>('select[name="unit_type"]')!
    const unitsInput = container.querySelector<HTMLInputElement>('input[name="units_per_carton"]')!
    const priceInput = container.querySelector<HTMLInputElement>('input[name="price_ngn"]')!

    nameInput.value = validFields.name
    sizeInput.value = validFields.size
    unitTypeSelect.value = validFields.unit_type
    unitsInput.value = validFields.units_per_carton
    priceInput.value = validFields.price_ngn

    // Select tag1 checkbox
    const tag1Checkbox = container.querySelector<HTMLInputElement>('[data-tag-id="tag1"]')!
    tag1Checkbox.checked = true

    const form = container.querySelector('form')!
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    await vi.waitFor(() => expect(createProductFn).toHaveBeenCalledOnce())

    expect(createProductFn).toHaveBeenCalledWith({
      name: 'Coca-Cola',
      size: '35CL',
      unit_type: 'bottle',
      units_per_carton: 24,
      price_ngn: 4500,
      published: false,
    })
    expect(setProductTagsFn).toHaveBeenCalledWith('new-p1', ['tag1'])
  })

  it('calls onSuccess after successful submit', async () => {
    const { renderAddProductForm } = await import('./addProductForm')
    renderAddProductForm(container, tags, onSuccess, createProductFn, setProductTagsFn)

    const nameInput = container.querySelector<HTMLInputElement>('input[name="name"]')!
    const sizeInput = container.querySelector<HTMLInputElement>('input[name="size"]')!
    const unitTypeSelect = container.querySelector<HTMLSelectElement>('select[name="unit_type"]')!
    const unitsInput = container.querySelector<HTMLInputElement>('input[name="units_per_carton"]')!
    const priceInput = container.querySelector<HTMLInputElement>('input[name="price_ngn"]')!

    nameInput.value = validFields.name
    sizeInput.value = validFields.size
    unitTypeSelect.value = validFields.unit_type
    unitsInput.value = validFields.units_per_carton
    priceInput.value = validFields.price_ngn

    const form = container.querySelector('form')!
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalledOnce())
  })

  it('shows error feedback when createProduct throws', async () => {
    createProductFn.mockRejectedValueOnce(new Error('insert failed'))
    const { renderAddProductForm } = await import('./addProductForm')
    renderAddProductForm(container, tags, onSuccess, createProductFn, setProductTagsFn)

    const nameInput = container.querySelector<HTMLInputElement>('input[name="name"]')!
    const sizeInput = container.querySelector<HTMLInputElement>('input[name="size"]')!
    const unitTypeSelect = container.querySelector<HTMLSelectElement>('select[name="unit_type"]')!
    const unitsInput = container.querySelector<HTMLInputElement>('input[name="units_per_carton"]')!
    const priceInput = container.querySelector<HTMLInputElement>('input[name="price_ngn"]')!

    nameInput.value = validFields.name
    sizeInput.value = validFields.size
    unitTypeSelect.value = validFields.unit_type
    unitsInput.value = validFields.units_per_carton
    priceInput.value = validFields.price_ngn

    const form = container.querySelector('form')!
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    await vi.waitFor(() => {
      const feedback = container.querySelector('[data-feedback="error"]')
      expect(feedback).toBeTruthy()
    })
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
