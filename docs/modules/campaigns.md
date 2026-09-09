# Campaigns

Version 3 tracking links resolve campaign and space context through workspace-scoped records. Brand inspection requires bearer authentication.

Campaigns belong to both a workspace and a space. V1 status values are `draft`, `active`, and `completed`. The protected list supports status filtering; create/update rejects missing names and spaces outside the active workspace.
# Campaigns

Campaigns are workspace- and brand-owned records. Brand owners/admins may read and mutate campaigns only after bearer-token authentication and workspace authorization. Campaign states are draft, active, completed, or cancelled; invalid state changes must be rejected server-side.

Version 2 adds `/brand/campaigns/[campaignId]` and the protected brief endpoints under `/api/brand/campaigns/[campaignId]/brief`. Campaign detail shows ownership, status, space, goal, and the next brief action. Missing records return a not-found state without leaking other workspaces.

## Test notes

Verify missing/invalid bearer tokens return 403, cross-workspace campaign IDs return 404, and brief validation rejects missing required fields.
# Sprint 3

Campaign detail includes the workspace-scoped shortlist and comparison surface. Campaign ownership is checked before shortlist reads or mutations; invalid campaign IDs return forbidden/not found behavior without leaking another workspace's records.
# Sprint 5 reporting integration

Campaigns expose workspace-scoped results through `/brand/results`. Campaign filters are server-rendered and the first available campaign is used by the UI when no filter is supplied. Brand access requires a bearer token resolving to the brand workspace; creator and unrelated workspace records are forbidden.
