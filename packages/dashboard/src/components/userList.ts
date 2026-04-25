import type { Profile } from '../types'

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function renderUserList(container: HTMLElement, profiles: Profile[]): void {
  container.innerHTML = ''

  const table = document.createElement('table')
  table.innerHTML = `<thead><tr>
    <th>Name</th><th>Role</th><th>Member since</th>
  </tr></thead>`
  const tbody = document.createElement('tbody')

  profiles.forEach(profile => {
    const tr = document.createElement('tr')
    tr.setAttribute('data-user-id', profile.id)
    tr.innerHTML = `
      <td>${profile.full_name}</td>
      <td>${profile.role}</td>
      <td>${formatDate(profile.created_at)}</td>
    `
    tbody.appendChild(tr)
  })

  table.appendChild(tbody)
  container.appendChild(table)
}
