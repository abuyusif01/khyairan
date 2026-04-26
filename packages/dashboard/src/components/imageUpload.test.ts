import { describe, it, expect, vi, beforeEach } from 'vitest'

const PRODUCT_ID = 'p1'
const STORAGE_PATH = 'products/p1'

describe('renderImageUpload', () => {
  let container: HTMLElement
  let uploadFn: ReturnType<typeof vi.fn>
  let updateFn: ReturnType<typeof vi.fn>
  let onUploaded: ReturnType<typeof vi.fn>

  beforeEach(() => {
    container = document.createElement('div')
    uploadFn = vi.fn().mockResolvedValue(STORAGE_PATH)
    updateFn = vi.fn().mockResolvedValue(undefined)
    onUploaded = vi.fn()
  })

  it('renders file input with image accept and camera capture', async () => {
    const { renderImageUpload } = await import('./imageUpload')
    renderImageUpload(container, PRODUCT_ID, onUploaded, uploadFn, updateFn)

    const input = container.querySelector<HTMLInputElement>('input[type="file"]')
    expect(input).toBeTruthy()
    expect(input?.accept).toBe('image/*')
    expect(input?.getAttribute('capture')).toBe('environment')
  })

  it('shows uploading status during file selection', async () => {
    const { renderImageUpload } = await import('./imageUpload')

    // Make upload take a while so we can check interim state
    let resolveUpload!: (v: string) => void
    uploadFn.mockReturnValueOnce(new Promise<string>(r => { resolveUpload = r }))

    renderImageUpload(container, PRODUCT_ID, onUploaded, uploadFn, updateFn)

    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input, 'files', { value: [file] })
    input.dispatchEvent(new Event('change'))

    const status = container.querySelector('[data-upload-status]')
    expect(status?.textContent).toContain('Uploading')

    resolveUpload(STORAGE_PATH)
  })

  it('calls uploadFn and updateFn on file selection', async () => {
    const { renderImageUpload } = await import('./imageUpload')
    renderImageUpload(container, PRODUCT_ID, onUploaded, uploadFn, updateFn)

    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input, 'files', { value: [file] })
    input.dispatchEvent(new Event('change'))

    await vi.waitFor(() => expect(uploadFn).toHaveBeenCalledOnce())
    expect(uploadFn).toHaveBeenCalledWith(PRODUCT_ID, file)
    expect(updateFn).toHaveBeenCalledWith(PRODUCT_ID, { image_path: STORAGE_PATH })
  })

  it('calls onUploaded with path after success', async () => {
    const { renderImageUpload } = await import('./imageUpload')
    renderImageUpload(container, PRODUCT_ID, onUploaded, uploadFn, updateFn)

    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input, 'files', { value: [file] })
    input.dispatchEvent(new Event('change'))

    await vi.waitFor(() => expect(onUploaded).toHaveBeenCalledWith(STORAGE_PATH))
  })

  it('shows img preview after upload when getUrlFn provided', async () => {
    const { renderImageUpload } = await import('./imageUpload')
    const getUrlFn = vi.fn().mockReturnValue('https://cdn.test/img.jpg')
    renderImageUpload(container, PRODUCT_ID, onUploaded, uploadFn, updateFn, getUrlFn)

    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input, 'files', { value: [file] })
    input.dispatchEvent(new Event('change'))

    await vi.waitFor(() => {
      const preview = container.querySelector<HTMLImageElement>('[data-preview]')
      expect(preview).toBeTruthy()
      expect(preview?.getAttribute('data-preview')).toBe(STORAGE_PATH)
    })
  })

  it('image preview sets src to getUrlFn result', async () => {
    const { renderImageUpload } = await import('./imageUpload')
    const getUrlFn = vi.fn().mockReturnValue('https://cdn.test/img.jpg')
    renderImageUpload(container, PRODUCT_ID, onUploaded, uploadFn, updateFn, getUrlFn)

    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input, 'files', { value: [file] })
    input.dispatchEvent(new Event('change'))

    await vi.waitFor(() => {
      const img = container.querySelector<HTMLImageElement>('[data-preview]')
      expect(img).toBeTruthy()
      expect(img!.src).toBe('https://cdn.test/img.jpg')
    })
    expect(getUrlFn).toHaveBeenCalledWith(STORAGE_PATH)
  })

  it('no img rendered when getUrlFn not provided', async () => {
    const { renderImageUpload } = await import('./imageUpload')
    renderImageUpload(container, PRODUCT_ID, onUploaded, uploadFn, updateFn)

    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input, 'files', { value: [file] })
    input.dispatchEvent(new Event('change'))

    await vi.waitFor(() => expect(onUploaded).toHaveBeenCalled())
    expect(container.querySelector('[data-preview]')).toBeNull()
  })

  it('shows error status when upload fails', async () => {
    uploadFn.mockRejectedValueOnce(new Error('storage error'))
    const { renderImageUpload } = await import('./imageUpload')
    renderImageUpload(container, PRODUCT_ID, onUploaded, uploadFn, updateFn)

    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' })
    Object.defineProperty(input, 'files', { value: [file] })
    input.dispatchEvent(new Event('change'))

    await vi.waitFor(() => {
      const status = container.querySelector('[data-upload-status="error"]')
      expect(status).toBeTruthy()
    })
    expect(onUploaded).not.toHaveBeenCalled()
  })
})
