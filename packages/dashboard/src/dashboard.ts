import Alpine from 'alpinejs'
import { checkSession } from './lib/session'
import { renderLayout } from './components/layout'
import { renderProductList } from './components/productList'
import { renderPriceEditor } from './components/priceEditor'
import { fetchAllProducts, fetchCategoryTags, fetchProductTags, updateProductPrices } from './lib/supabase'

async function renderView(main: HTMLElement, hash: string): Promise<void> {
  main.innerHTML = ''
  const products = await fetchAllProducts()

  if (hash === '#prices') {
    renderPriceEditor(main, products, updateProductPrices)
  } else {
    const [tags, productTags] = await Promise.all([
      fetchCategoryTags(),
      fetchProductTags(),
    ])
    renderProductList(main, products, tags, productTags)
  }
}

async function init(): Promise<void> {
  const role = await checkSession()
  if (!role) return // redirecting

  const app = document.getElementById('app')
  if (!app) return

  renderLayout(app, role)

  const main = app.querySelector('main')
  if (main) {
    await renderView(main, window.location.hash)

    window.addEventListener('hashchange', () => {
      void renderView(main, window.location.hash)
    })
  }

  Alpine.start()
}

void init()
