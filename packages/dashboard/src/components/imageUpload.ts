import type { UpdateProductFields } from '../lib/supabase'

type UploadFn = (productId: string, file: File) => Promise<string>
type UpdateFn = (id: string, fields: UpdateProductFields) => Promise<void>
type GetUrlFn = (path: string) => string

export function renderImageUpload(
  container: HTMLElement,
  productId: string,
  onUploaded: (path: string) => void,
  uploadFn: UploadFn,
  updateFn: UpdateFn,
  getUrlFn?: GetUrlFn
): void {
  container.innerHTML = ''

  const status = document.createElement('span')
  status.setAttribute('data-upload-status', '')
  container.appendChild(status)

  const label = document.createElement('label')
  label.textContent = 'Upload image'

  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.setAttribute('capture', 'environment')

  input.addEventListener('change', () => {
    const file = input.files?.[0]
    if (!file) return

    status.setAttribute('data-upload-status', 'uploading')
    status.textContent = 'Uploading…'

    uploadFn(productId, file)
      .then(path => updateFn(productId, { image_path: path }).then(() => path))
      .then(path => {
        status.setAttribute('data-upload-status', 'success')
        status.textContent = `Uploaded: ${path}`

        // Show preview image (only if getUrlFn is provided to construct a valid URL)
        const existing = container.querySelector('[data-preview]')
        existing?.remove()
        if (getUrlFn) {
          const img = document.createElement('img')
          img.setAttribute('data-preview', path)
          img.src = getUrlFn(path)
          img.alt = 'Product image preview'
          container.appendChild(img)
        }

        onUploaded(path)
      })
      .catch(() => {
        status.setAttribute('data-upload-status', 'error')
        status.textContent = 'Upload failed'
      })
  })

  label.appendChild(input)
  container.appendChild(label)
}
