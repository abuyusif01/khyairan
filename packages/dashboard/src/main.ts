import Alpine from 'alpinejs'
import { loginComponent } from './components/login'

Alpine.data('login', loginComponent)

export function initApp(): void {
  Alpine.start()
}

initApp()
