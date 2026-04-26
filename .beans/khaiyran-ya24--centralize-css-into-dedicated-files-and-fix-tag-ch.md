---
# khaiyran-ya24
title: Centralize CSS into dedicated files and fix tag checkbox layout
status: completed
type: bug
priority: high
created_at: 2026-04-26T11:35:38Z
updated_at: 2026-04-26T11:39:32Z
---

All CSS is currently in <style> blocks inside dashboard.html and index.html. User has asked for centralization. Additionally the tag checkboxes in the edit product form render as an unstyled wall of text with no grid/flex layout — unusable on mobile. Fix both: extract CSS to src/dashboard.css and src/login.css (imported via TS entry points), add grid layout for tag checkboxes.

## Summary of Changes

- Extracted all CSS from dashboard.html's <style> block into packages/dashboard/src/dashboard.css
- Extracted all CSS from index.html's <style> block into packages/dashboard/src/login.css
- Imported both CSS files via their respective TS entry points (dashboard.ts and main.ts) — Vite handles bundling
- Added .tag-options grid container (auto-fill, minmax 140px) inside fieldsets for tag checkboxes
- Added proper label styling for tag checkboxes: flex row, gap, cursor, hover state
- Applied same fix to both addProductForm.ts and editProductForm.ts
- Verified visually: tag checkboxes now render in 3-column grid, all other styling intact
