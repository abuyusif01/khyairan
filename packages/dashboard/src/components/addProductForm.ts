import type { Tag } from '../types'
import type { NewProduct } from '../lib/supabase'
import { field, backButton } from './formHelpers'

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

  container.appendChild(backButton('Products', onSuccess))

  const card = document.createElement('div')
  card.className = 'form-card'

  const feedback = document.createElement('div')
  feedback.setAttribute('data-feedback', '')
  card.appendChild(feedback)

  const form = document.createElement('form')

  const nameInput = document.createElement('input')
  nameInput.type = 'text'
  nameInput.name = 'name'
  nameInput.required = true
  form.appendChild(field('Name', nameInput))

  const sizeInput = document.createElement('input')
  sizeInput.type = 'text'
  sizeInput.name = 'size'
  sizeInput.required = true
  form.appendChild(field('Size', sizeInput))

  const unitTypeSelect = document.createElement('select')
  unitTypeSelect.name = 'unit_type'
  unitTypeSelect.required = true
  UNIT_TYPES.forEach(ut => {
    const opt = document.createElement('option')
    opt.value = ut
    opt.textContent = ut
    unitTypeSelect.appendChild(opt)
  })
  form.appendChild(field('Unit type', unitTypeSelect))

  const unitsInput = document.createElement('input')
  unitsInput.type = 'number'
  unitsInput.name = 'units_per_carton'
  unitsInput.required = true
  unitsInput.min = '1'
  form.appendChild(field('Units per carton', unitsInput))

  const priceInput = document.createElement('input')
  priceInput.type = 'number'
  priceInput.name = 'price_ngn'
  priceInput.required = true
  priceInput.min = '0'
  form.appendChild(field('Price (₦)', priceInput))

  const tagsFieldset = document.createElement('fieldset')
  const tagsLegend = document.createElement('legend')
  tagsLegend.textContent = 'Tags'
  tagsFieldset.appendChild(tagsLegend)
  const tagOptions = document.createElement('div')
  tagOptions.className = 'tag-options'
  tags.forEach(tag => {
    const tagLabel = document.createElement('label')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.setAttribute('data-tag-id', tag.id)
    tagLabel.appendChild(checkbox)
    tagLabel.appendChild(document.createTextNode(tag.name))
    tagOptions.appendChild(tagLabel)
  })
  tagsFieldset.appendChild(tagOptions)
  form.appendChild(tagsFieldset)

  const submitBtn = document.createElement('button')
  submitBtn.type = 'submit'
  submitBtn.textContent = 'Add Product'
  const actions = document.createElement('div')
  actions.className = 'form-actions'
  actions.appendChild(submitBtn)
  form.appendChild(actions)

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

  card.appendChild(form)
  container.appendChild(card)
}
