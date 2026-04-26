import { supabase } from '../lib/supabase'

export interface LoginComponent {
  email: string
  password: string
  newPassword: string
  confirmPassword: string
  error: string | null
  loading: boolean
  mode: 'login' | 'set-password'
  init: () => Promise<void>
  submit: () => Promise<void>
  setPassword: () => Promise<void>
}

export function loginComponent(): LoginComponent {
  return {
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    error: null,
    loading: false,
    mode: 'login',
    async init() {
      // Detect invite token — implicit flow puts type=invite in hash,
      // PKCE flow may put it in search params
      const hashParams = new URLSearchParams(window.location.hash.slice(1))
      const searchParams = new URLSearchParams(window.location.search)
      const isInvite =
        hashParams.get('type') === 'invite' ||
        searchParams.get('type') === 'invite'

      if (isInvite) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) this.mode = 'set-password'
      }
    },
    async submit() {
      this.error = null
      this.loading = true
      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      })
      this.loading = false
      if (error) {
        this.error = error.message
        return
      }
      window.location.href = '/dashboard.html'
    },
    async setPassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'Passwords do not match'
        return
      }
      if (this.newPassword.length < 8) {
        this.error = 'Password must be at least 8 characters'
        return
      }
      this.error = null
      this.loading = true
      const { error } = await supabase.auth.updateUser({ password: this.newPassword })
      this.loading = false
      if (error) {
        this.error = error.message
        return
      }
      window.location.href = '/dashboard.html'
    },
  }
}
