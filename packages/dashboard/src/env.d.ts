/// <reference types="vite/client" />

import type Alpine from 'alpinejs'

declare global {
  interface Window {
    Alpine: typeof Alpine
  }
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
