# Brand workspace

Sprint 4 adds protected overview, spaces, and campaigns routes. Brand records are scoped to the active `workspace_id`; brand owners/admins are allowed server-side. Demo mutations require `Authorization: Bearer <token>` and emit validation failures without partial writes.
## Sprint 6

Brand collaboration and message routes are `/brand/collaborations`, `/brand/collaborations/[id]`, and `/brand/messages`. Brand users can create and manage only records with their workspace ID; collaboration status changes are validated server-side.

## Version 2 Sprint 1

`/brand` derives wallet balance from the manual wallet ledger and operational queues from workspace-owned collaborations. Brand owners/admins may view these cards and deep links only for their active workspace; empty queues render explicit empty states.
# Brand workspace

Brand campaign and brief surfaces are protected by the existing authenticated demo bearer contract (`Authorization: Bearer <token>`). Server-side workspace membership and brand role checks are the authorization boundary; creator, agency, and admin users cannot use these brand mutations.

Campaigns and campaign briefs resolve through `workspace_id`; UI query parameters are demo navigation only and are not trusted for API authorization.
