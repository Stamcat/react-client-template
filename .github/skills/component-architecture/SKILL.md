---
name: component-architecture
description: 'Component reuse boundaries, self-sufficiency, and internal ordering conventions for the app standards. Use when creating or reviewing any application component — deciding what it may import, whether state/handlers belong in it or a parent, or how to order hooks/state/actions/effects in its body.'
---

# App Standards Component Architecture

Applies to application components across the repo.

## Component reuse

- Prefer imports from the current application surface and shared utilities. Avoid importing from
  deprecated component trees or helper layers once the codebase accumulates any (see
  [state-management](../state-management/SKILL.md) for the one import boundary this template
  enforces today, `no-deep-redux-imports`).
- When an area of the codebase is later deprecated in favor of a new pattern, add a dedicated
  dependency-cruiser rule (e.g. `no-legacy-components`) forbidding new code from importing it, and
  document the boundary in this skill — don't rely on convention alone once there's something
  concrete to enforce against.

## Shared component imports — subpath only, never the barrel

- If the project's shared UI component library exposes per-component subpaths (e.g.
  `my-ui-lib/Button`), import from the subpath, never from the package root barrel
  (`my-ui-lib`). This is to empower tree-shaking: a barrel file re-exports every component from one
  file, and some bundlers/analyses can't prove an individual barrel export is unused, so pulling
  anything from the root risks dragging unrelated components (and their CSS) into the bundle.

```ts
// wrong
import { Button, Modal } from "my-ui-lib";

// right
import { Button } from "my-ui-lib/Button";
import { Modal } from "my-ui-lib/Modal";
```

## Shared constants placement

- `types.ts` holds only type/interface declarations and `z.infer<typeof Schema>` exports — never a
  runtime value (a constant, a lookup map, a function). If something needs a `export const` or
  `export function`, it belongs in that component's `constants.ts` or `utilities.ts`, even if it's
  typed using a union/type that itself lives in `types.ts` (import the type from `types.ts` into
  the `constants.ts`/`utilities.ts` file, not the other way around).
- A constant (or lookup map) used only within one subfolder of a component belongs in a
  `constants.ts` local to that subfolder — don't promote it to the top level just because it's
  shared by a few files.
- Only move a constant up to a `constants.ts` that's a peer of the component's
  `api.ts`/`slice.ts`/`sagas.ts`/`selectors.ts` once something *outside* that subfolder actually
  needs it. A constants file nested under one subfolder only works for consumers in or below that
  subfolder; anything else in the component tree needing it either duplicates it or has to reach
  down into an unrelated feature's folder, which risks a circular import once that subfolder's own
  modules need something from the parent level.

## `constants.ts` vs `utilities.ts`

- `constants.ts` is for simple declarations and dictionaries only — string/number literals,
  lookup maps, default config objects. Nothing in it should be a function.
- Any function — getters, setters, derivations, registries, mutable module state wrapped in
  accessors — belongs in a sibling `utilities.ts`, not `constants.ts`. If a file named
  `constants.ts` accumulates functions, split them out into `utilities.ts` rather than letting the
  two concerns share a file.

## Single source of truth for a cross-cutting config decision

- When a decision affects a shared subsystem (e.g. "which destinations does the logger write to",
  "which API base URL is active"), that decision's logic must live in exactly one place: the
  module that owns the subsystem (e.g. `src/utils/log/`), not in every caller that happens to
  trigger it.
- A caller (a saga, a component, a feature-flag handler) should forward raw input to one exported
  function on the owning module and let that function decide what to do with it — it should not
  re-implement or branch on the same condition (environment checks, feature-flag shape checks,
  etc.) that the owning module already encodes elsewhere.
- Red flag: the same condition (e.g. `import.meta.env.DEV`) checked in two different files to make
  related-but-separate decisions about the same subsystem. Consolidate both branches into one
  function in the owning module instead.

## Component self-sufficiency

- A component should read its own Redux state (`useSelector`) and dispatch its own actions
  (`useDispatch`) directly rather than receiving them as props from a parent, so it stays portable
  and can be dropped into another tree without threading props through intermediate components.
- Only lift state/handlers up to a shared parent when two or more sibling components genuinely
  need to coordinate on the same value (e.g. a tab selection that both a nav and a list must
  agree on). Don't lift state up "just in case" — default to each component fetching its own
  values and establishing its own actions.
- A parent/container component should be a thin composition shell: wire up shared side effects
  (e.g. an initial data-load dispatch) and render children, not fan out props that each child
  could fetch itself.

## Component internal ordering

Inside a functional component body, declare things in this order, grouped under a one-line
`// hooks` / `// state` / `// derived state` / `// actions` / `// side effects` comment (omit any
group that's empty):

1. **hooks** — `useDispatch`, `useNavigate`, and other non-`useSelector`/`useState` hook calls.
2. **state** — `useSelector`/`useState` reads.
3. **derived state** — values computed from state/props (filtering, formatting, memoized values).
4. **actions** — event handlers / dispatch wrappers (e.g. `onSearchChange`, `onTabChange`).
5. **side effects** — `useEffect`/`useLayoutEffect` blocks, last, since they usually depend on the
   state and actions declared above.

## Mount-effect dispatch guard

- A one-time-on-mount dispatch (e.g. an initial data load) must only fire once, including across
  React.StrictMode's dev-mode double-invoke of effects. Guard it with a `useRef` boolean checked
  and set inside the effect — don't rely solely on an empty `useEffect` dependency array.

## Date/number formatting

- Before writing a custom date/number/currency formatter, reach for the built-in `Intl` APIs
  (`Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat`) driven by the app's
  active locale. Only wrap them in a project-specific helper once more than one component needs
  the exact same formatting options, so the options stay centralized instead of duplicated inline.
- Parsing raw API data (e.g. splitting an `"HH:MM:SS"` string into hours/minutes, or
  `new Date(x).getTime()` used purely for sort comparisons) is not a localization concern and
  shouldn't be routed through a formatter.

## Enforcement

| Rule | Enforced by |
| --- | --- |

Component self-sufficiency, internal ordering, and reuse boundaries are conventions to follow but
aren't machine-enforced yet — check for them in review. As the codebase matures and a boundary
becomes worth enforcing automatically, add the rule to `eslint.config.js` and/or
`scripts/.dependency-cruiser-check.cjs` and record it here and in `AGENTS.md`.
