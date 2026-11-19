---
name: loading-states
description: 'Skeleton loader conventions for the app standards — every deep-linkable route/page gets a layout-matching skeleton for its initial loading state instead of a spinner. Use when creating a new route/page component, or any component that gates its render on an initial data fetch.'
---

# App Standards Loading States

Applies to any component that owns an initial data fetch and gates its render on a `loading`
flag — most commonly route-level page components and the layout chrome around them.

## Every deep-linkable route needs a skeleton, not a spinner

- A route that can be deep-linked (reachable directly via URL, not only by client-side
  navigation) always has an initial loading state — the data isn't in the Redux store yet on
  first render. That state must render a skeleton placeholder, not a full-page/full-section
  spinner.
- Centered spinners cause cumulative layout shift once real content swaps in, increase misclick
  risk (controls shift under the pointer), and give screen reader users no structural information
  about what's loading. A skeleton avoids all three: it reserves the real layout's size up front,
  keeps interactive elements in roughly their final position, and preserves heading/landmark
  structure.
- This applies per-component: each component that independently gates on its own `loading`
  selector owns its own skeleton. Don't let a parent's loading state substitute a generic or
  unrelated skeleton for a child's content — if sibling routed components each have their own
  loading flag and skeleton, a shared parent must let each child render itself (e.g. via
  `<Outlet />`) rather than guessing which child is active and showing that one's skeleton for
  every route.

## Building a skeleton component

- Co-locate `<ComponentName>Skeleton.tsx` next to the real component and import its
  `.module.scss` so classnames — and therefore computed sizes/spacing — match exactly. The
  skeleton is a structural mirror of the real component, not a new layout.
- Keep every piece of markup that doesn't depend on the fetch (static headings, labels, nav,
  buttons with no data dependency) real — only replace values that come from the fetched data with
  a skeleton placeholder (from the shared UI component library if it has one, or a small
  dedicated `Skeleton` component otherwise).
- Match the placeholder's shape to the real element's shape (circular for avatars/icons,
  rectangular for everything else). If a variant's default border-radius doesn't match the real
  element (e.g. a heading that should have square corners), override it explicitly rather than
  picking a variant that happens to look right only by coincidence.
- For a list/repeated-row layout with a variable real count (table rows, category cards), pick a
  fixed placeholder count as a local constant (e.g. `SKELETON_ROW_COUNT`) — don't try to predict
  the real count.
- Set `aria-busy="true"` on the skeleton's root element.
