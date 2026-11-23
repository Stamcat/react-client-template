---
name: state-management
description: 'Redux Toolkit (createAsyncThunk) conventions for the app standards — Redux by default, no redux-saga, colocated slice.ts, wiring into src/utils/store.ts. Use when adding or reviewing state management anywhere in the repo.'
---

# App Standards State Management

Applies to application code across the repo.

## Redux Toolkit by default (no redux-saga)

- Application code uses **Redux Toolkit with `createAsyncThunk`** by default — `redux-saga` is not
  installed, so don't add a `sagas.ts` file or `takeLatest`/generator-based effects.
- Neither the Context API (`useContext`/`createContext`) nor other patterns like component
  composition or state-managed custom hooks are used out of the box, and none is encouraged: don't
  introduce any of them unprompted. All remain available if a developer explicitly decides to use
  that pattern for a given area.
- Once a developer has explicitly opted into one of these alternatives for an area, keep following
  that choice for new work in that area — don't revert it back to Redux unprompted just because
  Redux is the default.

## Redux structure

- Colocate a component's `slice.ts` (plus `selectors.ts`/`types.ts` as needed) inside the
  top-level component folder that owns that state. An async side effect is a `createAsyncThunk`
  defined in that same `slice.ts`, registered via `extraReducers` — there is no separate file for
  the side-effect itself the way a saga-based project would have `sagas.ts`.
- Wire the reducer into `src/utils/store.ts` — the store is constructed directly in that file, with
  no separate `src/redux/index.ts` barrel. A barrel file here would exist only to re-export
  `store`/`RootState`/`AppDispatch` from the module that already defines them, which adds an
  import hop without adding meaning (see [component-architecture](../component-architecture/SKILL.md)
  for the general barrel-export guidance).

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

## `slice.ts` action naming: let `createAsyncThunk` generate the lifecycle actions

- Name the thunk itself in the **present/imperative tense** — `loadClientProfile`,
  `loadClientScores`. It represents a request to do something, not a fact about what already
  happened.
- Don't hand-write separate "started"/"succeeded"/"failed" actions for an async flow.
  `createAsyncThunk("feature/loadClientProfile", ...)` automatically dispatches
  `loadClientProfile/pending`, `loadClientProfile/fulfilled`, and `loadClientProfile/rejected` —
  handle those three in the slice's `extraReducers`, rather than modeling the past-tense
  "`clientProfileLoaded`"-style actions a saga-based project would dispatch manually.

## Enforcement

Redux Toolkit as the default, and treating Context/composition/state-managed hooks as opt-in
rather than banned, aren't machine-enforced — check for them in review.
