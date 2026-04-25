import { describe, it, expect, vi, beforeEach } from 'vitest'
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
