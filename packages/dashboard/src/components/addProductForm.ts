import type { Tag } from '../types'
import type { NewProduct } from '../lib/supabase'

type CreateProductFn = (fields: NewProduct) => Promise<{ id: string }>
type SetProductTagsFn = (productId: string, tagIds: string[]) => Promise<void>

const UNIT_TYPES = ['bottle', 'can', 'pack', 'cup', 'pouch'] as const

export function renderAddProductForm(
  container: HTMLElement,
  tags: Tag[],
  onSuccess: () => void,
  createProductFn: CreateProductFn,
  setProductTagsFn: SetProductTagsFn
): void {
  container.innerHTML = ''

  const feedback = document.createElement('div')
  feedback.setAttribute('data-feedback', '')
  container.appendChild(feedback)

  const form = document.createElement('form')

  // Name
  const nameLabel = document.createElement('label')
  nameLabel.textContent = 'Name'
  const nameInput = document.createElement('input')
  nameInput.type = 'text'
  nameInput.name = 'name'
  nameInput.required = true
  nameLabel.appendChild(nameInput)
  form.appendChild(nameLabel)

  // Size
  const sizeLabel = document.createElement('label')
  sizeLabel.textContent = 'Size'
  const sizeInput = document.createElement('input')
  sizeInput.type = 'text'
  sizeInput.name = 'size'
  sizeInput.required = true
  sizeLabel.appendChild(sizeInput)
  form.appendChild(sizeLabel)

  // Unit type
  const unitTypeLabel = document.createElement('label')
  unitTypeLabel.textContent = 'Unit type'
  const unitTypeSelect = document.createElement('select')
  unitTypeSelect.name = 'unit_type'
  unitTypeSelect.required = true
  UNIT_TYPES.forEach(ut => {
    const opt = document.createElement('option')
    opt.value = ut
    opt.textContent = ut
    unitTypeSelect.appendChild(opt)
  })
  unitTypeLabel.appendChild(unitTypeSelect)
  form.appendChild(unitTypeLabel)

  // Units per carton
  const unitsLabel = document.createElement('label')
  unitsLabel.textContent = 'Units per carton'
  const unitsInput = document.createElement('input')
  unitsInput.type = 'number'
  unitsInput.name = 'units_per_carton'
  unitsInput.required = true
  unitsInput.min = '1'
  unitsLabel.appendChild(unitsInput)
  form.appendChild(unitsLabel)

  // Price
  const priceLabel = document.createElement('label')
  priceLabel.textContent = 'Price (₦)'
  const priceInput = document.createElement('input')
  priceInput.type = 'number'
  priceInput.name = 'price_ngn'
  priceInput.required = true
  priceInput.min = '0'
  priceLabel.appendChild(priceInput)
  form.appendChild(priceLabel)

  // Tags
  const tagsFieldset = document.createElement('fieldset')
  const tagsLegend = document.createElement('legend')
  tagsLegend.textContent = 'Tags'
  tagsFieldset.appendChild(tagsLegend)
  tags.forEach(tag => {
    const tagLabel = document.createElement('label')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.setAttribute('data-tag-id', tag.id)
    tagLabel.appendChild(checkbox)
    tagLabel.appendChild(document.createTextNode(tag.name))
    tagsFieldset.appendChild(tagLabel)
  })
  form.appendChild(tagsFieldset)

  // Submit
  const submitBtn = document.createElement('button')
  submitBtn.type = 'submit'
  submitBtn.textContent = 'Add Product'
  form.appendChild(submitBtn)

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const selectedTagIds = Array.from(
      tagsFieldset.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-tag-id]:checked')
    ).map(cb => cb.getAttribute('data-tag-id') as string)

    const fields: NewProduct = {
      name: nameInput.value.trim(),
      size: sizeInput.value.trim(),
      unit_type: unitTypeSelect.value as NewProduct['unit_type'],
      units_per_carton: Number(unitsInput.value),
      price_ngn: Number(priceInput.value),
      published: false,
    }

    submitBtn.disabled = true
    feedback.setAttribute('data-feedback', '')
    feedback.textContent = ''

    createProductFn(fields)
      .then(({ id }) => setProductTagsFn(id, selectedTagIds))
      .then(() => {
        onSuccess()
      })
      .catch(() => {
        feedback.setAttribute('data-feedback', 'error')
        feedback.textContent = 'Failed to add product'
        submitBtn.disabled = false
      })
  })

  container.appendChild(form)
}
