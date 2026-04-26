export function field(labelText: string, control: HTMLElement): HTMLElement {
  const div = document.createElement('div')
  div.className = 'form-field'
  const lbl = document.createElement('label')
  lbl.textContent = labelText
  div.appendChild(lbl)
  div.appendChild(control)
  return div
}

export function checkField(labelText: string, input: HTMLInputElement, hint?: string): HTMLElement {
  const div = document.createElement('div')
  div.className = 'form-field'
  div.style.cssText = 'flex-direction:row;align-items:center;gap:0.5rem;'
  div.appendChild(input)
  const lbl = document.createElement('label')
  lbl.textContent = hint ? `${labelText} ${hint}` : labelText
  div.appendChild(lbl)
  return div
}

export function backButton(label: string, onClick: () => void): HTMLElement {
  const div = document.createElement('div')
  div.className = 'page-actions'
  const btn = document.createElement('button')
  btn.type = 'button'
  btn.textContent = `← ${label}`
  btn.addEventListener('click', onClick)
  div.appendChild(btn)
  return div
}
