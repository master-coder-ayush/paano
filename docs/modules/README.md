# Module Documentation

Sprint files in `docs/sprints` list affected modules for each planned work slice.

For each affected module:

- If `docs/modules/<module>.md` exists, read it before starting implementation and update it during the sprint.
- If it does not exist, create it before or during the sprint.
- Document routes, data entities, service contracts, permissions, state transitions, edge cases, test notes, and operational concerns.
- Document whether each route/API is public or protected.
- For protected route handlers, server actions, and APIs, document the required authentication header token contract and role-based access checks.
- For public endpoints, document why they are public, allowed inputs, rate-limit expectations, and what protected data they must never expose.

Module docs are intended to become the durable technical reference for developers, testers, and managers as the product evolves.
