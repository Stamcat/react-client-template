---
name: unit-testing
description: 'Jest unit-testing conventions for the app standards — what makes a test meaningful vs. superficial, required coverage for new code, and when (rarely) to reach for snapshot testing. Use when adding or reviewing any new module, hook, saga, reducer, or component alongside its tests.'
---

# App Standards Unit Testing

Applies to `src/**/__tests__/**` and `*.test.ts(x)` files across the repo, run via `npm run test`
(Jest + `ts-jest` + `jsdom`, configured in `jest.config.cjs`).

## All new code needs a meaningful test

- Every new module (component, hook, saga, reducer, selector, utility) is accompanied by a test
  file in the same change, not a follow-up. This applies to modified code too: a behavior change
  to existing, untested code needs a test added for the behavior being changed.
- A meaningful test asserts on observable behavior — a function's return value for a given input,
  a component's rendered output/interaction result, a saga's dispatched actions — not on
  implementation details (internal call counts, private helper invocations) that a refactor could
  break without changing what the code actually does.
- A test that only renders a component and asserts it "doesn't throw", with no further assertion,
  is not meaningful — it catches crashes but nothing else. At minimum, assert the rendered output
  a user would see, or the result of interacting with it.
- Cover the failure/edge paths a unit test is cheap to exercise (an empty list, a failed
  `safeParse`, a saga's `catch` block) rather than pushing them onto Playwright coverage — e2e
  specs are for happy-path user flows (see [playwright-testing](../playwright-testing/SKILL.md)),
  not for enumerating edge cases.

## Snapshot testing — narrow, deliberate use only

- Reach for `toMatchSnapshot()` only for output that's genuinely large/structural and expected to
  stay stable (e.g. a Zod-parsed object shape, a generated config object) — never as a default way
  to test a component's render output.
- Don't snapshot a React component's rendered markup as a substitute for real assertions: a
  snapshot diff doesn't tell a reviewer *what* behavior changed, and snapshots get rubber-stamp
  updated (`--ci=false -u`) without being read. Assert specific text/roles/props instead.
- If a snapshot is used, keep it small and commit it reviewed — a snapshot file a reviewer can't
  reasonably read in a PR diff is too large to be useful.
