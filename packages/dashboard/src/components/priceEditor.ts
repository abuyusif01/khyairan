import type { Product } from '../types'

type UpdateFn = (updates: { id: string; price_ngn: number }[]) => Promise<void>

export function renderPriceEditor(
  container: HTMLElement,
  products: Product[],
  updateFn: UpdateFn
): void {
  const originalPrices = new Map<string, number>(products.map(p => [p.id, p.price_ngn]))
  const changedPrices = new Map<string, number>()

  container.innerHTML = ''

  const feedback = document.createElement('div')
  feedback.setAttribute('data-feedback', '')
  container.appendChild(feedback)

  const table = document.createElement('table')
  table.innerHTML = `<thead><tr>
    <th>Name</th><th>Size</th><th>Units/Carton</th><th>Price (₦)</th>
  </tr></thead>`
  const tbody = document.createElement('tbody')

  products.forEach(product => {
    const tr = document.createElement('tr')
    tr.setAttribute('data-product-id', product.id)

    const input = document.createElement('input')
    input.type = 'number'
    input.value = String(product.price_ngn)
    input.min = '0'
    input.setAttribute('data-price-input', product.id)

    input.addEventListener('input', () => {
      const newPrice = Number(input.value)
      if (newPrice !== originalPrices.get(product.id)) {
        changedPrices.set(product.id, newPrice)
        tr.setAttribute('data-changed', '')
      } else {
        changedPrices.delete(product.id)
        tr.removeAttribute('data-changed')
      }
      saveBtn.disabled = changedPrices.size === 0
    })

    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${product.size}</td>
      <td>${product.units_per_carton}</td>
    `
    const priceTd = document.createElement('td')
    priceTd.appendChild(input)
    tr.appendChild(priceTd)

    tbody.appendChild(tr)
  })

  table.appendChild(tbody)
  container.appendChild(table)

  const saveBtn = document.createElement('button')
  saveBtn.setAttribute('data-action', 'save-prices')
  saveBtn.textContent = 'Save All'
  saveBtn.disabled = true
  container.appendChild(saveBtn)

  saveBtn.addEventListener('click', () => {
    const updates = Array.from(changedPrices.entries()).map(([id, price_ngn]) => ({
      id,
      price_ngn,
    }))

    saveBtn.disabled = true

    updateFn(updates).then(() => {
      updates.forEach(({ id, price_ngn }) => {
        originalPrices.set(id, price_ngn)
        const row = tbody.querySelector(`[data-product-id="${id}"]`)
        row?.removeAttribute('data-changed')
      })
      changedPrices.clear()

      feedback.setAttribute('data-feedback', 'success')
      feedback.textContent = 'Prices saved'
    }).catch(() => {
      feedback.setAttribute('data-feedback', 'error')
      feedback.textContent = 'Failed to save prices'
      saveBtn.disabled = false
    })
  })
}
