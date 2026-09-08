# Version 6 Sprint 6: LLM-Based AI Assistance

## Version Context

Version 6: Payments, Payouts, AI Assistance, and Operational Integrations

Version goal: Add the first necessary third-party services after the full in-house product workflow exists.

Sprint goal: Layer AI assistance on top of the manual brief builder and rule-based matching.

## Prerequisites Already Achieved

- Version 6 Sprint 5 has completed and affected module docs have been updated.
- Developers must read docs/features.md before starting this sprint.
- Developers must read docs/data-model.md before making schema, migration, persistence, or reporting changes.
- Developers must review earlier sprint files in docs/sprints/version-6 when this is not the first sprint in the version.

## Expected Behavior

- Layer AI assistance on top of the manual brief builder and rule-based matching.
- AI output must be editable, auditable, and non-authoritative.

## Detailed Work Breakdown

- Review the existing implementation for every affected module before changing behavior.
- Identify existing routes, server actions, route handlers, components, schema tables, seeds, and tests that overlap with this sprint.
- Implement the sprint as an end-to-end workflow, including create/read/update paths where the expected behavior implies them.
- Add deterministic validation rules for required fields, invalid states, duplicate records, and unauthorized access.
- Add operational empty states and failure states so the sprint is demoable with no data, partial data, and realistic seeded data.
- Document provider configuration, required environment variables, callback/webhook URLs, local-development setup, and disabled-provider fallback behavior.
- Every provider callback or webhook must be idempotent and safe to retry.

## Database and Data Model Changes

- Database changes required: Yes. This sprint introduces or changes persisted product data.
- Create ai_generations with provider, model, prompt_version, input refs, output, status, reviewed_by, accepted_at.
- Do not store secrets in prompts or logs.
- Create campaign_briefs with campaign_id, version, objectives, key_messages, guidelines, deliverables, usage_rights, approval_rules, CTA URL, status.
- Brief versions should be immutable after approval.
- Create match_scores or computed views with campaign_id, creator_id, score, label, reasons JSON, confidence, calculated_at.
- Store input version so scores can be explained later.
- Create reports or report_configs only when reports are dynamic. Static reports should define frontmatter and source datasets.
- Scheduled reports later require report_jobs.
- For every database change, update Drizzle schema definitions, generate a migration, document the migration purpose, and add seed/test data where the sprint needs demo records.
- Any new table must include created_at and updated_at unless there is a documented reason not to.
- Any user- or workspace-owned table must include either workspace_id directly or a documented parent relationship that enforces workspace isolation.
- Add indexes for foreign keys, lookup slugs/tokens, status filters, and dashboard/reporting queries introduced by this sprint.
- If a sprint stores JSON metadata, document the expected JSON shape and which fields are query-critical enough to become real columns later.

## Routes and UI Surfaces

- Brief builder, matching explanation, report summary, and admin AI audit views.
- /brand/campaigns/[campaignId]/brief, /brand/campaigns/[campaignId]/brief/edit.
- /brand/creators/matching and shortlist surfaces.
- /reports, /reports/[slug], /brand/results report views.
- All new routes must have clear loading, empty, error, and permission-denied states.
- Navigation entries should appear only for roles that can use the feature.
- Detail pages must show enough context for a developer, tester, or manager to understand the current record, status, owner, and next action.

## State Transitions and Business Rules

- queued, generated, edited, accepted, rejected, failed.
- draft, ready_for_review, approved, archived.
- not_calculated, calculated, stale, incomplete_profile.
- draft, published, scheduled, generated, failed.
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

- ai
- briefs
- matching
- reports

## Module Documentation Requirement

For every affected module listed below, developers must make sure module documentation exists in docs/modules. If the specific module markdown already exists, read it before implementation and update the section for this sprint. If it is missing, create it before or during the sprint. Module docs should capture routes, data entities, service contracts, permissions, state transitions, edge cases, and test notes introduced by this sprint.

Expected module documentation files for this sprint: docs/modules/ai.md, docs/modules/briefs.md, docs/modules/matching.md, docs/modules/reports.md.

## Implementation Scope

- Build only the behavior listed in this sprint unless a missing prerequisite blocks completion.
- Preserve completed behavior from previous versions and sprints.
- Use first-party application code and database records unless this sprint explicitly names a third-party integration.
- Add clear empty, loading, error, and permission-denied states for all new user-facing surfaces.
- Ensure role boundaries are enforced server-side, not only in the UI.

## Acceptance Criteria

- Authentication header token and RBAC requirements are documented and tested for every protected route, action, API, and data mutation changed by this sprint.

- AI can generate campaign objectives, creator angles, key messages, do/don't guidelines, deliverable suggestions, and reporting summaries.
- AI can explain match recommendations using existing match data.
- Brands can edit and approve all AI-generated output.
- Admins can inspect prompts, outputs, and failure states.

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
