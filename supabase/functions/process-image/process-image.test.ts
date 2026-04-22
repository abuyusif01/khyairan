/**
 * Unit tests for image processing logic.
 *
 * Run with: deno test --allow-net supabase/functions/process-image/process-image.test.ts
 *
 * NOTE: Requires Deno runtime (not in Flox env by default).
 * Add deno to Flox: flox install deno
 * Or run with: nix run nixpkgs#deno -- test --allow-net ...
 */
import { assertEquals, assertExists, assert } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { Image } from 'https://deno.land/x/imagescript@1.3.0/mod.ts'
import { processImage, MAX_DIMENSION, ALLOWED_MIME_TYPES } from './process.ts'

/** Create a minimal valid PNG buffer at the given dimensions. */
async function createTestPng(width: number, height: number): Promise<Uint8Array> {
  const img = new Image(width, height)
  img.fill(0xff0000ff) // solid red
  return await img.encode(1) // PNG
}

Deno.test('converts PNG to WebP', async () => {
  const pngBytes = await createTestPng(100, 100)
  const result = await processImage(pngBytes, 'image/png')

  assertExists(result, 'result should not be null for a valid PNG')
  assertEquals(result.contentType, 'image/webp', 'output content-type should be image/webp')
  assert(result.bytes.length > 0, 'output bytes should be non-empty')
})

Deno.test('resizes large image to max 800px', async () => {
  const pngBytes = await createTestPng(2000, 1500)
  const result = await processImage(pngBytes, 'image/png')

  assertExists(result)
  assertEquals(result.width, 800, 'width should be exactly 800px')
  assertEquals(result.height, 600, 'height should be exactly 600px (aspect ratio preserved)')
})

Deno.test('preserves aspect ratio', async () => {
  const pngBytes = await createTestPng(1000, 500)
  const result = await processImage(pngBytes, 'image/png')

  assertExists(result)
  assertEquals(result.width, 800, 'width should be 800px')
  assertEquals(result.height, 400, 'height should be 400px (preserving 2:1 ratio)')
})

Deno.test('rejects non-image file', async () => {
  const textBytes = new TextEncoder().encode('Hello, not an image!')
  const result = await processImage(textBytes, 'text/plain')

  assertEquals(result, null, 'result should be null for non-image mime type')
})

Deno.test('does not resize image smaller than max dimension', async () => {
  const pngBytes = await createTestPng(400, 300)
  const result = await processImage(pngBytes, 'image/png')

  assertExists(result)
  assertEquals(result.width, 400, 'width should remain unchanged at 400px')
  assertEquals(result.height, 300, 'height should remain unchanged at 300px')
})

Deno.test('MAX_DIMENSION is 800', () => {
  assertEquals(MAX_DIMENSION, 800)
})
