import Alpine from 'alpinejs'
import { checkSession } from './lib/session'
import { renderLayout } from './components/layout'

async function init(): Promise<void> {
  const role = await checkSession()
  if (!role) return // redirecting

  const app = document.getElementById('app')
  if (!app) return

  renderLayout(app, role)
  Alpine.start()
}

void init()
