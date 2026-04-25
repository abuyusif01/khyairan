import Alpine from 'alpinejs'
import { checkSession } from './lib/session'
import { renderLayout } from './components/layout'
import { renderProductList } from './components/productList'
import { renderPriceEditor } from './components/priceEditor'
import { renderAddProductForm } from './components/addProductForm'
import { renderEditProductForm } from './components/editProductForm'
import { renderTagList } from './components/tagList'
import { renderTagForm } from './components/tagForm'
import { renderUserList } from './components/userList'
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
  getProductImageUrl,
  createTag,
  updateTag,
  toggleTagPublished,
  deleteTag,
  deleteProduct,
  countProductsForTag,
  updateTagOrder,
  updateProductTagOrder,
  fetchAllProfiles,
  updateProfileRole,
  inviteUser,
  removeUser,
} from './lib/supabase'
import type { NewTag } from './lib/supabase'

type Role = 'owner' | 'manager'

async function renderView(main: HTMLElement, hash: string, role: Role, userId: string): Promise<void> {
  main.innerHTML = ''

  if (hash === '#prices') {
    const products = await fetchAllProducts()
    renderPriceEditor(main, products, updateProductPrices)
  } else if (hash === '#add-product') {
    const tags = await fetchAllTags()
    renderAddProductForm(main, tags, () => {
      window.location.hash = '#products'
    }, createProduct, setProductTags)
  } else if (hash === '#users' && role === 'owner') {
    const profiles = await fetchAllProfiles()
    renderUserList(main, profiles, {
      changeRoleFn: updateProfileRole,
      inviteFn: inviteUser,
      removeFn: removeUser,
      refetchFn: fetchAllProfiles,
      currentUserId: userId,
    })
  } else if (hash === '#tags') {
    const tags = await fetchAllTags()
    renderTagList(main, tags, {
      toggleFn: toggleTagPublished,
      deleteFn: deleteTag,
      countProductsFn: countProductsForTag,
      isOwner: role === 'owner',
      reorderFn: updateTagOrder,
    })
  } else if (hash === '#add-tag') {
    const tags = await fetchAllTags()
    const existingTypes = [...new Set(tags.map(t => t.type))]
    renderTagForm(main, null, existingTypes, () => {
      window.location.hash = '#tags'
    }, (fields: NewTag) => createTag(fields).then(() => undefined))
  } else if (hash.startsWith('#edit-tag-')) {
    const tagId = hash.slice('#edit-tag-'.length)
    const tags = await fetchAllTags()
    const tag = tags.find(t => t.id === tagId)
    if (!tag) {
      main.textContent = 'Tag not found'
      return
    }
    const existingTypes = [...new Set(tags.map(t => t.type))]
    renderTagForm(main, tag, existingTypes, () => {
      window.location.hash = '#tags'
    }, (fields: NewTag) => updateTag(tagId, fields))
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
    }, updateProduct, setProductTags, uploadProductImage, getProductImageUrl)
  } else {
    const [products, tags, productTags] = await Promise.all([
      fetchAllProducts(),
      fetchCategoryTags(),
      fetchProductTags(),
    ])
    renderProductList(main, products, tags, productTags, {
      deleteFn: deleteProduct,
      isOwner: role === 'owner',
      reorderFn: updateProductTagOrder,
    })
  }
}

async function init(): Promise<void> {
  const session = await checkSession()
  if (!session) return // redirecting

  const { role, userId } = session

  const app = document.getElementById('app')
  if (!app) return

  renderLayout(app, role)

  const main = app.querySelector('main')
  if (main) {
    await renderView(main, window.location.hash, role, userId)

    window.addEventListener('hashchange', () => {
      void renderView(main, window.location.hash, role, userId)
    })
  }

  Alpine.start()
}

void init()
