import { createClient } from '@supabase/supabase-js'
import type { Product, Tag, ProductTag } from '../types'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string
)

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, size, unit_type, units_per_carton, price_ngn, image_path, published, metadata, internal_notes')

  if (error) throw error
  return (data ?? []) as Product[]
}

export async function fetchCategoryTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, slug, type, sort_order, published')
    .eq('type', 'category')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []) as Tag[]
}

export async function fetchProductTags(): Promise<ProductTag[]> {
  const { data, error } = await supabase
    .from('product_tags')
    .select('product_id, tag_id, sort_order')

  if (error) throw error
  return (data ?? []) as ProductTag[]
}

export async function updateProductPrices(
  updates: { id: string; price_ngn: number }[]
): Promise<void> {
  for (const { id, price_ngn } of updates) {
    const { error } = await supabase
      .from('products')
      .update({ price_ngn })
      .eq('id', id)
    if (error) throw error
  }
}

export interface NewProduct {
  name: string
  size: string
  unit_type: Product['unit_type']
  units_per_carton: number
  price_ngn: number
  published: boolean
}

export async function createProduct(fields: NewProduct): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('products')
    .insert(fields)
    .select('id')
  if (error) throw error
  return (data as { id: string }[])[0]
}

export async function setProductTags(productId: string, tagIds: string[]): Promise<void> {
  const { error: delError } = await supabase
    .from('product_tags')
    .delete()
    .eq('product_id', productId)
  if (delError) throw delError

  if (tagIds.length === 0) return

  const { error } = await supabase.from('product_tags').upsert(
    tagIds.map((tag_id, sort_order) => ({ product_id: productId, tag_id, sort_order }))
  )
  if (error) throw error
}

export async function fetchAllTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, slug, type, sort_order, published')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []) as Tag[]
}

export type UpdateProductFields = Partial<Omit<Product, 'id' | 'image_path'>> & { image_path?: string | null }

export async function updateProduct(id: string, fields: UpdateProductFields): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update(fields)
    .eq('id', id)
  if (error) throw error
}

export interface NewTag {
  name: string
  slug: string
  type: string
  sort_order: number
  published: boolean
}

export async function createTag(fields: NewTag): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from('tags')
    .insert(fields)
    .select('id')
  if (error) throw error
  return (data as { id: string }[])[0]
}

export type UpdateTagFields = Partial<NewTag>

export async function updateTag(id: string, fields: UpdateTagFields): Promise<void> {
  const { error } = await supabase
    .from('tags')
    .update(fields)
    .eq('id', id)
  if (error) throw error
}

export async function toggleTagPublished(tagId: string, published: boolean): Promise<void> {
  const { error } = await supabase
    .from('tags')
    .update({ published })
    .eq('id', tagId)
  if (error) throw error
}

export async function deleteTag(tagId: string): Promise<void> {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId)
  if (error) throw error
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
  if (error) throw error
}

export async function updateTagOrder(updates: Array<{ tagId: string; sortOrder: number }>): Promise<void> {
  for (const { tagId, sortOrder } of updates) {
    const { error } = await supabase
      .from('tags')
      .update({ sort_order: sortOrder })
      .eq('id', tagId)
    if (error) throw error
  }
}

export async function updateProductTagOrder(
  tagId: string,
  updates: Array<{ productId: string; sortOrder: number }>
): Promise<void> {
  const { error } = await supabase.from('product_tags').upsert(
    updates.map(({ productId, sortOrder }) => ({
      product_id: productId,
      tag_id: tagId,
      sort_order: sortOrder,
    }))
  )
  if (error) throw error
}

export async function countProductsForTag(tagId: string): Promise<number> {
  const { count, error } = await supabase
    .from('product_tags')
    .select('product_id', { count: 'exact', head: true })
    .eq('tag_id', tagId)
  if (error) throw error
  return count ?? 0
}

export function getProductImageUrl(path: string): string {
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

export async function uploadProductImage(productId: string, file: File): Promise<string> {
  const path = `products/${productId}`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, file, { upsert: true })
  if (error) throw error
  return path
}
