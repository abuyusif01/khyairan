---
# khaiyran-ya24
title: Centralize CSS into dedicated files and fix tag checkbox layout
status: in-progress
type: bug
priority: high
created_at: 2026-04-26T11:35:38Z
updated_at: 2026-04-26T11:35:42Z
---

All CSS is currently in <style> blocks inside dashboard.html and index.html. User has asked for centralization. Additionally the tag checkboxes in the edit product form render as an unstyled wall of text with no grid/flex layout — unusable on mobile. Fix both: extract CSS to src/dashboard.css and src/login.css (imported via TS entry points), add grid layout for tag checkboxes.
