/**
 * Image processing logic for the process-image Edge Function.
 * Extracted as a separate module for testability.
 *
 * Library: @cf-wasm/photon — WASM-based, works in Deno/Edge Functions.
 * Supports WebP encode/decode, JPEG, PNG. No native binaries required.
 */
import Photon from 'https://esm.sh/@cf-wasm/photon@0.3.1'

export const MAX_DIMENSION = 800
export const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
])

let photonInitialised = false

async function getPhoton(): Promise<typeof Photon> {
  if (!photonInitialised) {
    await Photon.run()
    photonInitialised = true
  }
  return Photon
}

export interface ProcessResult {
  bytes: Uint8Array
  contentType: 'image/webp'
  width: number
  height: number
}

/**
 * Process an image: validate mime type, resize to max dimension, convert to WebP.
 * Returns null if the mime type is not an image (caller should skip/ignore).
 */
export async function processImage(
  inputBytes: Uint8Array,
  mimeType: string,
): Promise<ProcessResult | null> {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return null
  }

  const photon = await getPhoton()
  let img = photon.PhotonImage.new_from_byteslice(inputBytes)

  try {
    const origW = img.get_width()
    const origH = img.get_height()

    const longest = Math.max(origW, origH)
    if (longest > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / longest
      const newW = Math.round(origW * scale)
      const newH = Math.round(origH * scale)
      const resized = photon.resize(img, newW, newH, 1) // 1 = Lanczos3
      img.free()
      img = resized
    }

    const width = img.get_width()
    const height = img.get_height()
    const bytes = img.get_bytes_webp()

    return { bytes, contentType: 'image/webp', width, height }
  } finally {
    img.free()
  }
}
