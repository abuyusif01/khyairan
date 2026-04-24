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

    const buttons = container.querySelectorAll('[data-action="toggle-published"]')
    expect(buttons.length).toBe(3)
  })

  it('toggle button calls toggleFn and updates status', async () => {
    const { renderTagList } = await import('./tagList')
    const toggleFn = vi.fn().mockResolvedValue(undefined)
    renderTagList(container, tags, { toggleFn })

    // tag1 is published — toggle should unpublish
    const tag1Row = container.querySelector('[data-tag-id="tag1"]')
    const toggleBtn = tag1Row?.querySelector<HTMLButtonElement>('[data-action="toggle-published"]')
    expect(toggleBtn).toBeTruthy()
    toggleBtn!.click()

    await vi.waitFor(() => expect(toggleFn).toHaveBeenCalledWith('tag1', false))
    // Status badge should update to draft
    const badge = tag1Row?.querySelector('[data-status]')
    expect(badge?.getAttribute('data-status')).toBe('draft')
  })
})
