# Version 2 Sprint 4: Draft, Review, Revision, and Publish Workflow

## Version Context

Version 2: Complete Self-Serve Workflow

Version goal: Make the brand-to-creator collaboration loop complete with manual operations and no external integrations.

Sprint goal: Complete the content workflow from accepted collaboration to published post.

## Prerequisites Already Achieved

- Version 2 Sprint 3 has completed and affected module docs have been updated.
- Developers must read docs/features.md before starting this sprint.
- Developers must read docs/data-model.md before making schema, migration, persistence, or reporting changes.
- Developers must review earlier sprint files in docs/sprints/version-2 when this is not the first sprint in the version.

## Expected Behavior

- Complete the content workflow from accepted collaboration to published post.
- Support revision loops without payment automation.

## Detailed Work Breakdown

- Review the existing implementation for every affected module before changing behavior.
- Identify existing routes, server actions, route handlers, components, schema tables, seeds, and tests that overlap with this sprint.
- Implement the sprint as an end-to-end workflow, including create/read/update paths where the expected behavior implies them.
- Add deterministic validation rules for required fields, invalid states, duplicate records, and unauthorized access.
- Add operational empty states and failure states so the sprint is demoable with no data, partial data, and realistic seeded data.


## Database and Data Model Changes

- Database changes required: Yes. This sprint introduces or changes persisted product data.
- Create collaborations with workspace_id, campaign_id, creator_id, brand_id, price_amount, currency, status, due_at, accepted_at, completed_at.
- Store status history separately when approvals/revisions are introduced.
- Create content_drafts with collaboration_id, author_user_id, body/link, version, status, review_notes, submitted_at.
- Draft review events should be stored in collaboration_activity.
- Create message_threads and messages with workspace_id, participant IDs, entity references, body, attachments metadata, read receipts, and timestamps.
- Create notifications with recipient_user_id, workspace_id, type, entity_type, entity_id, read_at, and metadata JSON.
- For email-enabled sprints, persist delivery attempts separately from in-app notification records.
- For every database change, update Drizzle schema definitions, generate a migration, document the migration purpose, and add seed/test data where the sprint needs demo records.
- Any new table must include created_at and updated_at unless there is a documented reason not to.
- Any user- or workspace-owned table must include either workspace_id directly or a documented parent relationship that enforces workspace isolation.
- Add indexes for foreign keys, lookup slugs/tokens, status filters, and dashboard/reporting queries introduced by this sprint.
- If a sprint stores JSON metadata, document the expected JSON shape and which fields are query-critical enough to become real columns later.

## Routes and UI Surfaces

- /brand/collaborations, /brand/collaborations/[id], /creator/collaborations, /creator/collaborations/[id].
- Collaboration detail pages for brand and creator users.
- /brand/messages, /creator/messages, thread detail routes.
- Notification center, header badge, and related entity deep links.
- All new routes must have clear loading, empty, error, and permission-denied states.
- Navigation entries should appear only for roles that can use the feature.
- Detail pages must show enough context for a developer, tester, or manager to understand the current record, status, owner, and next action.

## State Transitions and Business Rules

- invited, accepted, declined, draft, revision_requested, approved, published, completed, cancelled, disputed.
- drafted, submitted, changes_requested, approved, superseded.
- open, archived, unread, read.
- unread, read, archived, delivery_pending, delivery_failed.
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

- collaborations
- content-drafts
- messages
- notifications

## Module Documentation Requirement

For every affected module listed below, developers must make sure module documentation exists in docs/modules. If the specific module markdown already exists, read it before implementation and update the section for this sprint. If it is missing, create it before or during the sprint. Module docs should capture routes, data entities, service contracts, permissions, state transitions, edge cases, and test notes introduced by this sprint.

Expected module documentation files for this sprint: docs/modules/collaborations.md, docs/modules/content-drafts.md, docs/modules/messages.md, docs/modules/notifications.md.

## Implementation Scope

- Build only the behavior listed in this sprint unless a missing prerequisite blocks completion.
- Preserve completed behavior from previous versions and sprints.
- Use first-party application code and database records unless this sprint explicitly names a third-party integration.
- Add clear empty, loading, error, and permission-denied states for all new user-facing surfaces.
- Ensure role boundaries are enforced server-side, not only in the UI.

## Acceptance Criteria

- Authentication header token and RBAC requirements are documented and tested for every protected route, action, API, and data mutation changed by this sprint.

- Creators can submit draft text or draft notes.
- Brands can approve draft or request changes with comments.
- Creators can submit a final published LinkedIn URL.
- Collaboration timeline shows every state change and actor.

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
