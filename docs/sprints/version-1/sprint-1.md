# Version 1 Sprint 1: Architecture, Data Model, and Workspace Foundation

## Version Context

Version 1: Foundation and Manual Marketplace

Version goal: Prove the marketplace can represent brands, creators, spaces, campaigns, and manual collaborations without third-party integrations.

Sprint goal: Define the app shell, shared layout boundaries, workspace types, and initial data model.

## Prerequisites Already Achieved

- Repository scaffold exists; product roadmap exists at docs/features.md; no previous sprint is required.
- Developers must read docs/features.md before starting this sprint.
- Developers must read docs/data-model.md before making schema, migration, persistence, or reporting changes.
- Developers must review earlier sprint files in docs/sprints/version-1 when this is not the first sprint in the version.

## Expected Behavior

- Define the app shell, shared layout boundaries, workspace types, and initial data model.
- Create first-party entities for users, workspaces, brands, creators, spaces, campaigns, collaborations, messages, wallet ledger placeholders, and admin review state.
- Implement role-safe routing so brand, creator, and admin users only see their own workspace area.

## Detailed Work Breakdown

- Review the existing implementation for every affected module before changing behavior.
- Identify existing routes, server actions, route handlers, components, schema tables, seeds, and tests that overlap with this sprint.
- Implement the sprint as an end-to-end workflow, including create/read/update paths where the expected behavior implies them.
- Add deterministic validation rules for required fields, invalid states, duplicate records, and unauthorized access.
- Add operational empty states and failure states so the sprint is demoable with no data, partial data, and realistic seeded data.


## Database and Data Model Changes

- Database changes required: Yes. This sprint introduces or changes persisted product data.
- Define ID strategy, timestamp conventions, soft-delete policy, workspace ownership columns, and migration naming conventions.
- Create or update Drizzle schema tables, indexes, foreign keys, enums, and migration files for this sprint.
- Document every new enum value and every cross-table ownership rule.
- Create or update workspaces, workspace_members, workspace_roles, and workspace_invites as needed.
- Every workspace-owned table must include workspace_id or a documented parent relationship to workspace_id.
- Create role/permission records or enum fields for owner, admin, member, viewer, creator, agency_manager, and platform_admin as applicable.
- Persist admin actions in audit_logs where the sprint changes sensitive state.
- Admin-managed queues should have status, assignee_id, notes, created_at, and updated_at fields.
- For every database change, update Drizzle schema definitions, generate a migration, document the migration purpose, and add seed/test data where the sprint needs demo records.
- Any new table must include created_at and updated_at unless there is a documented reason not to.
- Any user- or workspace-owned table must include either workspace_id directly or a documented parent relationship that enforces workspace isolation.
- Add indexes for foreign keys, lookup slugs/tokens, status filters, and dashboard/reporting queries introduced by this sprint.
- If a sprint stores JSON metadata, document the expected JSON shape and which fields are query-critical enough to become real columns later.

## Routes and UI Surfaces

- Application shell routes for public, brand, creator, agency, and admin areas.
- No direct UI requirement unless paired with a workspace or admin module.
- /dashboard or equivalent workspace selector.
- /brand, /creator, /agency, and /admin protected app areas as applicable.
- Permission checks must exist in server actions, route handlers, and page loaders.
- /admin, /admin/review, /admin/support, and feature-specific admin detail routes.
- All new routes must have clear loading, empty, error, and permission-denied states.
- Navigation entries should appear only for roles that can use the feature.
- Detail pages must show enough context for a developer, tester, or manager to understand the current record, status, owner, and next action.

## State Transitions and Business Rules

