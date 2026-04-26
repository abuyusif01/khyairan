import type { Tag } from '../types'

export interface TagListOptions {
  toggleFn?: (tagId: string, published: boolean) => Promise<void>
  deleteFn?: (tagId: string) => Promise<void>
  countProductsFn?: (tagId: string) => Promise<number>
  isOwner?: boolean
  reorderFn?: (updates: Array<{ tagId: string; sortOrder: number }>) => Promise<void>
}

export function renderTagList(container: HTMLElement, tags: Tag[], options: TagListOptions = {}): void {
  const { toggleFn, deleteFn, countProductsFn, isOwner, reorderFn } = options

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
    table.setAttribute('data-table', 'tags')
    table.innerHTML = `<thead><tr>
      <th>Name</th><th class="col-slug">Slug</th><th class="col-order">Order</th><th>Status</th><th>Actions</th>
    </tr></thead>`
    const tbody = document.createElement('tbody')

    const getVisibleRows = (): HTMLElement[] =>
      Array.from(tbody.querySelectorAll<HTMLElement>('[data-tag-id]'))

    const updateReorderButtons = (): void => {
      if (!reorderFn) return
      const rows = getVisibleRows()
      rows.forEach((row, idx) => {
        const existing = row.querySelectorAll('[data-action="move-up"],[data-action="move-down"]')
        existing.forEach(el => el.remove())

        const actionsCell = row.querySelector('td:last-child') ?? row
        const tagId = row.getAttribute('data-tag-id') ?? ''
        const tag = sorted.find(t => t.id === tagId)
        if (!tag) return

        if (idx > 0) {
          const upBtn = document.createElement('button')
          upBtn.type = 'button'
          upBtn.setAttribute('data-action', 'move-up')
          upBtn.textContent = '↑'
          upBtn.addEventListener('click', () => {
            upBtn.disabled = true
            const prevRow = rows[idx - 1]
            const prevId = prevRow.getAttribute('data-tag-id') ?? ''
            const prevTag = sorted.find(t => t.id === prevId)
            if (!prevTag) { upBtn.disabled = false; return }
            const curOrder = tag.sort_order
            tag.sort_order = prevTag.sort_order
            prevTag.sort_order = curOrder
            void reorderFn([
              { tagId, sortOrder: tag.sort_order },
              { tagId: prevId, sortOrder: prevTag.sort_order },
            ]).then(() => {
              tbody.insertBefore(row, prevRow)
              updateReorderButtons()
            }).catch(() => {
              prevTag.sort_order = tag.sort_order
              tag.sort_order = curOrder
              upBtn.disabled = false
            })
          })
          actionsCell.appendChild(upBtn)
        }

        if (idx < rows.length - 1) {
          const downBtn = document.createElement('button')
          downBtn.type = 'button'
          downBtn.setAttribute('data-action', 'move-down')
          downBtn.textContent = '↓'
          downBtn.addEventListener('click', () => {
            downBtn.disabled = true
            const nextRow = rows[idx + 1]
            const nextId = nextRow.getAttribute('data-tag-id') ?? ''
            const nextTag = sorted.find(t => t.id === nextId)
            if (!nextTag) { downBtn.disabled = false; return }
            const curOrder = tag.sort_order
            tag.sort_order = nextTag.sort_order
            nextTag.sort_order = curOrder
            void reorderFn([
              { tagId, sortOrder: tag.sort_order },
              { tagId: nextId, sortOrder: nextTag.sort_order },
            ]).then(() => {
              tbody.insertBefore(nextRow, row)
              updateReorderButtons()
            }).catch(() => {
              nextTag.sort_order = tag.sort_order
              tag.sort_order = curOrder
              downBtn.disabled = false
            })
          })
          actionsCell.appendChild(downBtn)
        }
      })
    }

    sorted.forEach(tag => {
      const tr = document.createElement('tr')
      tr.setAttribute('data-tag-id', tag.id)

      const statusBadge = document.createElement('span')
      statusBadge.setAttribute('data-status', tag.published ? 'published' : 'draft')
      statusBadge.textContent = tag.published ? 'Published' : 'Draft'

      const actionsCell = document.createElement('td')

      const editLink = document.createElement('a')
      editLink.href = `#edit-tag-${tag.id}`
      editLink.textContent = 'Edit'
      actionsCell.appendChild(editLink)

      if (toggleFn) {
        const toggleBtn = document.createElement('button')
        toggleBtn.setAttribute('data-action', tag.published ? 'unpublish' : 'publish')
        toggleBtn.textContent = tag.published ? 'Unpublish' : 'Publish'
        toggleBtn.addEventListener('click', () => {
          const newPublished = !tag.published
          void toggleFn(tag.id, newPublished).then(() => {
            tag.published = newPublished
            statusBadge.setAttribute('data-status', newPublished ? 'published' : 'draft')
            statusBadge.textContent = newPublished ? 'Published' : 'Draft'
            toggleBtn.setAttribute('data-action', newPublished ? 'unpublish' : 'publish')
            toggleBtn.textContent = newPublished ? 'Unpublish' : 'Publish'
          })
        })
        actionsCell.appendChild(toggleBtn)
      }

      if (deleteFn && isOwner) {
        const deleteBtn = document.createElement('button')
        deleteBtn.setAttribute('data-action', 'delete')
        deleteBtn.textContent = 'Delete'
        deleteBtn.addEventListener('click', () => {
          const doDelete = (msg: string) => {
            if (confirm(msg)) {
              void deleteFn(tag.id).then(() => tr.remove())
            }
          }
          if (countProductsFn) {
            void countProductsFn(tag.id).then(count => {
              const msg = count > 0
                ? `Tag "${tag.name}" is used by ${count} product(s). Delete anyway?`
                : `Delete tag "${tag.name}"?`
              doDelete(msg)
            })
          } else {
            doDelete(`Delete tag "${tag.name}"?`)
          }
        })
        actionsCell.appendChild(deleteBtn)
      }

      const statusCell = document.createElement('td')
      statusCell.appendChild(statusBadge)

      tr.innerHTML = `
        <td>${tag.name}</td>
        <td class="col-slug">${tag.slug}</td>
        <td class="col-order">${tag.sort_order}</td>
      `
      tr.appendChild(statusCell)
      tr.appendChild(actionsCell)

      tbody.appendChild(tr)
    })

    updateReorderButtons()

    table.appendChild(tbody)
    const wrap = document.createElement('div')
    wrap.className = 'table-wrap'
    wrap.appendChild(table)
    details.appendChild(wrap)
    container.appendChild(details)
  }
}
