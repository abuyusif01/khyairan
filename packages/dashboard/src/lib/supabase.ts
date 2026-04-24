import { createClient } from '@supabase/supabase-js'
import type { Product, Tag, ProductTag } from '../types'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string
)

export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, size, unit_type, units_per_carton, price_ngn, image_path, published')

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

export type UpdateProductFields = Partial<Omit<Product, 'id' | 'image_path'>>

export async function updateProduct(id: string, fields: UpdateProductFields): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update(fields)
    .eq('id', id)
  if (error) throw error
}
