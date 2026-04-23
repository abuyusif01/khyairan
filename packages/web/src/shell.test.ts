import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'fs'
import { JSDOM } from 'jsdom'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const html = readFileSync(join(__dirname, '../index.html'), 'utf-8')

describe('Static HTML shell', () => {
  let document: Document

  beforeEach(() => {
    const dom = new JSDOM(html)
    document = dom.window.document
  })

  it('header contains business name', () => {
    const header = document.querySelector('header')
    expect(header?.textContent).toContain('KHYAIRAN')
  })

  it('header contains WhatsApp link', () => {
    const header = document.querySelector('header')
    const link = header?.querySelector('a[href*="wa.me/2348036917058"]')
    expect(link).toBeTruthy()
  })

  it('mount points exist for dynamic components', () => {
    expect(document.querySelector('#filter-bar')).toBeTruthy()
    expect(document.querySelector('#product-grid')).toBeTruthy()
  })

  it('footer contains phone number', () => {
    const footer = document.querySelector('footer')
    expect(footer?.textContent).toContain('+234 803 691 7058')
  })
})
