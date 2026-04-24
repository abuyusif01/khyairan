import type { Tag } from '../types'

export function renderTagList(container: HTMLElement, tags: Tag[]): void {
  container.innerHTML = ''

  // Group tags by type
  const byType = new Map<string, Tag[]>()
  for (const tag of tags) {
    const group = byType.get(tag.type) ?? []
    group.push(tag)
    byType.set(tag.type, group)
  }

  // Render one <details> per type, sorted by sort_order within each group
  for (const [type, groupTags] of byType) {
    const sorted = [...groupTags].sort((a, b) => a.sort_order - b.sort_order)

    const details = document.createElement('details')
    details.open = true

    const summary = document.createElement('summary')
    summary.textContent = type
    details.appendChild(summary)

    const table = document.createElement('table')
    table.innerHTML = `<thead><tr>
      <th>Name</th><th>Slug</th><th>Order</th><th>Status</th>
    </tr></thead>`
    const tbody = document.createElement('tbody')

    sorted.forEach(tag => {
      const tr = document.createElement('tr')
      tr.setAttribute('data-tag-id', tag.id)
      tr.innerHTML = `
        <td>${tag.name}</td>
        <td>${tag.slug}</td>
        <td>${tag.sort_order}</td>
        <td><span data-status="${tag.published ? 'published' : 'draft'}">${tag.published ? 'Published' : 'Draft'}</span></td>
      `
      tbody.appendChild(tr)
    })

    table.appendChild(tbody)
    details.appendChild(table)
    container.appendChild(details)
  }
}
