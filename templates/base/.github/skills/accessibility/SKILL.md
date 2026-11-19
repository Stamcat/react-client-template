---
name: accessibility
description: 'Accessibility (a11y) conventions for the app standards — semantic structure, keyboard/focus support, ARIA usage, color contrast. Use when creating or reviewing any application component, page, or piece of markup anywhere in the repo.'
---

# App Standards Accessibility

Applies to application code across the repo.

## Semantic structure first

- Reach for semantic HTML5 elements (`main`, `nav`, `header`, `footer`, `section`, `article`,
  `aside`, `h1`-`h6`, `button`, `a`, `label`, `ul`/`li`, `table`) before adding ARIA roles — see
  [component-architecture](../component-architecture/SKILL.md) and [styling](../styling/SKILL.md)
  for the related "don't add a class/wrapper you don't need" conventions. ARIA should supplement
  semantic HTML, not replace it.
- Every page/view needs exactly one `h1`; nested sections use a logical, non-skipping heading
  order (`h2` inside `h1`, `h3` inside `h2`, ...) rather than choosing a heading level for its
  visual size.
- Use a native `<button>` for anything clickable that performs an action, and a native
  `<a href>`/router `Link` for anything that navigates. Don't attach `onClick` to a `div`/`span`.

## Forms and interactive elements

- Every form control has a programmatically associated `<label>` (via `htmlFor`/`id`, or by
  wrapping the control) — placeholder text is never a substitute for a label.
- Icon-only buttons/links need an accessible name: visually-hidden text, `aria-label`, or
  `aria-labelledby`. A bare icon with no text alternative is not acceptable.
- Custom interactive widgets (anything not a native form control) must be reachable and operable
  by keyboard alone (`Tab`/`Shift+Tab` to reach it, `Enter`/`Space` to activate it, arrow keys for
  composite widgets like tabs/menus) and expose the relevant ARIA role/state (`aria-expanded`,
  `aria-selected`, `aria-current`, etc.). Prefer the project's shared UI component library over
  hand-rolling one of these — see
  [styling](../styling/SKILL.md#prefer-a-shared-ui-component-library).
- Preserve a visible focus indicator; never suppress it with `outline: none` without supplying an
  equivalent focus style.

## Dynamic content and feedback

- Content that updates without a page navigation and needs to be noticed (errors, toasts, async
  status messages) uses `aria-live` (`polite` for status updates, `assertive` only for urgent
  errors) or a native mechanism (`role="alert"`/`role="status"`) rather than relying on visual
  change alone.
- Images convey their meaning via `alt` text; purely decorative images use `alt=""` so screen
  readers skip them.

## Color and contrast

- Don't convey meaning (errors, required fields, status) through color alone — pair it with text,
  an icon with an accessible name, or both.
- New text/background color pairs should meet WCAG AA contrast (4.5:1 for normal text, 3:1 for
  large text/UI components). Prefer existing shared color variables, which are already vetted for
  contrast, over introducing new literal colors.

## Enforcement

These conventions aren't machine-enforced by ESLint/dependency-cruiser today — check for them in
review, the same as the responsive-design conventions in
[styling](../styling/SKILL.md#enforcement).
