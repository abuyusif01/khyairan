import type { Tag } from '../types'

function setActiveChip(chips: NodeListOf<Element>, active: Element): void {
  chips.forEach(c => c.classList.remove('active'))
  active.classList.add('active')
  if (active instanceof HTMLElement && typeof active.scrollIntoView === 'function') {
    active.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }
}

export function renderFilterBar(tags: Tag[], container: HTMLElement): void {
  container.innerHTML = ''

  const sorted = [...tags].sort((a, b) => a.sort_order - b.sort_order)

  const allChip = document.createElement('button')
  allChip.className = 'chip active'
  allChip.textContent = 'All'
  allChip.type = 'button'
  container.appendChild(allChip)

  for (const tag of sorted) {
    const chip = document.createElement('button')
    chip.className = 'chip'
    chip.textContent = tag.name
    chip.type = 'button'
    chip.dataset['slug'] = tag.slug
    container.appendChild(chip)
  }

  const chips = container.querySelectorAll('.chip')

  allChip.addEventListener('click', () => {
    setActiveChip(chips, allChip)
    const grid = document.getElementById('product-grid')
    grid?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })

  chips.forEach(chip => {
    if (chip === allChip) return
    chip.addEventListener('click', () => {
      setActiveChip(chips, chip)
      const slug = (chip as HTMLElement).dataset['slug']
      if (slug) {
        const section = document.getElementById(`category-${slug}`)
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })

  // IntersectionObserver for scroll-sync — skip if unavailable (jsdom, older browsers)
  if (typeof IntersectionObserver === 'undefined') return

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const sectionId = entry.target.closest('section')?.id
          if (!sectionId) {
            setActiveChip(chips, allChip)
            return
          }
          const slug = sectionId.replace('category-', '')
          const matchingChip = Array.from(chips).find(
            c => (c as HTMLElement).dataset['slug'] === slug
          )
          if (matchingChip) {
            setActiveChip(chips, matchingChip)
          }
          break
        }
      }
    },
    { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
  )

  document.querySelectorAll('.category-heading').forEach(h => observer.observe(h))
}
