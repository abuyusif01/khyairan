import type { Product, Tag, ProductTag } from '../types'

export interface ProductListOptions {
  deleteFn?: (productId: string) => Promise<void>
  isOwner?: boolean
}

function formatPrice(ngn: number): string {
  return '₦' + ngn.toLocaleString('en-NG')
}

function getTagsForProduct(productId: string, productTags: ProductTag[]): string[] {
  return productTags.filter(pt => pt.product_id === productId).map(pt => pt.tag_id)
}

export function renderProductList(
  container: HTMLElement,
  products: Product[],
  tags: Tag[],
  productTags: ProductTag[],
  options: ProductListOptions = {}
): void {
  const { deleteFn, isOwner } = options

  // Build filter controls (search and tag filter) if not already provided by caller
  let searchInput = container.querySelector<HTMLInputElement>('[data-search]')
  let tagFilter = container.querySelector<HTMLSelectElement>('[data-tag-filter]')

  if (!searchInput) {
    searchInput = document.createElement('input')
    searchInput.setAttribute('data-search', '')
    searchInput.placeholder = 'Search products…'
    searchInput.type = 'search'
    container.prepend(searchInput)
  }

  const tagFilterCreated = !tagFilter
  if (!tagFilter) {
    tagFilter = document.createElement('select')
    tagFilter.setAttribute('data-tag-filter', '')
    searchInput.insertAdjacentElement('afterend', tagFilter)
  }

  // Always populate tag options
  tagFilter.innerHTML = ''
  const allOption = document.createElement('option')
  allOption.value = ''
  allOption.textContent = 'All categories'
  tagFilter.appendChild(allOption)
  tags.forEach(tag => {
    const opt = document.createElement('option')
    opt.value = tag.id
    opt.textContent = tag.name
    tagFilter!.appendChild(opt)
  })
  void tagFilterCreated

  // Build table
  const table = document.createElement('table')
  const hasActions = deleteFn && isOwner
  table.innerHTML = `<thead><tr>
    <th>Name</th><th>Size</th><th>Type</th><th>Units/Carton</th><th>Price</th><th>Status</th>${hasActions ? '<th>Actions</th>' : ''}
  </tr></thead>`
  const tbody = document.createElement('tbody')

  products.forEach(product => {
    const tr = document.createElement('tr')
    tr.setAttribute('data-product-id', product.id)

    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${product.size}</td>
      <td>${product.unit_type}</td>
      <td>${product.units_per_carton}</td>
      <td>${formatPrice(product.price_ngn)}</td>
      <td><span data-status="${product.published ? 'published' : 'draft'}">${product.published ? 'Published' : 'Draft'}</span></td>
    `

    if (hasActions) {
      const actionsCell = document.createElement('td')
      const deleteBtn = document.createElement('button')
      deleteBtn.setAttribute('data-action', 'delete-product')
      deleteBtn.textContent = 'Delete'
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Delete product "${product.name}"?`)) {
          void deleteFn(product.id).then(() => tr.remove())
        }
      })
      actionsCell.appendChild(deleteBtn)
      tr.appendChild(actionsCell)
    }

    tbody.appendChild(tr)
  })

  table.appendChild(tbody)
  container.appendChild(table)

  function applyFilters(): void {
    const search = (searchInput?.value ?? '').toLowerCase()
    const tagId = tagFilter?.value ?? ''

    const rows = tbody.querySelectorAll<HTMLElement>('[data-product-id]')
    rows.forEach(row => {
      const productId = row.getAttribute('data-product-id') ?? ''
      const product = products.find(p => p.id === productId)
      if (!product) return

      const matchesSearch = product.name.toLowerCase().includes(search)
      const matchesTag = !tagId || getTagsForProduct(productId, productTags).includes(tagId)

      row.style.display = matchesSearch && matchesTag ? '' : 'none'
    })
  }

  searchInput.addEventListener('input', applyFilters)
  tagFilter.addEventListener('change', applyFilters)
}
