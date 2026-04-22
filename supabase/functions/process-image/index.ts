/**
 * process-image — Supabase Edge Function
 *
 * Triggered via Supabase Webhook (Database webhook on storage.objects INSERT).
 * Downloads the uploaded file, converts to WebP at max 800px, re-uploads in place.
 *
 * Deploy: supabase functions deploy process-image
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { processImage } from './process.ts'

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const payload = await req.json() as {
      record?: { bucket_id?: string; name?: string; metadata?: { mimetype?: string } }
    }

    const record = payload.record
    if (!record || record.bucket_id !== 'product-images' || !record.name) {
      return new Response('skip — not a product-images upload', { status: 200 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Download original image
    const { data: blob, error: downloadError } = await supabase.storage
      .from('product-images')
      .download(record.name)

    if (downloadError || !blob) {
      return new Response(`download failed: ${downloadError?.message}`, { status: 500 })
    }

    const mimeType = record.metadata?.mimetype ?? blob.type ?? ''
    const inputBytes = new Uint8Array(await blob.arrayBuffer())

    // Process (resize + WebP conversion)
    const result = await processImage(inputBytes, mimeType)
    if (!result) {
      // Non-image — leave unchanged
      return new Response('skip — not an image mime type', { status: 200 })
    }

    // Replace original with processed version
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(record.name, result.bytes, {
        contentType: result.contentType,
        upsert: true,
      })

    if (uploadError) {
      return new Response(`upload failed: ${uploadError.message}`, { status: 500 })
    }

    return new Response(
      JSON.stringify({ processed: true, width: result.width, height: result.height }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(`error: ${(err as Error).message}`, { status: 500 })
  }
})
