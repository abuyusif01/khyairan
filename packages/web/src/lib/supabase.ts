import { createClient } from '@supabase/supabase-js'
import type { Product, Tag, ProductTag, ProductGroup } from '../types'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
)

export async function fetchPublishedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, size, unit_type, units_per_carton, price_ngn, image_path, published')
    .eq('published', true)

  if (error) throw error
  return (data ?? []) as Product[]
}

export async function fetchPublishedCategoryTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, slug, type, sort_order, published')
    .eq('published', true)
    .eq('type', 'category')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []) as Tag[]
}

export function groupProductsByCategory(
  products: Product[],
  tags: Tag[],
  productTags: ProductTag[]
): ProductGroup[] {
  const sortedTags = [...tags].sort((a, b) => a.sort_order - b.sort_order)

  return sortedTags.map(tag => {
    const tagLinks = productTags
      .filter(pt => pt.tag_id === tag.id)
      .sort((a, b) => a.sort_order - b.sort_order)

    const tagProducts = tagLinks
      .map(pt => products.find(p => p.id === pt.product_id))
      .filter((p): p is Product => p !== undefined)

    return { tag, products: tagProducts }
  }).filter(group => group.products.length > 0)
}
