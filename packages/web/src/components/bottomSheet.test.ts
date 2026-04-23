import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { Product } from '../types'
import { showBottomSheet, hideBottomSheet } from './bottomSheet'

const product: Product = {
  id: 'p1',
  name: 'Coca-Cola',
  size: '35CL',
  unit_type: 'bottle',
  units_per_carton: 12,
  price_ngn: 4500,
  image_path: 'coca-cola.webp',
  published: true,
}

describe('bottomSheet', () => {
  afterEach(() => {
    document.querySelectorAll('.bottom-sheet-overlay').forEach(el => el.remove())
    document.removeEventListener('keydown', () => {})
  })

  beforeEach(() => {
    document.querySelectorAll('.bottom-sheet-overlay').forEach(el => el.remove())
  })

  it('showBottomSheet renders product name and price', () => {
    showBottomSheet(product, 'https://test.supabase.co/storage')
    const sheet = document.querySelector('.bottom-sheet-overlay')
    expect(sheet).toBeTruthy()
    expect(sheet!.textContent).toContain('Coca-Cola')
    expect(sheet!.textContent).toContain('₦4,500')
  })

  it('Order button has correct WhatsApp href', () => {
    showBottomSheet(product, 'https://test.supabase.co/storage')
    const btn = document.querySelector('.bottom-sheet__order-btn') as HTMLAnchorElement
    expect(btn).toBeTruthy()
    expect(btn.href).toContain('wa.me/2348036917058')
    expect(btn.href).toContain('Coca-Cola')
  })

  it('backdrop click hides the sheet', () => {
    showBottomSheet(product, 'https://test.supabase.co/storage')
    const overlay = document.querySelector('.bottom-sheet-overlay') as HTMLElement
    expect(overlay).toBeTruthy()
    overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(document.querySelector('.bottom-sheet-overlay')).toBeNull()
  })

  it('ESC key hides the sheet', () => {
    showBottomSheet(product, 'https://test.supabase.co/storage')
    expect(document.querySelector('.bottom-sheet-overlay')).toBeTruthy()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(document.querySelector('.bottom-sheet-overlay')).toBeNull()
  })

  it('showBottomSheet twice reuses same element', () => {
    showBottomSheet(product, 'https://test.supabase.co/storage')
    showBottomSheet(product, 'https://test.supabase.co/storage')
    expect(document.querySelectorAll('.bottom-sheet-overlay').length).toBe(1)
  })
})
