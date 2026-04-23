# CLAUDE.md — Public Website

Package-specific architecture for the Khyairan Soft Drinks customer-facing site.

---

## Purpose

Single-page mobile-first website for retail and bulk customers. Browse products, see prices, tap WhatsApp to order.

---

## Stack

- Vite + TypeScript (vanilla — no UI framework)
- Supabase JS client for data fetching

---

## Design Principles

- **Mobile first** — primary audience is on phones, possibly slow data
- **Single page** — no navigation between pages, one continuous scroll
- **Under 200KB** page weight (excluding product images)
- **Works on 3G** within 3 seconds
- **Product images lazy-loaded** and served as compressed WebP from Supabase Storage

---

## Layout (top to bottom, single scroll)

1. **Header** — text logo, business name, WhatsApp button. Sticky.
2. **Filter bar** — sticky below header. Category chips: "All" (default) + one chip per published category. Tap to smooth-scroll to that section. Active chip highlights. Chips scroll horizontally if they overflow.
3. **Product grid** — products grouped by category (each category is a labelled section). 2-column card grid on mobile. Card: lazy-loaded image, name, size, unit type, units per carton, price (NGN), WhatsApp order link.
4. **About strip** — shop name, address, what we do. 3-4 lines.
5. **Footer** — phone, address, WhatsApp link.
6. **Floating WhatsApp button** — fixed bottom-right, always visible, opens generic order message.

---

## Data

- Fetches only `published = true` products and tags from Supabase
- Single price displayed: NGN per carton
- No USD on public site — export pricing handled separately
- Products grouped by category, rendered client-side via vanilla TypeScript (dataset is small, ~37-100 products)
- Products ordered by `product_tags.sort_order` within the active tag filter

---

## Brand

- White + green (WhatsApp green as the single CTA colour)
- Clean typography, no clutter
- Product images provide colour — site is a neutral backdrop

---

## What is NOT on this site

- No e-commerce / cart / checkout
- No user accounts / login
- No search (filter chips are enough for ~50-100 products)
- No hero banner (wastes mobile viewport, pushes products down)
- No map embed (heavy, eats data — text address with Google Maps link instead)
- No separate pages (about, contact, etc.)
