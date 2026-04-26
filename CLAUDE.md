# CLAUDE.md — Khyairan Soft Drinks Website

Conventions and workflow guide for every agent and developer in this repository.
Architecture, schemas, and package-specific details live in their own `CLAUDE.md` files.

---

## 1. Project Overview

**Khyairan Soft Drinks** — Nigerian beverage business, Kano.
This is the company website. Each package in the monorepo has its own `CLAUDE.md` with package-specific context.

---

## 2. Stack

| Layer         | Choice               |
| ------------- | -------------------- |
| Language      | TypeScript           |
| Build tool    | Vite                 |
| UI            | Alpine.js            |
| Database/Auth | Supabase             |
| Docs          | mdbook (`docs/src/`) |
| Task tracking | beans (`.beans/`)    |
| Hosting       | Cloudflare R2        |
| CI/CD         | GitHub CI            |
| Dev env       | Flox                 |

---

## 3. Development Setup

### Environment

Always activate Flox first. It provides `node`, `mdbook`, and `beans`:

```bash
flox activate
```

### Commands

```bash
npm install          # install dependencies
npm run dev          # local dev server
npm run build        # production build → dist/
npm run typecheck    # TypeScript check (no emit)
npm run lint         # ESLint
mdbook build         # build docs → docs/book/
mdbook serve         # live docs preview
```

### Docs

mdbook source lives in `docs/src/`. Update relevant docs when changing user-facing behaviour — commit docs alongside the code change.

---

## 4. Working Process

Every piece of work follows this cycle exactly. No shortcuts.

```
SPEC → AGENT PRE-REVIEW → TDD → IMPLEMENT → AGENT POST-REVIEW → DONE
```

### Blocking & human escalation

You are not required to force-complete a bean. If at any point a bean requires a human decision, missing context, credentials, an unclear requirement, or anything outside your authority — **stop and flag it** rather than guessing or pushing through.

When blocked on a bean:

1. Add a `## Blocked` section to the bean explaining exactly what is needed from a human and why
2. Leave the bean open — do not mark it done
3. Pick up the next available bean if one exists
4. If no other bean is available, stop and report the blockage clearly

A blocked bean is not a failure. Forcing through ambiguity is.

### Step 1 — Write the bean

All specs live in **beans**. Nothing gets implemented without a bean.

```bash
beans list           # open tasks
beans show <id>      # read a spec
beans create         # new bean
beans done <id>      # mark completed
```

