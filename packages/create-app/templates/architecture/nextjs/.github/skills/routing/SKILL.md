---
name: routing
description: 'Next.js Pages Router routing conventions for the app standards — prefer routes over query strings for distinct views. Use when adding a new page/view anywhere in the repo, or deciding between a route and a query param.'
---

# App Standards Routing

Applies to application code across the repo.

- Routing is file-based via the Pages Router: a new route is a file under `src/pages/**`
  (`src/pages/contacts/[id].tsx`, `src/pages/contacts/all.tsx`), not a client-side router
  configuration. Prefer adding a route file over a query string for representing a distinct page
  or view. If a view has its own identity — something a user could bookmark, share, or navigate
  back to as a separate screen — it should be a route (e.g. `/contacts/[id]`, `/contacts/all`), not
  a `?param=` on an existing route.
- Query strings are the exception, not the norm. Reserve them for transient, non-navigational
  state layered on top of a view — e.g. `?page=2` for pagination or `?sort=name` for a table's
  sort order on an already-routed page. Read them via `useRouter().query` from `next/router`.
- Navigate declaratively with `<Link href="...">` from `next/link` for anything a user clicks, and
  programmatically with `useRouter().push(...)` from `next/router` only when navigation has to
  happen as a side effect (e.g. after a form submits).
- Example: viewing the full contacts list is its own page, so it must be a route
  (`src/pages/contacts/all.tsx`), not `/contacts?tab=all`.

Not machine-enforced — check for this in review.
