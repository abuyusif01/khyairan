import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSignOut = vi.fn()

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: mockSignOut,
    },
  },
}))

describe('layout component', () => {
  beforeEach(() => {
    mockSignOut.mockReset()
    document.body.innerHTML = ''
  })

  it('renders header with business name', async () => {
    const { renderLayout } = await import('./layout')
    const container = document.createElement('div')
    renderLayout(container, 'manager')
    const header = container.querySelector('header')
    expect(header).toBeTruthy()
    expect(header?.textContent).toContain('Khyairan')
  })

  it('renders logout button', async () => {
    const { renderLayout } = await import('./layout')
    const container = document.createElement('div')
    renderLayout(container, 'manager')
    const logoutBtn = container.querySelector('[data-action="logout"]')
    expect(logoutBtn).toBeTruthy()
  })

  it('renders nav links for Products and Tags', async () => {
    const { renderLayout } = await import('./layout')
    const container = document.createElement('div')
    renderLayout(container, 'manager')
    const links = Array.from(container.querySelectorAll('nav a')).map(a => a.textContent?.trim())
    expect(links).toContain('Products')
    expect(links).toContain('Tags')
  })

  it('hides Users link when role is manager', async () => {
    const { renderLayout } = await import('./layout')
    const container = document.createElement('div')
    renderLayout(container, 'manager')
    const links = Array.from(container.querySelectorAll('nav a')).map(a => a.textContent?.trim())
    expect(links).not.toContain('Users')
  })

  it('shows Users link when role is owner', async () => {
    const { renderLayout } = await import('./layout')
    const container = document.createElement('div')
    renderLayout(container, 'owner')
    const links = Array.from(container.querySelectorAll('nav a')).map(a => a.textContent?.trim())
    expect(links).toContain('Users')
  })

  it('marks active nav link with aria-current for current hash', async () => {
    const { renderLayout } = await import('./layout')
    const container = document.createElement('div')
    renderLayout(container, 'owner', '#tags')

    const tagsLink = container.querySelector<HTMLAnchorElement>('a[href="#tags"]')
    expect(tagsLink?.getAttribute('aria-current')).toBe('page')

    const productsLink = container.querySelector<HTMLAnchorElement>('a[href="#products"]')
    expect(productsLink?.getAttribute('aria-current')).toBeNull()
  })

  it('updateActiveNav sets aria-current on matching link and removes from others', async () => {
    const { renderLayout, updateActiveNav } = await import('./layout')
    const container = document.createElement('div')
    renderLayout(container, 'owner', '#products')

    // Initially products is active
    expect(container.querySelector('a[href="#products"]')?.getAttribute('aria-current')).toBe('page')

    // Switch to tags
    updateActiveNav(container, '#tags')
    expect(container.querySelector('a[href="#tags"]')?.getAttribute('aria-current')).toBe('page')
    expect(container.querySelector('a[href="#products"]')?.getAttribute('aria-current')).toBeNull()
  })
})
