# Brand workspace

Sprint 4 adds protected overview, spaces, and campaigns routes. Brand records are scoped to the active `workspace_id`; brand owners/admins are allowed server-side. Demo mutations require `Authorization: Bearer <token>` and emit validation failures without partial writes.
## Sprint 6

Brand collaboration and message routes are `/brand/collaborations`, `/brand/collaborations/[id]`, and `/brand/messages`. Brand users can create and manage only records with their workspace ID; collaboration status changes are validated server-side.
