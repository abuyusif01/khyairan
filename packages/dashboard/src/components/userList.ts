import type { Profile } from '../types'

export interface UserListOptions {
  changeRoleFn?: (userId: string, role: Profile['role']) => Promise<void>
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function renderUserList(container: HTMLElement, profiles: Profile[], options: UserListOptions = {}): void {
  const { changeRoleFn } = options
  container.innerHTML = ''

  const table = document.createElement('table')
  table.innerHTML = `<thead><tr>
    <th>Name</th><th>Role</th><th>Member since</th>
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
    tbody.appendChild(tr)
  })

  table.appendChild(tbody)
  container.appendChild(table)
}
