import type { Product } from '../types'

const PHONE = '2348036917058'
const GENERIC_MESSAGE = "Hi, I'd like to place an order"

export function buildWhatsAppUrl(product?: Product): string {
  const message = product
    ? `Hi, I'm interested in ${product.name} ${product.size} (${product.units_per_carton} ${product.unit_type}s/carton)`
    : GENERIC_MESSAGE
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`
}
