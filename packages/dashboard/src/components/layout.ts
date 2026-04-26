import { supabase } from '../lib/supabase'

export type Role = 'owner' | 'manager'

export function updateActiveNav(container: HTMLElement, hash: string): void {
  const nav = container.querySelector('nav')
  if (!nav) return
  nav.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
    if (link.getAttribute('href') === hash) {
      link.setAttribute('aria-current', 'page')
    } else {
      link.removeAttribute('aria-current')
    }
  })
}

export function renderLayout(container: HTMLElement, role: Role, currentHash?: string): void {
  const isOwner = role === 'owner'

  container.innerHTML = `
    <header class="site-header">
      <span class="site-name">Khyairan</span>
      <button data-action="logout" class="logout-btn">Logout</button>
    </header>
    <nav class="site-nav">
      <a href="#products">Products</a>
      <a href="#tags">Tags</a>
      ${isOwner ? '<a href="#users">Users</a>' : ''}
      <a href="#prices">Prices</a>
    </nav>
    <main class="site-content"></main>
  `

  if (currentHash) {
    updateActiveNav(container, currentHash)
  }

  const logoutBtn = container.querySelector('[data-action="logout"]')
  logoutBtn?.addEventListener('click', async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  })
}

export interface LayoutComponent {
  role: Role | null
  navOpen: boolean
  toggleNav: () => void
  logout: () => Promise<void>
}

export function layoutComponent(role: Role | null = null): LayoutComponent {
  return {
    role,
    navOpen: false,
    toggleNav() {
      this.navOpen = !this.navOpen
    },
    async logout() {
      await supabase.auth.signOut()
      window.location.href = '/'
    },
  }
}
