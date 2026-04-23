---
# khaiyran-c4dp
title: Web frontend — public product catalog
status: completed
type: milestone
priority: normal
tags:
    - web
    - frontend
created_at: 2026-04-23T00:02:17Z
updated_at: 2026-04-23T12:03:35Z
---

# Web Frontend — Public Product Catalog

## Description

Single-page, mobile-first product catalog for retail customers in Kano. Vanilla TypeScript (no framework), one CSS file with custom properties, data from Supabase. Products grouped by category with sticky filter tabs, floating WhatsApp button, and per-product WhatsApp order links.

## Decisions Log

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Single page vs multi-page | Single page | Not enough content to justify multiple pages |
| Framework | Vanilla TypeScript | Interactivity is just fetch + render + filter. Alpine.js dropped (15KB for no value) |
| Styling | Single CSS file with custom properties | Cacheable, theming via variables, no build tooling overhead |
| Colour scheme | White + green (WhatsApp) | Product images provide colour. Clean backdrop, single strong CTA colour |
| Logo | Text-only in HTML/CSS | No designer, no brand mark yet. Swap for SVG later |
| Layout | Category-grouped sections | Matches how retail customers think. Mirrors PDF catalog. Common Nigerian FMCG pattern |
| Filter behaviour | Chip taps smooth-scroll to section | All products always visible. Common pattern for Nigerian FMCG sites |
| Brands toggle | Dropped | Local retail customers think in categories, not brands |
| WhatsApp CTA | Floating button + per-card links | Table stakes for Nigerian business sites. Pre-filled messages reduce friction |
| Column layout | 2-column grid on mobile | Industry standard for product catalogs on mobile |

## Architecture

```
packages/web/
  index.html              # static shell (header, about, footer)
  src/
    main.ts               # entry: fetch data, mount components
    lib/supabase.ts       # Supabase client + typed queries
    components/
      filterBar.ts        # category tabs, smooth-scroll on tap
      productGrid.ts      # renders grouped product sections + cards
    types.ts              # Product, Tag, ProductTag interfaces
    style.css             # single stylesheet, CSS custom properties
```

## Page Structure

```
┌─────────────────────────────────┐
│  KHYAIRAN SOFT DRINKS   [WhatsApp]  │  <- sticky header
├─────────────────────────────────┤
│  [All] [Carbonated] [Juices]...│  <- sticky category tabs
├─────────────────────────────────┤     (horizontal scroll)
│                                 │
│  -- Carbonated Drinks --------  │  <- category heading
│  ┌──────┐  ┌──────┐            │
│  │ img  │  │ img  │            │  <- 2-col grid
│  │ name │  │ name │            │
│  │ size │  │ size │            │
│  │₦4,500│  │₦6,200│            │
│  └──────┘  └──────┘            │
│                                 │
│  -- Juices & Nectars ---------  │  <- next category
│  ┌──────┐  ┌──────┐            │
│  │ ...  │  │ ...  │            │
│  └──────┘  └──────┘            │
│                                 │
│  (Water, Malt, Energy, Dairy)  │
├─────────────────────────────────┤
│  Khyairan Soft Drinks          │  <- about strip
│  Dawanau, Dawakin Tofa Road    │
│  Kano, Nigeria                 │
├─────────────────────────────────┤
│  Phone - WhatsApp - Address    │  <- footer
└─────────────────────────────────┘
                          [chat]  <- floating WhatsApp button
                                     (always visible, bottom-right)
```

## Interactions

| Action | Behaviour |
|--------|-----------|
| Tap category chip | Smooth-scrolls to that category section. Active chip highlights |
| Tap "All" chip | Scrolls to top of product area. All categories visible |
| Tap product card | Opens WhatsApp with pre-filled message: "Hi, I'm interested in Coca-Cola 35CL (12 bottles/carton)" |
| Tap floating WhatsApp button | Opens WhatsApp with generic message: "Hi, I'd like to place an order" |
| Tap header WhatsApp | Same as floating button |
| Scroll past a category heading | Active chip in tab bar updates to match visible section (IntersectionObserver) |

## Product Card

```
┌────────────────┐
│                │
│   [product     │
│    image]      │  <- lazy-loaded WebP from Supabase Storage
│                │
├────────────────┤
│ Coca-Cola      │  <- product name
│ 35CL - Bottle  │  <- size + unit type
│ 12 per carton  │  <- units_per_carton
│                │
│ ₦4,500   [chat]│  <- price_ngn + WhatsApp icon
└────────────────┘
```

## Colour System

```css
:root {
  /* Base */
  --color-bg:              #ffffff;
  --color-text:            #1a1a1a;
  --color-text-muted:      #666666;
  --color-surface:         #f5f5f5;
  --color-border:          #e5e5e5;

  /* Brand */
  --color-brand:           #1a1a1a;

  /* CTA */
  --color-cta:             #25D366;
  --color-cta-hover:       #1fb855;
  --color-cta-text:        #ffffff;

  /* Filter chips */
  --color-chip:            #f0f0f0;
  --color-chip-text:       #333333;
  --color-chip-active:     #1a1a1a;
  --color-chip-active-text:#ffffff;

  /* Category headings */
  --color-section-heading: #1a1a1a;
  --color-section-rule:    #e5e5e5;

  /* Spacing scale */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-sm: 0.75rem;
  --font-size-base: 0.875rem;
  --font-size-lg: 1rem;
  --font-size-xl: 1.25rem;
}
```

## Data Flow

```
Page load
  -> main.ts imports supabase client
  -> Fetches published products + published category tags + product_tags
  -> Groups products by category using product_tags join
  -> Sorts categories by tags.sort_order
  -> Sorts products within each category by product_tags.sort_order
  -> Passes grouped data to productGrid.ts -> renders DOM
  -> Passes category list to filterBar.ts -> renders chips
  -> filterBar listens for chip taps -> smooth-scrolls to section
  -> IntersectionObserver watches category headings -> updates active chip on scroll
```

## Out of Scope

- No cart, checkout, or e-commerce
- No user accounts or login
- No search bar (chips are enough for ~37 products)
- No hero banner
- No map embed (text address + Google Maps link)
- No separate pages
- No brands toggle
- No Alpine.js or any UI framework

## Summary of Changes

All child task beans completed during night shift (2026-04-23):

- **khaiyran-hwik**: Removed Alpine.js from web package — vanilla TS initApp
- **khaiyran-q7zk**: Static HTML shell + CSS theme — full index.html with sticky header, mount points, about strip, footer, floating WhatsApp button; style.css with complete CSS custom property system
- **khaiyran-f3ia**: TypeScript types + Supabase data layer — Product/Tag/ProductTag interfaces, fetchPublishedProducts, fetchPublishedCategoryTags, fetchProductTags, groupProductsByCategory
- **khaiyran-75n2**: Product grid component — renders category sections with slug-based IDs, 2-column card grids, lazy-loaded images, ₦ price formatting
- **khaiyran-9zx7**: WhatsApp integration — buildWhatsAppUrl helper, per-card order links, floating + header buttons wired
- **khaiyran-8qis**: Filter bar + scroll sync — category chips sorted by sort_order, click-to-scroll, IntersectionObserver scroll sync, main.ts orchestration

21 tests passing across 6 test files. All quality gates pass (typecheck, lint, build).
