import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Tag } from '../types'

const existingTag: Tag = {
  id: 'tag1',
  name: 'Carbonated',
  slug: 'carbonated',
  type: 'category',
  sort_order: 1,
  published: true,
}

const existingTypes = ['category', 'brand']

describe('renderTagForm', () => {
  let container: HTMLElement
  let saveFn: ReturnType<typeof vi.fn>
  let onSuccess: ReturnType<typeof vi.fn>

  beforeEach(() => {
    container = document.createElement('div')
    saveFn = vi.fn().mockResolvedValue(undefined)
    onSuccess = vi.fn()
  })

  it('renders all form fields', async () => {
    const { renderTagForm } = await import('./tagForm')
    renderTagForm(container, null, existingTypes, onSuccess, saveFn)

    expect(container.querySelector('input[name="name"]')).toBeTruthy()
    expect(container.querySelector('input[name="slug"]')).toBeTruthy()
    expect(container.querySelector('input[name="type"]')).toBeTruthy()
    expect(container.querySelector('input[name="sort_order"]')).toBeTruthy()
    expect(container.querySelector('input[name="published"]')).toBeTruthy()
  })

  it('auto-generates slug from name', async () => {
    const { renderTagForm } = await import('./tagForm')
    renderTagForm(container, null, existingTypes, onSuccess, saveFn)

    const nameInput = container.querySelector<HTMLInputElement>('input[name="name"]')!
    const slugInput = container.querySelector<HTMLInputElement>('input[name="slug"]')!

    nameInput.value = 'Fruit Juices'
    nameInput.dispatchEvent(new Event('input'))

    expect(slugInput.value).toBe('fruit-juices')
  })

  it('does not overwrite manually edited slug', async () => {
    const { renderTagForm } = await import('./tagForm')
    renderTagForm(container, null, existingTypes, onSuccess, saveFn)

    const nameInput = container.querySelector<HTMLInputElement>('input[name="name"]')!
    const slugInput = container.querySelector<HTMLInputElement>('input[name="slug"]')!

    // Manually edit slug
    slugInput.value = 'my-custom-slug'
    slugInput.dispatchEvent(new Event('input'))

    // Then change name
    nameInput.value = 'Something Else'
    nameInput.dispatchEvent(new Event('input'))

    expect(slugInput.value).toBe('my-custom-slug')
  })

  it('pre-fills from existingTag', async () => {
    const { renderTagForm } = await import('./tagForm')
    renderTagForm(container, existingTag, existingTypes, onSuccess, saveFn)

    const nameInput = container.querySelector<HTMLInputElement>('input[name="name"]')!
    const slugInput = container.querySelector<HTMLInputElement>('input[name="slug"]')!
    const typeInput = container.querySelector<HTMLInputElement>('input[name="type"]')!
    const sortOrderInput = container.querySelector<HTMLInputElement>('input[name="sort_order"]')!
    const publishedInput = container.querySelector<HTMLInputElement>('input[name="published"]')!

    expect(nameInput.value).toBe('Carbonated')
    expect(slugInput.value).toBe('carbonated')
    expect(typeInput.value).toBe('category')
    expect(sortOrderInput.value).toBe('1')
    expect(publishedInput.checked).toBe(true)
  })

  it('calls saveFn and onSuccess on valid submit', async () => {
    const { renderTagForm } = await import('./tagForm')
    renderTagForm(container, null, existingTypes, onSuccess, saveFn)

    const nameInput = container.querySelector<HTMLInputElement>('input[name="name"]')!
    const slugInput = container.querySelector<HTMLInputElement>('input[name="slug"]')!
    const typeInput = container.querySelector<HTMLInputElement>('input[name="type"]')!
    const sortOrderInput = container.querySelector<HTMLInputElement>('input[name="sort_order"]')!

    nameInput.value = 'New Tag'
    slugInput.value = 'new-tag'
    typeInput.value = 'category'
    sortOrderInput.value = '5'

    const form = container.querySelector('form')!
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    await vi.waitFor(() => expect(saveFn).toHaveBeenCalledOnce())
    expect(saveFn).toHaveBeenCalledWith({
      name: 'New Tag',
      slug: 'new-tag',
      type: 'category',
      sort_order: 5,
      published: false,
    })
    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalledOnce())
  })

  it('shows error when saveFn throws', async () => {
    saveFn.mockRejectedValueOnce(new Error('save failed'))
    const { renderTagForm } = await import('./tagForm')
    renderTagForm(container, null, existingTypes, onSuccess, saveFn)

    const nameInput = container.querySelector<HTMLInputElement>('input[name="name"]')!
    const slugInput = container.querySelector<HTMLInputElement>('input[name="slug"]')!
    const typeInput = container.querySelector<HTMLInputElement>('input[name="type"]')!
    const sortOrderInput = container.querySelector<HTMLInputElement>('input[name="sort_order"]')!

    nameInput.value = 'New Tag'
    slugInput.value = 'new-tag'
    typeInput.value = 'category'
    sortOrderInput.value = '5'

    const form = container.querySelector('form')!
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

    await vi.waitFor(() => {
      const feedback = container.querySelector('[data-feedback="error"]')
      expect(feedback).toBeTruthy()
    })
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
