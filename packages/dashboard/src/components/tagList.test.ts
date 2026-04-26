import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Tag } from '../types'

const tags: Tag[] = [
  { id: 'tag1', name: 'Carbonated', slug: 'carbonated', type: 'category', sort_order: 2, published: true },
  { id: 'tag2', name: 'Juices', slug: 'juices', type: 'category', sort_order: 1, published: false },
  { id: 'tag3', name: 'Chivita', slug: 'chivita', type: 'brand', sort_order: 1, published: true },
]

describe('renderTagList', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
  })

  it('renders one group per tag type', async () => {
    const { renderTagList } = await import('./tagList')
    renderTagList(container, tags)

    const groups = container.querySelectorAll('details')
    expect(groups.length).toBe(2) // category + brand
  })

  it('shows type name in group header', async () => {
    const { renderTagList } = await import('./tagList')
    renderTagList(container, tags)

    const summaries = Array.from(container.querySelectorAll('summary'))
    const summaryTexts = summaries.map(s => s.textContent ?? '')
    expect(summaryTexts.some(t => t.includes('category'))).toBe(true)
    expect(summaryTexts.some(t => t.includes('brand'))).toBe(true)
  })

  it('renders tag rows with name slug sort_order and published status', async () => {
    const { renderTagList } = await import('./tagList')
    renderTagList(container, tags)

    const text = container.textContent ?? ''
    expect(text).toContain('Carbonated')
    expect(text).toContain('carbonated')
    expect(text).toContain('Chivita')
    expect(text).toContain('chivita')

    const publishedBadges = container.querySelectorAll('[data-status="published"]')
    const draftBadges = container.querySelectorAll('[data-status="draft"]')
    expect(publishedBadges.length).toBeGreaterThan(0)
    expect(draftBadges.length).toBeGreaterThan(0)
  })

  it('sorts tags within group by sort_order', async () => {
    const { renderTagList } = await import('./tagList')
    renderTagList(container, tags)

    // category group: Juices (sort_order=1) should come before Carbonated (sort_order=2)
    const categoryGroup = Array.from(container.querySelectorAll('details')).find(
      d => d.querySelector('summary')?.textContent?.includes('category')
    )
    expect(categoryGroup).toBeTruthy()

    const rows = categoryGroup!.querySelectorAll('[data-tag-id]')
    expect(rows[0]?.getAttribute('data-tag-id')).toBe('tag2') // Juices sort_order=1
    expect(rows[1]?.getAttribute('data-tag-id')).toBe('tag1') // Carbonated sort_order=2
  })

  it('renders toggle button for each tag', async () => {
    const { renderTagList } = await import('./tagList')
    const toggleFn = vi.fn().mockResolvedValue(undefined)
    renderTagList(container, tags, { toggleFn })

    const buttons = container.querySelectorAll('[data-action="unpublish"], [data-action="publish"]')
    expect(buttons.length).toBe(3)
  })

  it('toggle button calls toggleFn and updates status', async () => {
    const { renderTagList } = await import('./tagList')
    const toggleFn = vi.fn().mockResolvedValue(undefined)
    renderTagList(container, tags, { toggleFn })

    // tag1 is published — toggle should unpublish
    const tag1Row = container.querySelector('[data-tag-id="tag1"]')
    const toggleBtn = tag1Row?.querySelector<HTMLButtonElement>('[data-action="unpublish"]')
    expect(toggleBtn).toBeTruthy()
    toggleBtn!.click()

    await vi.waitFor(() => expect(toggleFn).toHaveBeenCalledWith('tag1', false))
    // Status badge should update to draft
    const badge = tag1Row?.querySelector('[data-status]')
    expect(badge?.getAttribute('data-status')).toBe('draft')
  })

  it('renders delete button only when isOwner', async () => {
    const { renderTagList } = await import('./tagList')
    const deleteFn = vi.fn().mockResolvedValue(undefined)

    renderTagList(container, tags, { deleteFn, isOwner: false })
    expect(container.querySelectorAll('[data-action="delete"]').length).toBe(0)

    container.innerHTML = ''
    renderTagList(container, tags, { deleteFn, isOwner: true })
    expect(container.querySelectorAll('[data-action="delete"]').length).toBe(3)
  })

  it('delete button calls deleteFn after confirmation', async () => {
    const { renderTagList } = await import('./tagList')
    const deleteFn = vi.fn().mockResolvedValue(undefined)
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderTagList(container, tags, { deleteFn, isOwner: true })

    const tag3Row = container.querySelector('[data-tag-id="tag3"]')!
    const deleteBtn = tag3Row.querySelector<HTMLButtonElement>('[data-action="delete"]')!
    deleteBtn.click()

    await vi.waitFor(() => expect(deleteFn).toHaveBeenCalledWith('tag3'))
    expect(container.querySelector('[data-tag-id="tag3"]')).toBeNull()
  })

  it('reorder buttons appear for each tag when reorderFn provided', async () => {
    const { renderTagList } = await import('./tagList')
    const reorderFn = vi.fn().mockResolvedValue(undefined)
    renderTagList(container, tags, { reorderFn })

    // 3 tags total, each should have at least one reorder button (up or down)
    const upBtns = container.querySelectorAll('[data-action="move-up"]')
    const downBtns = container.querySelectorAll('[data-action="move-down"]')
    expect(upBtns.length).toBeGreaterThan(0)
    expect(downBtns.length).toBeGreaterThan(0)
  })

  it('first tag in group has no move-up; last tag in group has no move-down', async () => {
    const { renderTagList } = await import('./tagList')
    const reorderFn = vi.fn().mockResolvedValue(undefined)
    renderTagList(container, tags, { reorderFn })

    // category group: Juices (sort_order=1) is first, Carbonated (sort_order=2) is last
    const categoryGroup = Array.from(container.querySelectorAll('details')).find(
      d => d.querySelector('summary')?.textContent?.includes('category')
    )!
    const rows = Array.from(categoryGroup.querySelectorAll('[data-tag-id]'))

    const firstRow = rows[0]
    const lastRow = rows[rows.length - 1]

    expect(firstRow.querySelector('[data-action="move-up"]')).toBeNull()
    expect(lastRow.querySelector('[data-action="move-down"]')).toBeNull()
  })

  it('renders edit link for each tag row', async () => {
    const { renderTagList } = await import('./tagList')
    renderTagList(container, tags)

    // Each tag row must have an edit link pointing to #edit-tag-{id}
    for (const tag of tags) {
      const row = container.querySelector(`[data-tag-id="${tag.id}"]`)
      expect(row).toBeTruthy()
      const editLink = row!.querySelector<HTMLAnchorElement>(`a[href="#edit-tag-${tag.id}"]`)
      expect(editLink).toBeTruthy()
      expect(editLink!.textContent?.trim()).toBe('Edit')
    }
  })

  it('move-up swaps sort_orders and calls reorderFn with correct values', async () => {
    const { renderTagList } = await import('./tagList')
    const reorderFn = vi.fn().mockResolvedValue(undefined)
    renderTagList(container, tags, { reorderFn })

    // category group: Juices (tag2, sort_order=1) first, Carbonated (tag1, sort_order=2) second
    const categoryGroup = Array.from(container.querySelectorAll('details')).find(
      d => d.querySelector('summary')?.textContent?.includes('category')
    )!
    const rows = Array.from(categoryGroup.querySelectorAll<HTMLElement>('[data-tag-id]'))
    const secondRow = rows[1] // Carbonated (sort_order=2)
    const moveUpBtn = secondRow.querySelector<HTMLButtonElement>('[data-action="move-up"]')!
    moveUpBtn.click()

    await vi.waitFor(() => expect(reorderFn).toHaveBeenCalledOnce())

    const updates = reorderFn.mock.calls[0][0] as Array<{ tagId: string; sortOrder: number }>
    expect(updates.length).toBe(2)

    const tag1Update = updates.find(u => u.tagId === 'tag1')!
    const tag2Update = updates.find(u => u.tagId === 'tag2')!
    expect(tag1Update.sortOrder).toBe(1)  // Carbonated takes Juices's old sort_order
    expect(tag2Update.sortOrder).toBe(2)  // Juices takes Carbonated's old sort_order
  })
})
