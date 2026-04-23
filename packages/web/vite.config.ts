import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    // Map shadowenv vars to VITE_ names so no .env file is needed
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL ?? ''),
    'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(process.env.SUPABASE_PUBLISHABLE_KEY ?? ''),
  },
  test: {
    environment: 'jsdom',
  },
})
