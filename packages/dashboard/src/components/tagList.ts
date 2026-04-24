import type { Tag } from '../types'

export interface TagListOptions {
  toggleFn?: (tagId: string, published: boolean) => Promise<void>
  deleteFn?: (tagId: string) => Promise<void>
  isOwner?: boolean
}

export function renderTagList(container: HTMLElement, tags: Tag[], options: TagListOptions = {}): void {
  const { toggleFn, deleteFn, isOwner } = options

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
      <th>Name</th><th>Slug</th><th>Order</th><th>Status</th><th>Actions</th>
    </tr></thead>`
    const tbody = document.createElement('tbody')

    sorted.forEach(tag => {
      const tr = document.createElement('tr')
      tr.setAttribute('data-tag-id', tag.id)

      const statusBadge = document.createElement('span')
      statusBadge.setAttribute('data-status', tag.published ? 'published' : 'draft')
      statusBadge.textContent = tag.published ? 'Published' : 'Draft'

      const actionsCell = document.createElement('td')

      if (toggleFn) {
        const toggleBtn = document.createElement('button')
        toggleBtn.setAttribute('data-action', 'toggle-published')
        toggleBtn.textContent = tag.published ? 'Unpublish' : 'Publish'
        toggleBtn.addEventListener('click', () => {
          const newPublished = !tag.published
          void toggleFn(tag.id, newPublished).then(() => {
            tag.published = newPublished
            statusBadge.setAttribute('data-status', newPublished ? 'published' : 'draft')
            statusBadge.textContent = newPublished ? 'Published' : 'Draft'
            toggleBtn.textContent = newPublished ? 'Unpublish' : 'Publish'
          })
        })
        actionsCell.appendChild(toggleBtn)
      }

      if (deleteFn && isOwner) {
        const deleteBtn = document.createElement('button')
        deleteBtn.setAttribute('data-action', 'delete-tag')
        deleteBtn.textContent = 'Delete'
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Delete tag "${tag.name}"?`)) {
            void deleteFn(tag.id).then(() => tr.remove())
          }
        })
        actionsCell.appendChild(deleteBtn)
      }

      const statusCell = document.createElement('td')
      statusCell.appendChild(statusBadge)

      tr.innerHTML = `
        <td>${tag.name}</td>
        <td>${tag.slug}</td>
        <td>${tag.sort_order}</td>
      `
      tr.appendChild(statusCell)
      tr.appendChild(actionsCell)

      tbody.appendChild(tr)
    })

    table.appendChild(tbody)
    details.appendChild(table)
    container.appendChild(details)
  }
}
