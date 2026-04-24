import './style.css'
import { loadCatalog, groupProductsByCategory } from './lib/supabase'
import { renderProductGrid } from './components/productGrid'
import { renderFilterBar } from './components/filterBar'

export async function initApp(): Promise<void> {
  const { products, tags, productTags } = await loadCatalog()
  const groups = groupProductsByCategory(products, tags, productTags)

  const gridEl = document.getElementById('product-grid')
  if (gridEl) renderProductGrid(groups, gridEl)

  const filterBarEl = document.getElementById('filter-bar')
  if (filterBarEl) renderFilterBar(tags, filterBarEl)
}

initApp()
