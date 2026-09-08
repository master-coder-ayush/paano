# Workspaces Module

## Version 1 Sprint 1

### Routes

- `/dashboard`: protected workspace selector shell for demo identities.
- `/brand`: protected brand workspace shell.
- `/creator`: protected creator workspace shell.
- `/agency`: protected agency placeholder shell.
- `/admin`: protected admin workspace shell.
- `/api/workspaces`: protected route handler for workspace reads and validated create contract.

### Shell Behavior

- Workspace shells share `components/workspace-shell.tsx`.
- Sidebar navigation is generated from the active workspace type and translated through `messages/en.json`.
- Desktop sidebar behavior is collapsed-by-default with icons visible and labels revealed on hover.
- Sidebar styling is intentionally light and neutral, using the `--sidebar` theme token instead of a dark primary background.

### Data Entities

- `workspaces`: type, name, status, owner.
- `workspace_members`: role and membership status.
- `workspace_invites`: email invite with hashed invite token, role, status, and expiry.

### Permissions

- Brand workspace routes allow only active `brand` workspaces.
- Creator workspace routes allow only active `creator` workspaces.
- Agency workspace routes allow active `brand_agency` or `creator_agency` workspaces.
- Admin workspace routes allow only active `admin` workspaces.
- Allowed roles are checked server-side in `authorizeWorkspace`.

### API Contract

`GET /api/workspaces`

- Requires `Authorization: Bearer <token>`.
- Returns only the authenticated user's workspaces.
- Missing or invalid token returns `401`.

`POST /api/workspaces`

- Requires `Authorization: Bearer <token>`.
- Validates a non-empty name and a workspace type matching the active role.
- Missing token returns `401`; role/workspace mismatch returns `403`; validation errors return `422`.
- Current Sprint 1 response is a validated persistence placeholder until create flows are implemented against the database.

### State Transitions

Workspace status reserves `active`, `suspended`, and `archived`. Sprint 1 exposes only active demo workspaces.

### Edge Cases

- No user: `unauthenticated`.
- Authenticated user without a workspace of the requested type: `workspace_missing`.
- Inactive workspace: `unauthorized`.
- Unsupported role: `role_missing`.
