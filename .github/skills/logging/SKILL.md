---
name: logging
description: 'Logging conventions for the app standards — error logs in every catch block, debug logs for saga API responses, warn vs error level selection. Use when writing or reviewing a try/catch, a redux-saga, or any Zod `.parse`/`.safeParse` call anywhere in the repo.'
---

# App Standards Logging

Applies to application code across the repo. Use the shared `log` import from `src/utils/log` —
never `console.*` directly in application code.

## Every catch block logs

- Every `catch` block must call `log.error` with a short description of what failed and the
  caught error. A catch block that only dispatches a failure action or silently swallows the
  error, with no `log.error` call, is missing required logging.
- This applies regardless of whether the catch block also reports the error elsewhere (e.g. an
  error-tracking call) — the log call and the error-tracking call are not substitutes for each
  other.
- Inside a saga's `catch` block, the message must name the generator function it's in (e.g.
  `log.error("[loadClientProfile] Failed to load client profile", e)`), not just the operation —
  so a log line alone identifies which saga failed without needing a stack trace.

## Level selection

- `log.error` is for failures that break the current operation: a caught exception, an API call
  that failed, a failed Zod `.parse`/`.safeParse` (including a `safeParse` result whose `success`
  is `false`) — anything the user-facing flow depended on and didn't get.
- `log.warn` is for degraded-but-recoverable situations: a feature flag that couldn't be read, or
  any other case where the app continues with a sensible fallback instead of failing the
  operation.
- `log.debug`/`log.info` are for expected, non-error observability — see the saga API-response
  rule below.

## Redux sagas log API responses

- A saga that calls an API function with `call(...)` logs the resolved value at `log.debug`
  before acting on it, so the data driving the dispatch is observable without reproducing the
  request. Log after the `call` resolves and before the result is dispatched, e.g.:

  ```ts
  const clients: Client[] = yield call(fetchClients);
  log.debug("[loadClients] fetchClients response", { clients });
  yield put(actions.clientsLoaded(clients));
  ```

- Log the **post-Zod-parsed object**, not the raw network payload — raw request/response bodies
  are already inspectable via the browser's network tab, so logging them again is redundant. When
  the `api.ts` function itself returns the parsed value (the common case), the value the saga
  receives from `call(...)` is already correct to log as-is. Only when a saga does its own
  `.parse()`/`.safeParse()` after the `call` does the debug log need to move to *after* that parse
  step, logging the parsed result instead of the raw `call(...)` return value.
- The debug message is prefixed with the saga's own generator function name (`loadClients` above),
  not the component/feature folder name, so responses from different sagas in the same file are
  distinguishable in log output.
- This is in addition to, not instead of, the `log.error` call required in that saga's `catch`
  block.

## Log destinations

- Centralize which destinations a given log level writes to (console, a remote logging service,
  etc.) in one owning module (e.g. `src/utils/log/constants.ts` + a `setLogDestinations` function)
  rather than letting individual callers decide where their own logs go.
- Console logging should always happen regardless of destinations config — destinations only
  control which levels *additionally* get sent elsewhere.

Not machine-enforced — check for this in review.
