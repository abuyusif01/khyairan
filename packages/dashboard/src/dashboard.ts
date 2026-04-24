import Alpine from 'alpinejs'
import { checkSession } from './lib/session'
import { renderLayout } from './components/layout'
import { renderProductList } from './components/productList'
import { renderPriceEditor } from './components/priceEditor'
import { renderAddProductForm } from './components/addProductForm'
import {
  fetchAllProducts,
  fetchAllTags,
  fetchCategoryTags,
  fetchProductTags,
  updateProductPrices,
  createProduct,
  setProductTags,
} from './lib/supabase'

async function renderView(main: HTMLElement, hash: string): Promise<void> {
  main.innerHTML = ''

  if (hash === '#prices') {
    const products = await fetchAllProducts()
    renderPriceEditor(main, products, updateProductPrices)
  } else if (hash === '#add-product') {
    const tags = await fetchAllTags()
    renderAddProductForm(main, tags, () => {
      window.location.hash = '#products'
    }, createProduct, setProductTags)
  } else {
    const [products, tags, productTags] = await Promise.all([
      fetchAllProducts(),
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
