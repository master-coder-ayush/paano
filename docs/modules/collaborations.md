# Collaborations

Version 3 creates at most one active tracking link per collaboration; the public redirect does not expose protected workspace data.

## Version 2 Sprint 4

The workflow supports invited, accepted, draft, revision_requested, approved, published, completed, declined, and cancelled states. Brand review and creator publishing mutations require bearer authentication plus server-side ownership of the attached workspace. Every transition records actor, action, note, and timestamp in collaboration activity.

Sprint 6 adds brand-owned collaborations and creator-scoped requests. Records carry `workspace_id`, campaign, creator, brand, price, currency, due date, and lifecycle status. Brand routes require a bearer token resolving to an active brand workspace; creator routes require the attached creator workspace. Server transitions are restricted to valid lifecycle edges and duplicate active invitations are rejected. Message threads are linked by collaboration entity context.
# Sprint 3

Invitations are represented as `collaborations` in `invited` state and are visible in the creator collaboration inbox. Brand mutations require an authenticated brand workspace; creator transitions are limited to accepting or declining their own invitation. Duplicate non-cancelled invitations are rejected.