- Workspace type determines the active navigation and allowed route group.
- Migrations must be forward-only and must not assume production data can be wiped.
- active, suspended, archived workspace states should be reserved even if only active is exposed initially.
- unauthenticated, unauthorized, workspace_missing, role_missing, allowed.
- new, in_review, approved, rejected, needs_changes, archived for reviewable records.
- State transitions must be validated on the server.
- Invalid transitions should return clear errors and must not partially update related records.
- If multiple records change together, document whether the operation must be transactional.
- Every sensitive state change should produce an audit or activity entry once the relevant audit/activity module exists.

## Authentication, Header Token, and RBAC Requirements

- All protected pages, server actions, route handlers, and APIs introduced or changed in this sprint must resolve the authenticated user before reading or mutating data.
- Protected API and mutation endpoints must require an authentication header token, using an `Authorization: Bearer <token>` style contract unless the affected module doc defines a stricter token standard.
- RBAC must be enforced server-side using workspace membership, workspace role, entity ownership, and module-specific permissions.
- UI-level hiding is not sufficient; direct requests from unauthorized users must fail with a clear unauthorized or forbidden response.
- Public routes or endpoints introduced in this sprint must be explicitly documented as public and must never return protected workspace, creator, agency, billing, attribution, or admin data.
- If this sprint changes the data model, the affected module docs must specify ownership fields, token/auth expectations, permission checks, and audit/activity requirements for every new or changed entity.

## Affected Modules

- architecture
- database
- workspaces
- permissions
- admin

## Module Documentation Requirement

For every affected module listed below, developers must make sure module documentation exists in docs/modules. If the specific module markdown already exists, read it before implementation and update the section for this sprint. If it is missing, create it before or during the sprint. Module docs should capture routes, data entities, service contracts, permissions, state transitions, edge cases, and test notes introduced by this sprint.

Expected module documentation files for this sprint: docs/modules/architecture.md, docs/modules/database.md, docs/modules/workspaces.md, docs/modules/permissions.md, docs/modules/admin.md.

## Implementation Scope

- Build only the behavior listed in this sprint unless a missing prerequisite blocks completion.
- Preserve completed behavior from previous versions and sprints.
- Use first-party application code and database records unless this sprint explicitly names a third-party integration.
- Add clear empty, loading, error, and permission-denied states for all new user-facing surfaces.
- Ensure role boundaries are enforced server-side, not only in the UI.

## Acceptance Criteria

- Authentication header token and RBAC requirements are documented and tested for every protected route, action, API, and data mutation changed by this sprint.

- A developer can create seed records for brand, creator, and admin workspaces.
- Navigation reflects the active workspace type.
- Database relationships enforce workspace ownership and avoid cross-workspace reads.
- Empty states are present for every shell page added in this sprint.

## Data and Permissions

- All records created in this sprint must be scoped to the correct workspace or public route.
- Any new authentication token, API key, session token, provider token, or webhook secret must be hashed or encrypted as appropriate and must never be stored in plain text.
- Brand users must not access unrelated brand, creator, agency, or admin data.
- Creator users must not access sensitive brand/customer data unless explicitly allowed by the sprint behavior.
- Admin/Ops access must be auditable where sensitive state changes are introduced.

## Tester Checklist

- Verify the happy path described by the sprint goal.
- Verify validation errors for missing, invalid, duplicate, and unauthorized inputs.
- Verify mobile and desktop usability for user-facing pages.
- Verify permissions with brand, creator, agency where applicable, and admin accounts.
- Verify protected endpoints reject missing, invalid, expired, or unauthorized bearer tokens.
- Verify that newly affected module docs exist or were updated in docs/modules.

## Manager Handoff Notes

- Demo should show the sprint goal using realistic brand, creator, campaign, and collaboration data.
- Release notes should call out any new workflow state, permission change, or operational dependency.
- If a feature is intentionally manual in this sprint, mark the future automation or integration version from docs/features.md.

## Out of Scope

- Do not introduce features from later sprints unless required to make this sprint testable.
- Do not introduce third-party integrations unless this sprint explicitly lists them.
- Do not remove or bypass earlier acceptance criteria.
