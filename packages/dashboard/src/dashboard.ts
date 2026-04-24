import Alpine from 'alpinejs'
import { checkSession } from './lib/session'
import { renderLayout } from './components/layout'
import { renderProductList } from './components/productList'
import { fetchAllProducts, fetchCategoryTags, fetchProductTags } from './lib/supabase'

async function init(): Promise<void> {
  const role = await checkSession()
  if (!role) return // redirecting

  const app = document.getElementById('app')
  if (!app) return

  renderLayout(app, role)

  const main = app.querySelector('main')
  if (main) {
    const [products, tags, productTags] = await Promise.all([
      fetchAllProducts(),
      fetchCategoryTags(),
      fetchProductTags(),
    ])
    renderProductList(main, products, tags, productTags)
  }

  Alpine.start()
}

void init()
