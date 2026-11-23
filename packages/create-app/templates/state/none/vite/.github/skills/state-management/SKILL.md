---
name: state-management
description: 'No-Redux state-management conventions for the app standards — component-local state and Context by default, colocated with the component that owns it. Use when adding or reviewing state management anywhere in the repo.'
---

# App Standards State Management

Applies to application code across the repo.

## No Redux by default

- This project has no Redux store — `@reduxjs/toolkit`, `react-redux`, and `redux-saga` are not
  installed. Don't introduce `createSlice`, `useSelector`, `useDispatch`, or a `sagas.ts`/
  `slice.ts` pair unprompted; that's a signal the project has drifted from its chosen state
  approach, not a pattern to follow.
- Default to component-local state (`useState`) for anything only one component (and its direct
  children, via props) needs. Each component fetches its own data (e.g. in a `useEffect` or a
  small colocated custom hook) and owns its own `loading`/`error` state.
- Reach for the Context API (`createContext`/`useContext`) only for genuinely cross-cutting
  concerns shared by many unrelated components (theme, authenticated user, feature flags) — not as
  a substitute for prop-drilling in an otherwise-local feature, and not for ordinary data fetching.
- If a developer explicitly opts into Redux (or another state library) for an area, keep following
  that choice for new work in that area, install the relevant package(s), and update this skill to
  describe the adopted pattern instead of leaving it describing a library that isn't installed.

## Enforcement

No Redux by default, and Context as the only sanctioned escape hatch for cross-cutting state,
aren't machine-enforced — check for them in review.
