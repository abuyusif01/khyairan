import './style.css'
import { fetchPublishedProducts, fetchPublishedCategoryTags, fetchProductTags, groupProductsByCategory } from './lib/supabase'
import { renderProductGrid } from './components/productGrid'
import { renderFilterBar } from './components/filterBar'

export async function initApp(): Promise<void> {
  const [products, tags, productTags] = await Promise.all([
    fetchPublishedProducts(),
    fetchPublishedCategoryTags(),
    fetchProductTags(),
  ])

  const groups = groupProductsByCategory(products, tags, productTags)

  const gridEl = document.getElementById('product-grid')
  if (gridEl) renderProductGrid(groups, gridEl)

  const filterBarEl = document.getElementById('filter-bar')
  if (filterBarEl) renderFilterBar(tags, filterBarEl)
}

initApp()
