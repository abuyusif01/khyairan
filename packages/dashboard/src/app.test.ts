import { describe, it, expect, afterEach, vi } from 'vitest'

vi.mock('./lib/supabase', () => ({
  supabase: { auth: { signInWithPassword: vi.fn(), signOut: vi.fn() } },
}))

import { initApp } from './main'

describe('Dashboard app', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders without crashing — root Alpine.js component mounts and produces DOM output', async () => {
    document.body.innerHTML = `
      <div id="root" x-data="{ message: 'Khyairan Admin' }">
        <h1 id="greeting" x-text="message"></h1>
      </div>
    `
    initApp()
    await new Promise<void>(resolve => setTimeout(resolve, 50))
    const h1 = document.getElementById('greeting')
    expect(h1).toBeTruthy()
    expect(h1?.textContent).toBe('Khyairan Admin')
  })
})
