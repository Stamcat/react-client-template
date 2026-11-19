---
name: playwright-testing
description: 'Playwright end-to-end testing conventions for the app standards — one happy-path spec per new feature/route, page-object-free locator style, when a feature needs e2e coverage at all. Use when adding a new route/page, a new user-facing flow, or any component reachable via a dedicated URL.'
---

# App Standards Playwright Testing

Applies to `e2e/**` across the repo. Specs run with `npm run test:e2e` (headless) or
`npm run test:e2e:ui` (interactive), configured in `playwright.config.ts`. The config starts the
Vite dev server for you — don't start it manually before running the suite.

## Every new feature gets one happy-path spec

- A "feature" here means anything reachable via its own route, or a user-facing flow spanning
  multiple steps (a form submission, a multi-screen wizard) — not every component. A new button
  inside an existing, already-covered page doesn't need its own spec unless it starts a new flow.
- The spec covers the primary happy path only: the sequence of user actions that make the feature
  worth having, asserted via visible, user-observable outcomes (text, roles, navigation) — not
  every edge case or error state. Edge cases and error handling belong in unit tests
  (see [unit-testing](../unit-testing/SKILL.md)), which are cheaper to write and run.
- Name the spec file after the route/feature, not the component (`e2e/client-profile.spec.ts`,
  not `e2e/ClientProfileCard.spec.ts`), and co-locate all specs flat under `e2e/` rather than
  mirroring `src/`'s folder structure — e2e specs test user flows, not the component tree.

## Locators

- Query by role and accessible name (`page.getByRole("button", { name: "Save" })`) or by label
  (`page.getByLabel("Email")`) — the same queries a screen reader or keyboard user would resolve.
  This is a direct extension of the [accessibility](../accessibility/SKILL.md) skill: if a locator
  can only be written with a `data-testid`, that's usually a sign the markup is missing a
  role/label an assistive technology would also need.
- Reach for `page.getByTestId(...)` only when no role/label/text query can uniquely identify the
  element (e.g. a decorative element with no accessible name) — not as a default habit.

## What not to do

- Don't assert on CSS classes, DOM structure, or implementation details a refactor could change
  without changing user-visible behavior.
- Don't add a `waitForTimeout`; use Playwright's built-in auto-waiting assertions (`expect(locator)
  .toBeVisible()`, etc.) instead — a fixed timeout is both slower and flakier than condition-based
  waiting.
