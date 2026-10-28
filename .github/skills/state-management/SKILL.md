---
name: state-management
description: 'Redux Toolkit + redux-saga conventions for the app standards — Redux by default, Context/thunks/composition/state-managed hooks opt-in only, colocated slice.ts/sagas.ts, wiring into src/redux/index.ts. Use when adding or reviewing state management anywhere in the repo.'
---

# App Standards State Management

Applies to application code across the repo.

## Redux + redux-saga by default

- Application code uses **Redux + redux-saga** by default.
- Neither the Context API (`useContext`/`createContext`) nor thunks (`createAsyncThunk`,
  `redux-thunk`) — nor other patterns like component composition or state-managed custom hooks —
  are used out of the box, and none is encouraged: don't introduce any of them unprompted. All
  remain available if a developer explicitly decides to use that pattern for a given area.
- Once a developer has explicitly opted into one of these alternatives for an area, keep following
  that choice for new work in that area — don't revert it back to Redux unprompted just because
  Redux is the default.

## Redux structure

- Colocate a component's `slice.ts` and `sagas.ts` (plus `selectors.ts`/`types.ts` as needed)
  inside the top-level component folder that owns that state.
- Wire the reducer and sagas into `src/redux/index.ts`. Never import from a subfolder of
  `src/redux` (e.g. `@/redux/feature/*`) — only `@/redux` (`src/redux/index.ts`) is a valid import
  path from application code. Enforced by dependency-cruiser's `no-deep-redux-imports`.

## `distillers.ts` vs `selectors.ts`

- `distillers.ts` (optional) holds **simple selectors only** — plain state reads (e.g. `(state) =>
  state.feature.items`). No data manipulation (sorting, filtering, formatting, derivation) and no
  memoization of any kind.
- `selectors.ts` is where data manipulation for a UI component lives — sorting, filtering,
  formatting, or otherwise reshaping redux values before a component consumes them. These
  generally (not a hard rule) use `createSelector` for memoization.
- Fallback/default values (empty strings, `0`, derived display strings) belong in a `selectors.ts`
  selector, not in the component. If a component is doing `profile?.field ?? ""` or similar
  null/nullish coalescing to make a value presentable, write or extend a selector that returns the
  already-defaulted shape instead. The goal is a presentation layer that destructures plain values
  with no coalescing or conditional fallback logic of its own.
- Treat a multi-branch ternary chain or any "derived state" block spanning more than a couple of
  lines in a component as a signal to move it into a memoized `selectors.ts` selector (via
  `createSelector`), reading from `distillers.ts` for the raw state. The component should call
  `useSelector(getSomething)` and destructure the result, not compute it inline.

## `slice.ts` action naming: present tense vs past tense

- An action a saga `takeLatest`s to kick off a side effect (e.g. an API call) is named in the
  **present/imperative tense**: `loadClientProfile`, `loadClientScores`. It represents a request to
  do something, not a fact about what already happened.
- An action that merely records a state change — including ones a saga dispatches once its side
  effect settles — is named in the **past tense**: `clientProfileLoaded`, `clientProfileLoadFailed`.
  It represents something that already occurred.

## Enforcement

Redux + redux-saga as the default, and treating Context/thunks/composition/state-managed hooks as
opt-in rather than banned, aren't machine-enforced — check for them in review.

| Rule | Enforced by |
| --- | --- |
| No deep `src/redux/<folder>` imports | dependency-cruiser `no-deep-redux-imports` |
