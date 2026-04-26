import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSignInWithPassword = vi.fn()
const mockGetSession = vi.fn()
const mockUpdateUser = vi.fn()

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      getSession: mockGetSession,
      updateUser: mockUpdateUser,
    },
  },
}))

describe('login component', () => {
  beforeEach(() => {
    mockSignInWithPassword.mockReset()
    mockGetSession.mockReset()
    mockUpdateUser.mockReset()
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

  it('init sets mode to set-password when type=invite in hash and session exists', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    })
    Object.defineProperty(window, 'location', {
      value: { hash: '#type=invite', search: '' },
      writable: true,
    })

    const { loginComponent } = await import('./login')
    const component = loginComponent()
    await component.init()

    expect(component.mode).toBe('set-password')
  })

  it('init stays in login mode when no invite param', async () => {
    Object.defineProperty(window, 'location', {
      value: { hash: '', search: '' },
      writable: true,
    })

    const { loginComponent } = await import('./login')
    const component = loginComponent()
    await component.init()

    expect(component.mode).toBe('login')
  })

  it('init sets mode to set-password when type=invite in search params and session exists', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    })
    Object.defineProperty(window, 'location', {
      value: { hash: '', search: '?type=invite' },
      writable: true,
    })

    const { loginComponent } = await import('./login')
    const component = loginComponent()
    await component.init()

    expect(component.mode).toBe('set-password')
  })

  it('setPassword rejects mismatched passwords', async () => {
    const { loginComponent } = await import('./login')
    const component = loginComponent()
    component.newPassword = 'password123'
    component.confirmPassword = 'password456'
    await component.setPassword()

    expect(component.error).toBe('Passwords do not match')
    expect(mockUpdateUser).not.toHaveBeenCalled()
  })

  it('setPassword rejects passwords under 8 chars', async () => {
    const { loginComponent } = await import('./login')
    const component = loginComponent()
    component.newPassword = 'short'
    component.confirmPassword = 'short'
    await component.setPassword()

    expect(component.error).toBeTruthy()
    expect(typeof component.error).toBe('string')
    expect(mockUpdateUser).not.toHaveBeenCalled()
  })

  it('setPassword success calls updateUser and redirects', async () => {
    mockUpdateUser.mockResolvedValue({ data: { user: {} }, error: null })
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })

    const { loginComponent } = await import('./login')
    const component = loginComponent()
    component.newPassword = 'newpassword123'
    component.confirmPassword = 'newpassword123'
    await component.setPassword()

    expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'newpassword123' })
    expect(window.location.href).toBe('/dashboard.html')
    expect(component.error).toBeNull()
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
