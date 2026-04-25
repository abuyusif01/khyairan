import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Profile } from '../types'

const profiles: Profile[] = [
  { id: 'u1', full_name: 'Abu Yusif', role: 'owner', created_at: '2026-01-01T10:00:00Z' },
  { id: 'u2', full_name: 'Musa Kano', role: 'manager', created_at: '2026-02-15T08:30:00Z' },
]

describe('renderUserList', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
  })

  it('renders a row for each profile with full_name and role', async () => {
    const { renderUserList } = await import('./userList')
    renderUserList(container, profiles)

    const rows = container.querySelectorAll('[data-user-id]')
    expect(rows.length).toBe(2)

    const text = container.textContent ?? ''
    expect(text).toContain('Abu Yusif')
    expect(text).toContain('Musa Kano')
    expect(text).toContain('owner')
    expect(text).toContain('manager')
  })

  it('renders created_at in a human-readable format', async () => {
    const { renderUserList } = await import('./userList')
    renderUserList(container, profiles)

    const text = container.textContent ?? ''
    // Should contain year at minimum (2026)
    expect(text).toContain('2026')
  })

  it('renders empty state when no profiles', async () => {
    const { renderUserList } = await import('./userList')
    renderUserList(container, [])

    const rows = container.querySelectorAll('[data-user-id]')
    expect(rows.length).toBe(0)
  })

  it('renders role dropdown per row when changeRoleFn provided', async () => {
    const { renderUserList } = await import('./userList')
    const changeRoleFn = vi.fn().mockResolvedValue(undefined)
    renderUserList(container, profiles, { changeRoleFn })

    const selects = container.querySelectorAll('select[data-role-select]')
    expect(selects.length).toBe(2)

    const u1Select = container.querySelector('[data-user-id="u1"] select[data-role-select]') as HTMLSelectElement
    expect(u1Select?.value).toBe('owner')

    const u2Select = container.querySelector('[data-user-id="u2"] select[data-role-select]') as HTMLSelectElement
    expect(u2Select?.value).toBe('manager')
  })

  it('changing role dropdown calls changeRoleFn with userId and new role', async () => {
    const { renderUserList } = await import('./userList')
    const changeRoleFn = vi.fn().mockResolvedValue(undefined)
    renderUserList(container, profiles, { changeRoleFn })

    const u2Select = container.querySelector('[data-user-id="u2"] select[data-role-select]') as HTMLSelectElement
    u2Select.value = 'owner'
    u2Select.dispatchEvent(new Event('change'))

    await vi.waitFor(() => expect(changeRoleFn).toHaveBeenCalledOnce())
    expect(changeRoleFn).toHaveBeenCalledWith('u2', 'owner')
  })
})

