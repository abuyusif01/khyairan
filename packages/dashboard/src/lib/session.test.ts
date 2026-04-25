import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetSession = vi.fn()
const mockFrom = vi.fn()

vi.mock('./supabase', () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
    },
    from: mockFrom,
  },
}))

describe('checkSession', () => {
  beforeEach(() => {
    mockGetSession.mockReset()
    mockFrom.mockReset()
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })
  })

  it('redirects to / when no session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null })

    const { checkSession } = await import('./session')
    await checkSession()

    expect(window.location.href).toBe('/')
  })

  it('fetches profile and returns role when session exists', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null,
    })

    const mockSelect = vi.fn().mockReturnThis()
    const mockEq = vi.fn().mockReturnThis()
    const mockSingle = vi.fn().mockResolvedValue({
      data: { role: 'owner' },
      error: null,
    })
    mockFrom.mockReturnValue({ select: mockSelect, eq: mockEq, single: mockSingle })
    mockSelect.mockReturnValue({ eq: mockEq })
    mockEq.mockReturnValue({ single: mockSingle })

    const { checkSession } = await import('./session')
    const result = await checkSession()

    expect(mockFrom).toHaveBeenCalledWith('profiles')
    expect(result?.role).toBe('owner')
    expect(result?.userId).toBe('user-123')
  })
})
