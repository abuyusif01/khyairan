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
