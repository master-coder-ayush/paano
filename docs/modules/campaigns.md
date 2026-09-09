# Campaigns

Campaigns belong to both a workspace and a space. V1 status values are `draft`, `active`, and `completed`. The protected list supports status filtering; create/update rejects missing names and spaces outside the active workspace.
# Campaigns

Campaigns are workspace- and brand-owned records. Brand owners/admins may read and mutate campaigns only after bearer-token authentication and workspace authorization. Campaign states are draft, active, completed, or cancelled; invalid state changes must be rejected server-side.

Version 2 adds `/brand/campaigns/[campaignId]` and the protected brief endpoints under `/api/brand/campaigns/[campaignId]/brief`. Campaign detail shows ownership, status, space, goal, and the next brief action. Missing records return a not-found state without leaking other workspaces.

## Test notes

Verify missing/invalid bearer tokens return 403, cross-workspace campaign IDs return 404, and brief validation rejects missing required fields.
