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
  metadata: { origin: 'Nigeria', sku: 'CC-35' },
  internal_notes: 'Supplier prefers bulk orders.',
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
  metadata: {},
  internal_notes: null,
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

  it('renders internal_notes textarea pre-filled with current value', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productWithImage, tags, [], onSuccess, updateFn, setProductTagsFn)

    const textarea = container.querySelector<HTMLTextAreaElement>('textarea[name="internal_notes"]')
    expect(textarea).toBeTruthy()
    expect(textarea?.value).toBe('Supplier prefers bulk orders.')
  })

  it('renders internal_notes textarea empty when product has null notes', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productNoImage, tags, [], onSuccess, updateFn, setProductTagsFn)

    const textarea = container.querySelector<HTMLTextAreaElement>('textarea[name="internal_notes"]')
    expect(textarea).toBeTruthy()
    expect(textarea?.value).toBe('')
  })

  it('renders metadata key-value pairs from product', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productWithImage, tags, [], onSuccess, updateFn, setProductTagsFn)

    const metadataSection = container.querySelector('[data-metadata-editor]')
    expect(metadataSection).toBeTruthy()

    const keyInputs = metadataSection!.querySelectorAll<HTMLInputElement>('input[data-meta-key]')
    const valInputs = metadataSection!.querySelectorAll<HTMLInputElement>('input[data-meta-value]')
    expect(keyInputs.length).toBe(2)
    expect(valInputs.length).toBe(2)

    const keys = Array.from(keyInputs).map(i => i.value)
    const vals = Array.from(valInputs).map(i => i.value)
    expect(keys).toContain('origin')
    expect(keys).toContain('sku')
    expect(vals).toContain('Nigeria')
    expect(vals).toContain('CC-35')
  })

  it('add metadata row button creates new key-value inputs', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productNoImage, tags, [], onSuccess, updateFn, setProductTagsFn)

    const metadataSection = container.querySelector('[data-metadata-editor]')
    const addBtn = metadataSection!.querySelector<HTMLButtonElement>('[data-action="add-meta-row"]')
    expect(addBtn).toBeTruthy()

    const before = metadataSection!.querySelectorAll('input[data-meta-key]').length
    addBtn!.click()
    const after = metadataSection!.querySelectorAll('input[data-meta-key]').length
    expect(after).toBe(before + 1)
  })

  it('remove metadata row button removes that row', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productWithImage, tags, [], onSuccess, updateFn, setProductTagsFn)

    const metadataSection = container.querySelector('[data-metadata-editor]')
    const rows = metadataSection!.querySelectorAll('[data-meta-row]')
    expect(rows.length).toBe(2)

    const firstRow = rows[0] as HTMLElement
    const removeBtn = firstRow.querySelector<HTMLButtonElement>('[data-action="remove-meta-row"]')
    expect(removeBtn).toBeTruthy()
    removeBtn!.click()

    const remaining = metadataSection!.querySelectorAll('[data-meta-row]')
    expect(remaining.length).toBe(1)
  })

  it('submit includes internal_notes and metadata from form', async () => {
    const { renderEditProductForm } = await import('./editProductForm')
    renderEditProductForm(container, productWithImage, tags, ['tag1'], onSuccess, updateFn, setProductTagsFn)

    const notesTextarea = container.querySelector<HTMLTextAreaElement>('textarea[name="internal_notes"]')!
    notesTextarea.value = 'Updated note'

    const form = container.querySelector('form')!
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    await vi.waitFor(() => expect(updateFn).toHaveBeenCalledOnce())

    const callArgs = updateFn.mock.calls[0][1]
    expect(callArgs.internal_notes).toBe('Updated note')
    expect(callArgs.metadata).toEqual({ origin: 'Nigeria', sku: 'CC-35' })
  })
})
