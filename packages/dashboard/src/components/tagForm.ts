import type { Tag } from '../types'
import type { NewTag } from '../lib/supabase'

type SaveFn = (fields: NewTag) => Promise<void>

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function renderTagForm(
  container: HTMLElement,
  existingTag: Tag | null,
  existingTypes: string[],
  onSuccess: () => void,
  saveFn: SaveFn
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
  nameInput.value = existingTag?.name ?? ''
  nameLabel.appendChild(nameInput)
  form.appendChild(nameLabel)

  // Slug
  const slugLabel = document.createElement('label')
  slugLabel.textContent = 'Slug'
  const slugInput = document.createElement('input')
  slugInput.type = 'text'
  slugInput.name = 'slug'
  slugInput.required = true
  slugInput.value = existingTag?.slug ?? ''
  slugLabel.appendChild(slugInput)
  form.appendChild(slugLabel)

  // Auto-fill slug from name, unless slug was manually edited
  let slugManuallyEdited = !!existingTag
  slugInput.addEventListener('input', () => {
    slugManuallyEdited = true
  })
  nameInput.addEventListener('input', () => {
    if (!slugManuallyEdited) {
      slugInput.value = toSlug(nameInput.value)
    }
  })

  // Type (input + datalist)
  const typeLabel = document.createElement('label')
  typeLabel.textContent = 'Type'
  const typeInput = document.createElement('input')
  typeInput.type = 'text'
  typeInput.name = 'type'
  typeInput.required = true
  typeInput.value = existingTag?.type ?? ''
  typeInput.setAttribute('list', 'tag-types-list')

  const datalist = document.createElement('datalist')
  datalist.id = 'tag-types-list'
  existingTypes.forEach(t => {
    const opt = document.createElement('option')
    opt.value = t
    datalist.appendChild(opt)
  })
  typeLabel.appendChild(typeInput)
  typeLabel.appendChild(datalist)
  form.appendChild(typeLabel)

  // Sort order
  const sortLabel = document.createElement('label')
  sortLabel.textContent = 'Sort order'
  const sortInput = document.createElement('input')
  sortInput.type = 'number'
  sortInput.name = 'sort_order'
  sortInput.required = true
  sortInput.min = '0'
  sortInput.value = String(existingTag?.sort_order ?? 0)
  sortLabel.appendChild(sortInput)
  form.appendChild(sortLabel)

  // Published
  const publishedLabel = document.createElement('label')
  publishedLabel.textContent = 'Published'
  const publishedInput = document.createElement('input')
  publishedInput.type = 'checkbox'
  publishedInput.name = 'published'
  publishedInput.checked = existingTag?.published ?? false
  publishedLabel.appendChild(publishedInput)
  form.appendChild(publishedLabel)

  // Submit
  const submitBtn = document.createElement('button')
  submitBtn.type = 'submit'
  submitBtn.textContent = existingTag ? 'Save Changes' : 'Add Tag'
  form.appendChild(submitBtn)

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const fields: NewTag = {
      name: nameInput.value.trim(),
      slug: slugInput.value.trim(),
      type: typeInput.value.trim(),
      sort_order: Number(sortInput.value),
      published: publishedInput.checked,
    }

    submitBtn.disabled = true
    feedback.setAttribute('data-feedback', '')
    feedback.textContent = ''

    saveFn(fields)
      .then(() => {
        onSuccess()
      })
      .catch(() => {
        feedback.setAttribute('data-feedback', 'error')
        feedback.textContent = 'Failed to save tag'
        submitBtn.disabled = false
      })
  })

  container.appendChild(form)
}
