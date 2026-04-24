import type { Product, Tag } from '../types'
import type { UpdateProductFields } from '../lib/supabase'
import { renderImageUpload } from './imageUpload'

type UpdateFn = (id: string, fields: UpdateProductFields) => Promise<void>
type SetProductTagsFn = (productId: string, tagIds: string[]) => Promise<void>
type UploadFn = (productId: string, file: File) => Promise<string>

const UNIT_TYPES = ['bottle', 'can', 'pack', 'cup', 'pouch'] as const

export function renderEditProductForm(
  container: HTMLElement,
  product: Product,
  tags: Tag[],
  currentTagIds: string[],
  onSuccess: () => void,
  updateFn: UpdateFn,
  setProductTagsFn: SetProductTagsFn,
  uploadFn?: UploadFn
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
  nameInput.value = product.name
  nameLabel.appendChild(nameInput)
  form.appendChild(nameLabel)

  // Size
  const sizeLabel = document.createElement('label')
  sizeLabel.textContent = 'Size'
  const sizeInput = document.createElement('input')
  sizeInput.type = 'text'
  sizeInput.name = 'size'
  sizeInput.required = true
  sizeInput.value = product.size
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
    if (ut === product.unit_type) opt.selected = true
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
  unitsInput.value = String(product.units_per_carton)
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
  priceInput.value = String(product.price_ngn)
  priceLabel.appendChild(priceInput)
  form.appendChild(priceLabel)

  // Published toggle
  const publishedLabel = document.createElement('label')
  publishedLabel.textContent = 'Published'
  const publishedToggle = document.createElement('input')
  publishedToggle.type = 'checkbox'
  publishedToggle.name = 'published'
  publishedToggle.checked = product.published
  publishedToggle.disabled = product.image_path === null
  if (product.image_path === null) {
    const hint = document.createElement('span')
    hint.textContent = ' (requires image)'
    publishedLabel.appendChild(hint)
  }
  publishedLabel.appendChild(publishedToggle)
  form.appendChild(publishedLabel)

  // Image upload
  if (uploadFn) {
    const imageSection = document.createElement('div')
    if (product.image_path) {
      const imgNote = document.createElement('p')
      imgNote.textContent = `Current image: ${product.image_path}`
      imageSection.appendChild(imgNote)
    }
    renderImageUpload(imageSection, product.id, () => {
      // Re-enable published toggle if it was disabled (image now uploaded)
      publishedToggle.disabled = false
    }, uploadFn, updateFn)
    form.appendChild(imageSection)
  } else if (product.image_path) {
    const imgNote = document.createElement('p')
    imgNote.textContent = `Image: ${product.image_path}`
    form.appendChild(imgNote)
  }

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
    checkbox.checked = currentTagIds.includes(tag.id)
    tagLabel.appendChild(checkbox)
    tagLabel.appendChild(document.createTextNode(tag.name))
    tagsFieldset.appendChild(tagLabel)
  })
  form.appendChild(tagsFieldset)

  // Submit
  const submitBtn = document.createElement('button')
  submitBtn.type = 'submit'
  submitBtn.textContent = 'Save Changes'
  form.appendChild(submitBtn)

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const selectedTagIds = Array.from(
      tagsFieldset.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-tag-id]:checked')
    ).map(cb => cb.getAttribute('data-tag-id') as string)

    const fields: UpdateProductFields = {
      name: nameInput.value.trim(),
      size: sizeInput.value.trim(),
      unit_type: unitTypeSelect.value as Product['unit_type'],
      units_per_carton: Number(unitsInput.value),
      price_ngn: Number(priceInput.value),
      published: publishedToggle.checked,
    }

    submitBtn.disabled = true
    feedback.setAttribute('data-feedback', '')
    feedback.textContent = ''

    updateFn(product.id, fields)
      .then(() => setProductTagsFn(product.id, selectedTagIds))
      .then(() => {
        onSuccess()
      })
      .catch(() => {
        feedback.setAttribute('data-feedback', 'error')
        feedback.textContent = 'Failed to save changes'
        submitBtn.disabled = false
      })
  })

  container.appendChild(form)
}
