import type { Profile } from '../types'

export interface UserListOptions {
  changeRoleFn?: (userId: string, role: Profile['role']) => Promise<void>
  inviteFn?: (email: string, full_name: string, role: Profile['role']) => Promise<void>
  removeFn?: (userId: string) => Promise<void>
  refetchFn?: () => Promise<Profile[]>
  currentUserId?: string
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function renderTable(
  container: HTMLElement,
  profiles: Profile[],
  changeRoleFn?: UserListOptions['changeRoleFn'],
  removeFn?: UserListOptions['removeFn'],
  refetchFn?: UserListOptions['refetchFn'],
  currentUserId?: string,
): void {
  const existing = container.querySelector('table')
  if (existing) existing.remove()
  const existingErr = container.querySelector('[data-remove-error]')
  if (existingErr) existingErr.remove()

  const errorEl = document.createElement('span')
  errorEl.setAttribute('data-remove-error', '')
  errorEl.style.cssText = 'color:#c00;display:none;'

  const table = document.createElement('table')
  table.innerHTML = `<thead><tr>
    <th>Name</th><th>Role</th><th>Member since</th>${removeFn ? '<th></th>' : ''}
  </tr></thead>`
  const tbody = document.createElement('tbody')

  profiles.forEach(profile => {
    const tr = document.createElement('tr')
    tr.setAttribute('data-user-id', profile.id)

    const nameCell = document.createElement('td')
    nameCell.textContent = profile.full_name

    const roleCell = document.createElement('td')
    if (changeRoleFn) {
      const select = document.createElement('select')
      select.setAttribute('data-role-select', '')
      const roles: Profile['role'][] = ['owner', 'manager']
      roles.forEach(r => {
        const opt = document.createElement('option')
        opt.value = r
        opt.textContent = r
        if (r === profile.role) opt.selected = true
        select.appendChild(opt)
      })
      select.addEventListener('change', () => {
        void changeRoleFn(profile.id, select.value as Profile['role'])
      })
      roleCell.appendChild(select)
    } else {
      roleCell.textContent = profile.role
    }

    const dateCell = document.createElement('td')
    dateCell.textContent = formatDate(profile.created_at)

    tr.appendChild(nameCell)
    tr.appendChild(roleCell)
    tr.appendChild(dateCell)

    if (removeFn && refetchFn) {
      const actionCell = document.createElement('td')
      const removeBtn = document.createElement('button')
      removeBtn.setAttribute('data-remove-btn', '')
      removeBtn.textContent = 'Remove'
      removeBtn.disabled = profile.id === currentUserId

      removeBtn.addEventListener('click', () => {
        if (!window.confirm(`Remove ${profile.full_name}?`)) return
        errorEl.style.display = 'none'
        errorEl.textContent = ''
        removeBtn.disabled = true

        void removeFn(profile.id)
          .then(() => refetchFn())
          .then((updated) => {
            renderTable(container, updated, changeRoleFn, removeFn, refetchFn, currentUserId)
          })
          .catch((err: unknown) => {
            errorEl.textContent = err instanceof Error ? err.message : 'Remove failed'
            errorEl.style.display = ''
            removeBtn.disabled = profile.id === currentUserId
          })
      })

      actionCell.appendChild(removeBtn)
      tr.appendChild(actionCell)
    }

    tbody.appendChild(tr)
  })

  table.appendChild(tbody)
  container.appendChild(errorEl)
  container.appendChild(table)
}

export function renderUserList(container: HTMLElement, profiles: Profile[], options: UserListOptions = {}): void {
  const { changeRoleFn, inviteFn, removeFn, refetchFn, currentUserId } = options
  container.innerHTML = ''

  if (inviteFn && refetchFn) {
    const form = document.createElement('form')
    form.setAttribute('data-invite-form', '')
    form.style.cssText = 'margin-bottom:1rem;display:flex;flex-wrap:wrap;gap:0.5rem;align-items:flex-end;'

    const emailInput = document.createElement('input')
    emailInput.type = 'email'
    emailInput.placeholder = 'Email'
    emailInput.setAttribute('data-invite-email', '')
    emailInput.required = true

    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.placeholder = 'Full name'
    nameInput.setAttribute('data-invite-name', '')
    nameInput.required = true

    const roleSelect = document.createElement('select')
    roleSelect.setAttribute('data-invite-role', '')
    const roles: Profile['role'][] = ['manager', 'owner']
    roles.forEach(r => {
      const opt = document.createElement('option')
      opt.value = r
      opt.textContent = r
      roleSelect.appendChild(opt)
    })

    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    submitBtn.setAttribute('data-invite-submit', '')
    submitBtn.textContent = 'Invite user'

    const errorEl = document.createElement('span')
    errorEl.setAttribute('data-invite-error', '')
    errorEl.style.color = '#c00'
    errorEl.style.display = 'none'

    form.appendChild(emailInput)
    form.appendChild(nameInput)
    form.appendChild(roleSelect)
    form.appendChild(submitBtn)
    form.appendChild(errorEl)

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      errorEl.style.display = 'none'
      errorEl.textContent = ''
      submitBtn.disabled = true

      void inviteFn(emailInput.value, nameInput.value, roleSelect.value as Profile['role'])
        .then(() => refetchFn())
        .then((updated) => {
          emailInput.value = ''
          nameInput.value = ''
          roleSelect.value = 'manager'
          renderTable(container, updated, changeRoleFn, removeFn, refetchFn, currentUserId)
        })
        .catch((err: unknown) => {
          errorEl.textContent = err instanceof Error ? err.message : 'Invite failed'
          errorEl.style.display = ''
        })
        .finally(() => {
          submitBtn.disabled = false
        })
    })

    container.appendChild(form)
  }

  renderTable(container, profiles, changeRoleFn, removeFn, refetchFn, currentUserId)
}
