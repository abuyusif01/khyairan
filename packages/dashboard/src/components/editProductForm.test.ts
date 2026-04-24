import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Product, Tag } from '../types'

const tags: Tag[] = [
  { id: 'tag1', name: 'Carbonated', slug: 'carbonated', type: 'category', sort_order: 1, published: true },
  { id: 'tag2', name: 'Juices', slug: 'juices', type: 'category', sort_order: 2, published: true },
]

const productWithImage: Product = {
  id: 'p1',
  name: 'Coca-Cola',
  size: '35CL',
  unit_type: 'bottle',
  units_per_carton: 24,
  price_ngn: 4500,
  image_path: 'products/p1.jpg',
  published: true,
}

const productNoImage: Product = {
  id: 'p2',
  name: 'Sprite',
  size: '35CL',
  unit_type: 'can',
  units_per_carton: 24,
  price_ngn: 4200,
  image_path: null,
  published: false,
}

describe('renderEditProductForm', () => {
  let container: HTMLElement
  let updateFn: ReturnType<typeof vi.fn>
  let setProductTagsFn: ReturnType<typeof vi.fn>
  let onSuccess: ReturnType<typeof vi.fn>

  beforeEach(() => {
    container = document.createElement('div')
    updateFn = vi.fn().mockResolvedValue(undefined)
    setProductTagsFn = vi.fn().mockResolvedValue(undefined)
    onSuccess = vi.fn()
  })

  it('renders form pre-filled with product values', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productWithImage, tags, ['tag1'], onSuccess, updateFn, setProductTagsFn)

    const nameInput = container.querySelector<HTMLInputElement>('input[name="name"]')
    const sizeInput = container.querySelector<HTMLInputElement>('input[name="size"]')
    const unitTypeSelect = container.querySelector<HTMLSelectElement>('select[name="unit_type"]')
    const unitsInput = container.querySelector<HTMLInputElement>('input[name="units_per_carton"]')
    const priceInput = container.querySelector<HTMLInputElement>('input[name="price_ngn"]')

    expect(nameInput?.value).toBe('Coca-Cola')
    expect(sizeInput?.value).toBe('35CL')
    expect(unitTypeSelect?.value).toBe('bottle')
    expect(unitsInput?.value).toBe('24')
    expect(priceInput?.value).toBe('4500')
  })

  it('published toggle is disabled when image_path is null', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productNoImage, tags, [], onSuccess, updateFn, setProductTagsFn)

    const publishedToggle = container.querySelector<HTMLInputElement>('input[name="published"]')
    expect(publishedToggle?.disabled).toBe(true)
  })

  it('published toggle is enabled when image_path is set', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productWithImage, tags, ['tag1'], onSuccess, updateFn, setProductTagsFn)

    const publishedToggle = container.querySelector<HTMLInputElement>('input[name="published"]')
    expect(publishedToggle?.disabled).toBe(false)
    expect(publishedToggle?.checked).toBe(true)
  })

  it('pre-checks tag checkboxes for current product tags', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productWithImage, tags, ['tag1'], onSuccess, updateFn, setProductTagsFn)

    const tag1Checkbox = container.querySelector<HTMLInputElement>('[data-tag-id="tag1"]')
    const tag2Checkbox = container.querySelector<HTMLInputElement>('[data-tag-id="tag2"]')

    expect(tag1Checkbox?.checked).toBe(true)
    expect(tag2Checkbox?.checked).toBe(false)
  })

  it('calls updateProduct and setProductTags on submit', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productWithImage, tags, ['tag1'], onSuccess, updateFn, setProductTagsFn)

    const priceInput = container.querySelector<HTMLInputElement>('input[name="price_ngn"]')!
    priceInput.value = '5000'

    const tag2Checkbox = container.querySelector<HTMLInputElement>('[data-tag-id="tag2"]')!
    tag2Checkbox.checked = true

    const form = container.querySelector('form')!
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    await vi.waitFor(() => expect(updateFn).toHaveBeenCalledOnce())

    expect(updateFn).toHaveBeenCalledWith('p1', {
      name: 'Coca-Cola',
      size: '35CL',
      unit_type: 'bottle',
      units_per_carton: 24,
      price_ngn: 5000,
      published: true,
    })
    expect(setProductTagsFn).toHaveBeenCalledWith('p1', expect.arrayContaining(['tag1', 'tag2']))
  })

  it('calls onSuccess after successful submit', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productWithImage, tags, [], onSuccess, updateFn, setProductTagsFn)

    const form = container.querySelector('form')!
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalledOnce())
  })

  it('shows error feedback when updateProduct throws', async () => {
    updateFn.mockRejectedValueOnce(new Error('update failed'))
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productWithImage, tags, [], onSuccess, updateFn, setProductTagsFn)

    const form = container.querySelector('form')!
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    await vi.waitFor(() => {
      const feedback = container.querySelector('[data-feedback="error"]')
      expect(feedback).toBeTruthy()
    })
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
