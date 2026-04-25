export interface Product {
  id: string
  name: string
  size: string
  unit_type: 'bottle' | 'can' | 'pack' | 'cup' | 'pouch'
  units_per_carton: number
  price_ngn: number
  image_path: string | null
  published: boolean
  metadata: Record<string, string>
  internal_notes: string | null
}

export interface Tag {
  id: string
  name: string
  slug: string
  type: string
  sort_order: number
  published: boolean
}

export interface ProductTag {
  product_id: string
  tag_id: string
  sort_order: number
}
