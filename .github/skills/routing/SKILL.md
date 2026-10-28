---
name: routing
description: 'React Router routing conventions for the app standards — prefer routes over query strings for distinct views. Use when adding a new page/view anywhere in the repo, or deciding between a route and a query param.'
---

# App Standards Routing

Applies to application code across the repo.

- Prefer React Router (`react-router-dom`) routes over query strings for representing a distinct
  page or view. If a view has its own identity — something a user could bookmark, share, or
  navigate back to as a separate screen — it should be a route (e.g. `/contacts/:id`,
  `/contacts/all`), not a `?param=` on an existing route.
- Query strings are the exception, not the norm. Reserve them for transient, non-navigational
  state layered on top of a view — e.g. `?page=2` for pagination or `?sort=name` for a table's
  sort order on an already-routed page.
- Example: viewing the full contacts list is its own page, so it must be a route (e.g.
  `/contacts/all`), not `/contacts?tab=all`.

Not machine-enforced — check for this in review.
