import { describe, it, expect, beforeEach } from 'vitest'
import type { Tag } from '../types'
import { renderFilterBar } from './filterBar'

const sampleTags: Tag[] = [
  { id: 'tag1', name: 'Carbonated', slug: 'carbonated', type: 'category', sort_order: 0, published: true },
  { id: 'tag2', name: 'Juices', slug: 'juices', type: 'category', sort_order: 1, published: true },
  { id: 'tag3', name: 'Water', slug: 'water', type: 'category', sort_order: 2, published: true },
]

const outOfOrderTags: Tag[] = [
  { id: 't1', name: 'C', slug: 'c', type: 'category', sort_order: 2, published: true },
  { id: 't2', name: 'A', slug: 'a', type: 'category', sort_order: 0, published: true },
  { id: 't3', name: 'B', slug: 'b', type: 'category', sort_order: 1, published: true },
]

describe('renderFilterBar', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
  })

  it('renders All chip plus one chip per category', () => {
    renderFilterBar(sampleTags, container)
    const chips = container.querySelectorAll('.chip')
    expect(chips).toHaveLength(4) // All + 3 categories
    expect(chips[0].textContent).toBe('All')
  })

  it('All chip is active by default', () => {
    renderFilterBar(sampleTags, container)
    const allChip = container.querySelector('.chip')
    expect(allChip?.classList.contains('active')).toBe(true)
  })

  it('tapping a chip sets it as active and deactivates others', () => {
    renderFilterBar(sampleTags, container)
    const chips = container.querySelectorAll('.chip')
    const secondChip = chips[1] as HTMLElement
    secondChip.click()
    expect(secondChip.classList.contains('active')).toBe(true)
    expect(chips[0].classList.contains('active')).toBe(false)
  })

  it('chips render in sort_order', () => {
    renderFilterBar(outOfOrderTags, container)
    const chips = Array.from(container.querySelectorAll('.chip'))
    // First is "All", then sorted: A (0), B (1), C (2)
    expect(chips[1].textContent).toBe('A')
    expect(chips[2].textContent).toBe('B')
    expect(chips[3].textContent).toBe('C')
  })
})
