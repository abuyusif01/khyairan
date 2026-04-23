import type { Product } from '../types'
import { buildWhatsAppUrl } from './whatsapp'

function formatPrice(priceNgn: number): string {
  return '₦' + priceNgn.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function getOrCreateOverlay(): HTMLElement {
  const existing = document.querySelector('.bottom-sheet-overlay') as HTMLElement | null
  if (existing) return existing

  const overlay = document.createElement('div')
  overlay.className = 'bottom-sheet-overlay'

  const panel = document.createElement('div')
  panel.className = 'bottom-sheet__panel'
  overlay.appendChild(panel)

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hideBottomSheet()
  })

  document.body.appendChild(overlay)
  return overlay
}

export function showBottomSheet(product: Product, imageBaseUrl: string): void {
  const overlay = getOrCreateOverlay()
  const panel = overlay.querySelector('.bottom-sheet__panel') as HTMLElement

  const imageBaseUrlFull = `${imageBaseUrl}/${product.image_path ?? ''}`

  panel.innerHTML = `
    <button class="bottom-sheet__close" aria-label="Close">&times;</button>
    <img
      class="bottom-sheet__image"
      src="${product.image_path ? imageBaseUrlFull : 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'}"
      alt="${product.name}"
      loading="lazy"
    />
    <div class="bottom-sheet__body">
      <p class="bottom-sheet__name">${product.name}</p>
      <p class="bottom-sheet__meta">${product.size} · ${product.unit_type}</p>
      <p class="bottom-sheet__meta">${product.units_per_carton} per carton</p>
      <p class="bottom-sheet__price">${formatPrice(product.price_ngn)}</p>
      <a
        class="bottom-sheet__order-btn"
        href="${buildWhatsAppUrl(product)}"
      >Order on WhatsApp</a>
    </div>
  `

  panel.querySelector('.bottom-sheet__close')!.addEventListener('click', hideBottomSheet)

  overlay.classList.add('is-visible')

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      hideBottomSheet()
      document.removeEventListener('keydown', onKey)
    }
  }
  document.addEventListener('keydown', onKey)
}

export function hideBottomSheet(): void {
  const overlay = document.querySelector('.bottom-sheet-overlay')
  if (overlay) overlay.remove()
}
