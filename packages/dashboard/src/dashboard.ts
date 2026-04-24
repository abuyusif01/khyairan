import Alpine from 'alpinejs'
import { checkSession } from './lib/session'
import { renderLayout } from './components/layout'
import { renderProductList } from './components/productList'
import { renderPriceEditor } from './components/priceEditor'
import { renderAddProductForm } from './components/addProductForm'
import { renderEditProductForm } from './components/editProductForm'
import {
  fetchAllProducts,
  fetchAllTags,
  fetchCategoryTags,
  fetchProductTags,
  updateProductPrices,
  createProduct,
  setProductTags,
  updateProduct,
  uploadProductImage,
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
  } else if (hash.startsWith('#edit-product-')) {
    const productId = hash.slice('#edit-product-'.length)
    const [products, tags, productTags] = await Promise.all([
      fetchAllProducts(),
      fetchAllTags(),
      fetchProductTags(),
    ])
    const product = products.find(p => p.id === productId)
    if (!product) {
      main.textContent = 'Product not found'
      return
    }
    const currentTagIds = productTags
      .filter(pt => pt.product_id === productId)
      .map(pt => pt.tag_id)
    renderEditProductForm(main, product, tags, currentTagIds, () => {
      window.location.hash = '#products'
    }, updateProduct, setProductTags, uploadProductImage)
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