Use the [Bean Spec Format](#5-bean-spec-format). For **tasks, features, and bugs**, a spec is not ready until every section is filled — especially **Related Code**. For **epics and milestones**, use the [lighter format](#epics--milestones) instead.

### Step 2 — Pre-start agent review ← HARD GATE

Spawn a subagent to review the spec before any implementation begins. The agent must:

- Verify every file and line in **Related Code** actually exists
- Confirm every **Acceptance Criteria** item is objectively testable
- Confirm the **Tests** section is present, non-empty, and each entry names a file, a test description, and a specific assertion — reject vague entries
- Write the **Agent Pre-Start Checkpoint** section with concrete pass/fail checkpoints
- Set verdict: `APPROVED` or `NEEDS REVISION`

**No implementation until verdict is `APPROVED`.**

### Step 3 — Test-Driven Development

The **Tests** section of the bean MUST be filled before writing any code — it is part of the spec, not an afterthought. The pre-start review agent checks this is present and specific.

Write tests before implementation — no exceptions.

1. Write the tests defined in the bean's **Tests** section
2. Run them — confirm they **fail for the right reason** (assertion failure, not a syntax error)
3. Write minimal code to make them pass
4. Refactor — tests must still pass

Never write tests after the fact. If you catch yourself doing it, stop and redo in order.

Tests live alongside the code they cover:

```
src/
  lib/
    supabase.ts
    supabase.test.ts
  components/
    ProductCard.ts
    ProductCard.test.ts
```

### Frontend Testing — Playwright (MANDATORY)

Code-level tests are not sufficient for frontend beans. Every feature or bug that touches the UI **must** also be verified with the `/playwright-cli` skill.

Use `/playwright-cli` to:

- Navigate to the relevant page (`npm run dev` must be running first)
- Interact with the UI as a real user would (click, fill, submit)
- Assert visible state — elements present, text correct, no overflow, no broken layout
- Cover the happy path **and** at least one error/edge case (e.g. empty state, validation error)

Playwright checks happen **after** code tests pass, as part of Step 3 (before committing the implementation). If Playwright reveals a bug that unit tests missed, fix it before moving on.

Document each Playwright scenario in the bean's **Tests** section alongside the code tests:

```
- playwright: navigate to /admin/products — product list renders with at least one row
- playwright: click "Add product" — modal opens and form is visible
- playwright: submit empty form — validation errors appear inline
```

The post-completion review agent must confirm Playwright scenarios were run and passed.

### Step 4 — Commit structure

2–3 commits per task in this exact order:

1. **Failing tests** — tests written and confirmed failing, nothing else
2. **Implementation** — feature code, lint/type clean, all tests pass
3. **Review fixes** — only if post-review finds issues

Messages reference the bean ID:

```
test: failing tests for product card [bean-42]
feat: implement product card component [bean-42]
fix: post-review findings for product card [bean-42]
```

### Step 5 — Post-completion agent review ← HARD GATE

Spawn a subagent to review the finished implementation. The agent must:

- Tick or fail every Pre-Start Checkpoint
- Run all quality gate commands and paste output into the review
- Read every file listed in **Related Code** and verify correctness
- Confirm tests were committed before implementation (check git log)
- For frontend beans: confirm Playwright scenarios were run and passed
- Write the **Agent Post-Completion Review** with verdict `PASS` or `FAIL`

If `FAIL`: fix all findings, re-run the review. Do not close the bean until `PASS`.

### Step 6 — Mark done

```bash
beans done <id>      # add a one-line summary of what changed
```

---

## 5. Bean Spec Format

### Epics & Milestones

Epics and milestones are **containers**, not implementable work. They don't need Related Code, Tests, or agent reviews — those gates apply to their children.

```markdown
# <Title>

## Description

What this group of work achieves and why.

## Acceptance Criteria

High-level criteria — typically "all child beans completed".

- [ ] All child beans are completed
- [ ] Dashboard is usable end-to-end
```

No Related Code, no Tests, no Pre-Start Review, no Post-Completion Review.
The full working process (Steps 2–5) is skipped — just create the bean, create children, and close it when all children are done.

---

### Tasks, Features & Bugs

The full spec format below applies to all implementable work.

```markdown
# <Title>

## Description

Clear, unambiguous description of what needs to be done and why.
If it cannot be described precisely, the spec is not ready.

## Related Code

Exact files and line numbers this task will touch. Never leave empty.

- `src/components/ProductCard.ts:12-45` — product card render logic
- `src/lib/supabase.ts:8` — Supabase client initialisation

## Acceptance Criteria

Objectively verifiable checkboxes — no opinions, no ambiguity.

- [ ] Renders at 375px without overflow
- [ ] `npm run typecheck` passes with 0 errors
- [ ] `npm run lint` passes with 0 warnings

## Tests

List every test that must be written for this bean — file path, test name, and what it asserts.
This section is MANDATORY and must be filled before the pre-start review. No tests listed = spec not ready.

- `src/components/ProductCard.test.ts` — `renders product name and price` — asserts name and USD price appear in the DOM
- `src/components/ProductCard.test.ts` — `does not overflow at 375px` — asserts card width ≤ 375px
- `src/lib/supabase.test.ts` — `fetchProducts returns only published` — asserts unpublished rows are excluded

## Blocked

(Only filled if the bean cannot proceed without human input — leave absent if not blocked)

- Blocked by: <what is needed>
- Reason: <why this cannot be resolved without a human>
- Next available bean: <id or "none">

## Agent Pre-Start Checkpoint

(Written by the pre-start reviewing agent — do not fill manually)

- Agent: <name>
- Date: <date>
- Verdict: APPROVED / NEEDS REVISION
- Checkpoints:
  - [ ] <concrete, testable checkpoint>
  - [ ] <concrete, testable checkpoint>

## Agent Post-Completion Review

(Written by the post-completion reviewing agent — do not fill manually)

- Agent: <name>
- Date: <date>
- Verdict: PASS / FAIL
- Findings: <itemised or "none">
- All findings fixed: YES / NO
```

---

## 6. Quality Standards

Gates, not targets. A bean cannot close until all pass.

| Check      | Command             | Required                                    |
| ---------- | ------------------- | ------------------------------------------- |
| TypeScript | `npm run typecheck` | 0 errors                                    |
| ESLint     | `npm run lint`      | 0 errors, 0 warnings                        |
| Build      | `npm run build`     | exits 0                                     |
| Playwright | `/playwright-cli`   | all UI scenarios pass (frontend beans only) |

The post-completion review agent runs all checks and includes full output in the review.

**No exceptions without written justification in the bean:**

- No `// @ts-ignore` or `// eslint-disable`
- No `any` type
- No `console.log` in production paths
- No dead imports or unused variables
