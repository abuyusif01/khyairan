/**
 * Image processing logic for the process-image Edge Function.
 * Extracted as a separate module for testability.
 *
 * Library: @cf-wasm/photon (others build) — WASM-based, works in Deno/Edge Functions.
 * Supports WebP encode/decode, JPEG, PNG. No native binaries required.
 *
 * Import strategy: use the `others` build from esm.sh (which supports manual
 * WASM initialisation via initPhoton) + load the WASM binary directly from
 * unpkg. This avoids esm.sh's broken `photon.wasm.mjs` auto-transform.
 */
import {
  PhotonImage,
  resize,
  initPhoton,
} from 'https://esm.sh/@cf-wasm/photon@0.3.1/dist/others.js'

// WASM binary served directly from the npm registry — no esm.sh transformation.
const WASM_URL = 'https://unpkg.com/@cf-wasm/photon@0.3.1/dist/lib/photon_rs_bg.wasm'

export const MAX_DIMENSION = 800
export const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
])

let photonReady: Promise<void> | null = null

async function ensurePhoton(): Promise<void> {
  if (!photonReady) {
    photonReady = initPhoton({ module_or_path: fetch(WASM_URL) }).then(() => undefined)
  }
  await photonReady
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

  await ensurePhoton()

  let img = PhotonImage.new_from_byteslice(inputBytes)

  try {
    const origW = img.get_width()
    const origH = img.get_height()

    const longest = Math.max(origW, origH)
    if (longest > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / longest
      const newW = Math.round(origW * scale)
      const newH = Math.round(origH * scale)
      const resized = resize(img, newW, newH, 5) // 5 = Lanczos3
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
