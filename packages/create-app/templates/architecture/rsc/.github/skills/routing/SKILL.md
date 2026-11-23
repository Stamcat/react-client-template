---
name: routing
description: 'Next.js App Router routing conventions for the app standards — prefer routes over query strings for distinct views. Use when adding a new page/view anywhere in the repo, or deciding between a route and a query param.'
---

# App Standards Routing

Applies to application code across the repo.

- Routing is file-based via the App Router: a new route is a folder with a `page.tsx` under
  `src/app/**` (`src/app/contacts/[id]/page.tsx`, `src/app/contacts/all/page.tsx`), not a
  client-side router configuration. Prefer adding a route folder over a query string for
  representing a distinct page or view. If a view has its own identity — something a user could
  bookmark, share, or navigate back to as a separate screen — it should be a route (e.g.
  `/contacts/[id]`, `/contacts/all`), not a `?param=` on an existing route.
- Query strings are the exception, not the norm. Reserve them for transient, non-navigational
  state layered on top of a view — e.g. `?page=2` for pagination or `?sort=name` for a table's
  sort order on an already-routed page. Read them via `useSearchParams()` from `next/navigation` in
  a client component.
- Navigate declaratively with `<Link href="...">` from `next/link` for anything a user clicks, and
  programmatically with `useRouter().push(...)` from `next/navigation` (not `next/router`) only
  when navigation has to happen as a side effect (e.g. after a form submits) — this requires a
  `"use client"` boundary.
- Example: viewing the full contacts list is its own page, so it must be a route
  (`src/app/contacts/all/page.tsx`), not `/contacts?tab=all`.

Not machine-enforced — check for this in review.
