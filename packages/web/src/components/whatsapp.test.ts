import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { JSDOM } from 'jsdom'
import { buildWhatsAppUrl } from './whatsapp'
import type { Product } from '../types'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PHONE = '2348036917058'

describe('buildWhatsAppUrl', () => {
  it('generates correct URL for a product', () => {
    const product: Product = {
      id: 'p1',
      name: 'Coca-Cola',
      size: '35CL',
      unit_type: 'bottle',
      units_per_carton: 12,
      price_ngn: 4500,
      image_path: null,
      published: true,
    }

    const url = buildWhatsAppUrl(product)

    expect(url).toContain(`wa.me/${PHONE}`)
    expect(url).toContain('Coca-Cola')
    expect(url).toContain('35CL')
    expect(url).toContain('12')
  })

  it('generates generic URL when no product given', () => {
    const url = buildWhatsAppUrl()

    expect(url).toContain(`wa.me/${PHONE}`)
    expect(url).toContain('order')
  })

  it('floating button renders with correct link and target blank', () => {
    const html = readFileSync(join(__dirname, '../../index.html'), 'utf-8')
    const dom = new JSDOM(html)
    const fab = dom.window.document.querySelector('.fab-whatsapp')

    expect(fab).toBeTruthy()
    expect(fab?.getAttribute('href')).toContain(`wa.me/${PHONE}`)
    expect(fab?.getAttribute('target')).toBe('_blank')
  })
})
