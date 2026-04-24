import { supabase } from '../lib/supabase'

export interface LoginComponent {
  email: string
  password: string
  error: string | null
  loading: boolean
  submit: () => Promise<void>
}

export function loginComponent(): LoginComponent {
  return {
    email: '',
    password: '',
    error: null,
    loading: false,
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
  }
}
