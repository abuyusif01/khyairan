import { describe, it, expect, afterEach } from 'vitest'
import { initApp } from './main'

describe('Web app', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders without crashing — root Alpine.js component mounts and produces DOM output', async () => {
    document.body.innerHTML = `
      <div id="root" x-data="{ message: 'Khyairan Soft Drinks' }">
        <h1 id="greeting" x-text="message"></h1>
      </div>
    `
    initApp()
    await new Promise<void>(resolve => setTimeout(resolve, 50))
    const h1 = document.getElementById('greeting')
    expect(h1).toBeTruthy()
    expect(h1?.textContent).toBe('Khyairan Soft Drinks')
  })
})
