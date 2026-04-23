import type { ProductGroup } from '../types'
import { buildWhatsAppUrl } from './whatsapp'

function formatPrice(priceNgn: number): string {
  return '₦' + priceNgn.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function renderProductGrid(
  groups: ProductGroup[],
  container: HTMLElement,
  imageBaseUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/product-images`
): void {
  container.innerHTML = ''

  for (const group of groups) {
    const section = document.createElement('section')
    section.className = 'category-section'
    section.id = `category-${group.tag.slug}`

    const heading = document.createElement('h2')
    heading.className = 'category-heading'
    heading.textContent = group.tag.name
    section.appendChild(heading)

    const grid = document.createElement('div')
    grid.className = 'product-cards'

    for (const product of group.products) {
      const card = document.createElement('div')
      card.className = 'product-card'

      const img = document.createElement('img')
      img.className = 'product-card__image'
      img.src = product.image_path
        ? `${imageBaseUrl}/${product.image_path}`
        : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'
      img.alt = product.name
      img.setAttribute('loading', 'lazy')

      const body = document.createElement('div')
      body.className = 'product-card__body'

      const name = document.createElement('p')
      name.className = 'product-card__name'
      name.textContent = product.name

      const meta = document.createElement('p')
      meta.className = 'product-card__meta'
      meta.textContent = `${product.size} · ${product.unit_type}`

      const cartons = document.createElement('p')
      cartons.className = 'product-card__meta'
      cartons.textContent = `${product.units_per_carton} per carton`

      const footer = document.createElement('div')
      footer.className = 'product-card__footer'

      const price = document.createElement('span')
      price.className = 'product-card__price'
      price.textContent = formatPrice(product.price_ngn)

      const waLink = document.createElement('a')
      waLink.className = 'product-card__wa'
      waLink.href = buildWhatsAppUrl(product)
      waLink.target = '_blank'
      waLink.rel = 'noopener noreferrer'
      waLink.setAttribute('aria-label', `Order ${product.name} on WhatsApp`)
      waLink.textContent = '💬'

      footer.appendChild(price)
      footer.appendChild(waLink)
      body.appendChild(name)
      body.appendChild(meta)
      body.appendChild(cartons)
      body.appendChild(footer)
      card.appendChild(img)
      card.appendChild(body)
      grid.appendChild(card)
    }

    section.appendChild(grid)
    container.appendChild(section)
  }
}