describe('renderUserList — invite form', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
  })

  it('renders invite form above table when inviteFn provided', async () => {
    const { renderUserList } = await import('./userList')
    const inviteFn = vi.fn().mockResolvedValue(undefined)
    const refetchFn = vi.fn().mockResolvedValue(profiles)
    renderUserList(container, profiles, { inviteFn, refetchFn })

    const emailInput = container.querySelector('input[data-invite-email]')
    const nameInput = container.querySelector('input[data-invite-name]')
    const roleSelect = container.querySelector('select[data-invite-role]')
    const submitBtn = container.querySelector('button[data-invite-submit]')
    expect(emailInput).not.toBeNull()
    expect(nameInput).not.toBeNull()
    expect(roleSelect).not.toBeNull()
    expect(submitBtn).not.toBeNull()

    // form appears before table
    const formEl = container.querySelector('[data-invite-form]')
    const tableEl = container.querySelector('table')
    expect(formEl).not.toBeNull()
    expect(tableEl).not.toBeNull()
    const pos = formEl!.compareDocumentPosition(tableEl!)
    expect(pos & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('invite submit calls inviteFn with email, full_name, role', async () => {
    const { renderUserList } = await import('./userList')
    const inviteFn = vi.fn().mockResolvedValue(undefined)
    const refetchFn = vi.fn().mockResolvedValue(profiles)
    renderUserList(container, profiles, { inviteFn, refetchFn })

    const emailInput = container.querySelector('input[data-invite-email]') as HTMLInputElement
    const nameInput = container.querySelector('input[data-invite-name]') as HTMLInputElement
    const roleSelect = container.querySelector('select[data-invite-role]') as HTMLSelectElement
    const form = container.querySelector('form[data-invite-form]') as HTMLFormElement

    emailInput.value = 'musa@example.com'
    nameInput.value = 'Musa Kano'
    roleSelect.value = 'manager'
    form.dispatchEvent(new Event('submit'))

    await vi.waitFor(() => expect(inviteFn).toHaveBeenCalledOnce())
    expect(inviteFn).toHaveBeenCalledWith('musa@example.com', 'Musa Kano', 'manager')
  })

  it('shows error message on inviteFn rejection', async () => {
    const { renderUserList } = await import('./userList')
    const inviteFn = vi.fn().mockRejectedValue(new Error('User already registered'))
    const refetchFn = vi.fn().mockResolvedValue(profiles)
    renderUserList(container, profiles, { inviteFn, refetchFn })

    const emailInput = container.querySelector('input[data-invite-email]') as HTMLInputElement
    const nameInput = container.querySelector('input[data-invite-name]') as HTMLInputElement
    const form = container.querySelector('form[data-invite-form]') as HTMLFormElement

    emailInput.value = 'dup@example.com'
    nameInput.value = 'Dup User'
    form.dispatchEvent(new Event('submit'))

    await vi.waitFor(() => {
      const errEl = container.querySelector('[data-invite-error]')
      expect(errEl?.textContent).toContain('User already registered')
    })
    // form inputs remain filled
    expect(emailInput.value).toBe('dup@example.com')
  })

  it('resets form and re-renders table after successful invite', async () => {
    const { renderUserList } = await import('./userList')
    const newProfile: Profile = { id: 'u3', full_name: 'New User', role: 'manager', created_at: '2026-04-25T10:00:00Z' }
    const inviteFn = vi.fn().mockResolvedValue(undefined)
    const refetchFn = vi.fn().mockResolvedValue([...profiles, newProfile])
    renderUserList(container, profiles, { inviteFn, refetchFn })

    const emailInput = container.querySelector('input[data-invite-email]') as HTMLInputElement
    const nameInput = container.querySelector('input[data-invite-name]') as HTMLInputElement
    const form = container.querySelector('form[data-invite-form]') as HTMLFormElement

    emailInput.value = 'new@example.com'
    nameInput.value = 'New User'
    form.dispatchEvent(new Event('submit'))

    await vi.waitFor(() => {
      const rows = container.querySelectorAll('[data-user-id]')
      expect(rows.length).toBe(3)
    })
    // inputs cleared
    expect(emailInput.value).toBe('')
    expect(nameInput.value).toBe('')
  })
})

describe('renderUserList — remove button', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    vi.stubGlobal('confirm', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders Remove button per row, disabled for current user own row', async () => {
    const { renderUserList } = await import('./userList')
    const removeFn = vi.fn().mockResolvedValue(undefined)
    const refetchFn = vi.fn().mockResolvedValue(profiles)
    renderUserList(container, profiles, { removeFn, refetchFn, currentUserId: 'u1' })

    const u1Btn = container.querySelector('[data-user-id="u1"] button[data-remove-btn]') as HTMLButtonElement
    const u2Btn = container.querySelector('[data-user-id="u2"] button[data-remove-btn]') as HTMLButtonElement
    expect(u1Btn).not.toBeNull()
    expect(u2Btn).not.toBeNull()
    expect(u1Btn.disabled).toBe(true)
    expect(u2Btn.disabled).toBe(false)
  })

  it('Remove button calls removeFn with userId after confirm', async () => {
    const { renderUserList } = await import('./userList')
    vi.mocked(window.confirm).mockReturnValue(true)
    const removeFn = vi.fn().mockResolvedValue(undefined)
    const refetchFn = vi.fn().mockResolvedValue(profiles)
    renderUserList(container, profiles, { removeFn, refetchFn, currentUserId: 'u1' })

    const u2Btn = container.querySelector('[data-user-id="u2"] button[data-remove-btn]') as HTMLButtonElement
    u2Btn.click()

    await vi.waitFor(() => expect(removeFn).toHaveBeenCalledOnce())
    expect(removeFn).toHaveBeenCalledWith('u2')
  })

  it('Remove button does nothing when confirm cancelled', async () => {
    const { renderUserList } = await import('./userList')
    vi.mocked(window.confirm).mockReturnValue(false)
    const removeFn = vi.fn()
    const refetchFn = vi.fn().mockResolvedValue(profiles)
    renderUserList(container, profiles, { removeFn, refetchFn, currentUserId: 'u1' })

    const u2Btn = container.querySelector('[data-user-id="u2"] button[data-remove-btn]') as HTMLButtonElement
    u2Btn.click()

    expect(removeFn).not.toHaveBeenCalled()
  })

  it('shows error on removeFn rejection; row remains', async () => {
    const { renderUserList } = await import('./userList')
    vi.mocked(window.confirm).mockReturnValue(true)
    const removeFn = vi.fn().mockRejectedValue(new Error('Cannot remove last owner'))
    const refetchFn = vi.fn().mockResolvedValue(profiles)
    renderUserList(container, profiles, { removeFn, refetchFn, currentUserId: 'u1' })

    const u2Btn = container.querySelector('[data-user-id="u2"] button[data-remove-btn]') as HTMLButtonElement
    u2Btn.click()

    await vi.waitFor(() => {
      const errEl = container.querySelector('[data-remove-error]')
      expect(errEl?.textContent).toContain('Cannot remove last owner')
    })
    // row still present
    const rows = container.querySelectorAll('[data-user-id]')
    expect(rows.length).toBe(2)
  })

  it('re-renders table without removed user on success', async () => {
    const { renderUserList } = await import('./userList')
    vi.mocked(window.confirm).mockReturnValue(true)
    const removeFn = vi.fn().mockResolvedValue(undefined)
    const refetchFn = vi.fn().mockResolvedValue([profiles[0]])
    renderUserList(container, profiles, { removeFn, refetchFn, currentUserId: 'u1' })

    const u2Btn = container.querySelector('[data-user-id="u2"] button[data-remove-btn]') as HTMLButtonElement
    u2Btn.click()

    await vi.waitFor(() => {
      const rows = container.querySelectorAll('[data-user-id]')
      expect(rows.length).toBe(1)
    })
    expect(container.querySelector('[data-user-id="u2"]')).toBeNull()
  })
})
