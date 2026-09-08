# Database Module

## Version 1 Sprint 1

### Migration Purpose

Migration `drizzle/0001_cultured_killer_shrike.sql` introduces the first product data model for identity, workspaces, brands, creators, spaces, campaigns, collaborations, messages, wallet placeholders, admin review queues, and audit logs.

### ID, Timestamp, and Delete Policy

- Business tables use string IDs sized for UUIDs.
- Business tables include `created_at` and `updated_at`, except append-only ledger/audit event tables that intentionally store `created_at` only.
- User-facing deletes should use status changes such as `archived`, `removed`, `disabled`, or module-specific inactive states.

### Ownership Rules

- `workspaces.owner_user_id` owns the workspace.
- `workspace_members.workspace_id` and `workspace_members.user_id` enforce membership.
- `brands`, `creators`, `spaces`, `campaigns`, `collaborations`, `message_threads`, `wallet_accounts`, `admin_review_items`, and `audit_logs` include `workspace_id` directly.
- `messages` inherit workspace ownership through `message_threads.thread_id`.
- `wallet_ledger_entries` inherit workspace ownership through `wallet_accounts.wallet_account_id`.
- `creator_profiles` inherit workspace ownership through `creators.creator_id`.

### Enum Values

- Workspace type: `brand`, `creator`, `brand_agency`, `creator_agency`, `admin`.
- Workspace status: `active`, `suspended`, `archived`.
- Workspace role: `owner`, `admin`, `member`, `viewer`, `creator`, `agency_manager`, `platform_admin`.
- Review status: `new`, `in_review`, `approved`, `rejected`, `needs_changes`, `archived`.

### Indexes

Indexes cover workspace ownership, user membership, unique emails, token hashes, workspace type/status, record status filters, admin queue status, assignee lookups, campaign workspace status, collaboration workspace status, creator profile slug, and wallet currency uniqueness.

### Seed Data

`drizzle/seed-v1-sprint-1.sql` creates deterministic brand, creator, agency, and admin workspaces with hashed demo tokens and sample brand, space, campaign, creator, collaboration, wallet, and review records.

### JSON Shapes

- `auth_tokens.scopes`: string array, e.g. `["workspace:read", "admin:review"]`.
- `creator_profiles.topics`: string array.
- `spaces.target_locations`: string array.
- `campaigns.target_regions`: string array.
- `messages.attachments`: array of `{ "name": string, "url": string }`.
- `audit_logs.metadata`: object for state transition details.

Query-critical JSON fields should become typed columns before analytics or filtering depends on them.

## Version 1 Sprint 2

### Migration Purpose

Migration `drizzle/0002_careful_nomad.sql` adds onboarding, notification, and dormant email-delivery persistence tables.

### New Tables

- `user_onboarding_states`: tracks selected role, onboarding status, current step, profile draft JSON, and completion timestamp.
- `notifications`: stores in-app notifications by recipient, optional workspace, related entity, metadata, read timestamp, and status.
- `email_delivery_attempts`: records future delivery attempts separately from in-app notifications.

### Ownership Rules

- `user_onboarding_states` is owned by `user_id`.
- `notifications` is owned by `recipient_user_id` and optionally scoped to `workspace_id`.
- `email_delivery_attempts` is owned by recipient email and optional `recipient_user_id`; it must not contain provider secrets.

### Enum Values

- Onboarding status: `not_started`, `in_progress`, `complete`, `skipped_optional_step`.
- Notification status: `unread`, `read`, `archived`, `delivery_pending`, `delivery_failed`.

### JSON Shapes

- `user_onboarding_states.profile_draft`: role-specific draft data from brand or creator onboarding forms.
- `notifications.metadata`: object with optional `href` and related state details.
- `email_delivery_attempts.metadata`: object for template variables and future provider diagnostics; provider secrets are forbidden.

### Seed Data

`drizzle/seed-v1-sprint-2.sql` adds completed onboarding states and demo in-app notifications. It also includes a TODO comment that email delivery attempts should be inserted only after Amazon SES is set up.
