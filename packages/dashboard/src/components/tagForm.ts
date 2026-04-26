import type { Tag } from '../types'
import type { NewTag } from '../lib/supabase'
import { field, checkField, backButton } from './formHelpers'

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

  container.appendChild(backButton('Tags', onSuccess))

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
  nameInput.value = existingTag?.name ?? ''
  form.appendChild(field('Name', nameInput))

  const slugInput = document.createElement('input')
  slugInput.type = 'text'
  slugInput.name = 'slug'
  slugInput.required = true
  slugInput.value = existingTag?.slug ?? ''
  form.appendChild(field('Slug', slugInput))

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
  form.appendChild(field('Type', typeInput))
  form.appendChild(datalist)

  const sortInput = document.createElement('input')
  sortInput.type = 'number'
  sortInput.name = 'sort_order'
  sortInput.required = true
  sortInput.min = '0'
  sortInput.value = String(existingTag?.sort_order ?? 0)
  form.appendChild(field('Sort order', sortInput))

  const publishedInput = document.createElement('input')
  publishedInput.type = 'checkbox'
  publishedInput.name = 'published'
  publishedInput.checked = existingTag?.published ?? false
  form.appendChild(checkField('Published', publishedInput))

  const submitBtn = document.createElement('button')
  submitBtn.type = 'submit'
  submitBtn.textContent = existingTag ? 'Save Changes' : 'Add Tag'
  const actions = document.createElement('div')
  actions.className = 'form-actions'
  actions.appendChild(submitBtn)
  form.appendChild(actions)

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

  card.appendChild(form)
  container.appendChild(card)
}
