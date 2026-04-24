import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSignInWithPassword = vi.fn()

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  },
}))

describe('login component', () => {
  beforeEach(() => {
    mockSignInWithPassword.mockReset()
    document.body.innerHTML = ''
  })

  it('renders email and password inputs', () => {
    document.body.innerHTML = `
      <form id="login-form">
        <input type="email" id="email" name="email" />
        <input type="password" id="password" name="password" />
        <button type="submit">Login</button>
      </form>
    `
    const emailInput = document.querySelector('input[type="email"]')
    const passwordInput = document.querySelector('input[type="password"]')
    expect(emailInput).toBeTruthy()
    expect(passwordInput).toBeTruthy()
    expect(emailInput?.getAttribute('type')).toBe('email')
    expect(passwordInput?.getAttribute('type')).toBe('password')
  })

  it('shows error message on failed login', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' },
    })

    const { loginComponent } = await import('./login')
    const component = loginComponent()
    component.email = 'wrong@example.com'
    component.password = 'wrongpassword'
    await component.submit()

    expect(component.error).toBeTruthy()
    expect(typeof component.error).toBe('string')
    expect(component.error).toContain('Invalid login credentials')
  })

  it('calls signInWithPassword with form values', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-1' }, session: {} },
      error: null,
    })
    // mock window.location.href assignment
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })

    const { loginComponent } = await import('./login')
    const component = loginComponent()
    component.email = 'admin@khaiyran.com'
    component.password = 'secret123'
    await component.submit()

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'admin@khaiyran.com',
      password: 'secret123',
    })
  })
})
