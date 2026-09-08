# Paano Data Model

This document is the baseline product data model. Sprint files may add or refine fields, but they should not invent conflicting entities without updating this file and the relevant `docs/modules/*.md` files.

## Global Rules

- Every table should use a stable primary key, preferably a generated string/UUID.
- Every persisted business table should include `created_at` and `updated_at`.
- User-facing deletions should default to soft delete or archived status unless legal/compliance requirements demand hard deletion.
- Any workspace-owned table must include `workspace_id` directly or have a documented parent relationship that enforces workspace isolation.
- Status fields must use documented enum values.
- Sensitive state changes should produce audit/activity records once the audit module exists.
- Ledger-style financial tables must be append-only; balances should be derived from ledger entries.
- Provider secrets must not be stored as plain JSON in application tables.
- Protected data reads and writes must resolve an authenticated user and pass server-side RBAC.
- Mutation/API endpoints must require an authentication header token, using `Authorization: Bearer <token>` unless a stricter module-specific contract is documented.
- Public endpoints must be explicitly marked public in module docs and must not expose protected workspace data.
- Any table containing user, workspace, billing, attribution, creator, agency, or admin data must document which roles can create, read, update, delete, export, or administer records.

## Core Identity and Workspace Tables

### users

- `id`
- `name`
- `email`
- `email_verified_at`
- `password_hash`
- `status`: registered, email_unverified, onboarding_required, active, disabled
- `last_login_at`
- `created_at`
- `updated_at`

### auth_accounts

- `id`
- `user_id`
- `provider`: email, google, linkedin, sso
- `provider_account_id`
- `created_at`
- `updated_at`

### auth_tokens

- `id`
- `user_id`
- `workspace_id`
- `token_hash`
- `type`: session, api, webhook, integration, password_reset, email_verification
- `scopes`
- `expires_at`
- `last_used_at`
- `revoked_at`
- `created_at`
- `updated_at`

Token rules:

- Store only token hashes or encrypted provider tokens as appropriate.
- Never store bearer tokens in plain text.
- Header-authenticated APIs must validate token status, expiry, scopes, workspace access, and user status.
- Token usage on sensitive endpoints should update `last_used_at` and may create audit logs.

### user_onboarding_states

- `id`
- `user_id`
- `selected_role`: brand, creator
- `status`: not_started, in_progress, complete, skipped_optional_step
- `current_step`
- `profile_draft`
- `completed_at`
- `created_at`
- `updated_at`

### workspaces

- `id`
- `type`: brand, creator, brand_agency, creator_agency, admin
- `name`
- `status`: active, suspended, archived
- `owner_user_id`
- `created_at`
- `updated_at`

### workspace_members

- `id`
- `workspace_id`
- `user_id`
- `role`: owner, admin, member, viewer, creator, agency_manager, platform_admin
- `status`: active, invited, removed
- `created_at`
- `updated_at`

## Brand Tables

### brands

- `id`
- `workspace_id`
- `company_name`
- `website`
- `industry`
- `target_icp`
- `default_space_id`
- `billing_profile_id`
- `status`: onboarding_required, active, blocked_by_billing, suspended
- `created_at`
- `updated_at`

### spaces

- `id`
- `workspace_id`
- `brand_id`
- `name`
- `website`
- `description`
- `industry`
- `target_icp`
- `target_locations`
- `default_cta_url`
- `tracking_key_id`
- `status`: active, archived
- `created_at`
- `updated_at`

## Creator Tables

### creators

- `id`
- `workspace_id`
- `user_id`
- `status`: draft_profile, pending_review, published, hidden, suspended
- `verification_status`: unverified, pending, verified, rejected
- `created_at`
- `updated_at`

### creator_profiles

- `id`
- `creator_id`
- `public_slug`
- `name`
- `linkedin_url`
- `headline`
- `bio`
- `country`
- `topics`
- `follower_count`
- `estimated_impressions`
- `engagement_rate`
- `price_per_post_amount`
- `currency`
- `public_card_status`: draft, published, unpublished
- `published_at`
- `created_at`
- `updated_at`

### creator_rates

- `id`
- `creator_id`
- `deliverable_type`
- `amount`
- `currency`
- `status`: active, inactive
- `created_at`
- `updated_at`

### creator_past_partnerships

- `id`
- `creator_id`
- `brand_name`
- `description`
- `url`
- `created_at`
- `updated_at`

## Campaign and Collaboration Tables

### campaigns

- `id`
- `workspace_id`
- `brand_id`
- `space_id`
- `name`
- `goal`
- `budget_amount`
- `currency`
- `target_icp`
- `target_regions`
- `cta_url`
- `status`: draft, active, completed, cancelled, briefing, sourcing, inviting, draft_review, scheduled, live
- `starts_at`
- `ends_at`
- `created_at`
- `updated_at`

### campaign_briefs

- `id`
- `campaign_id`
- `version`
- `objectives`
- `key_messages`
- `creator_guidelines`
- `deliverables`
- `usage_rights`
- `approval_rules`
- `cta_url`
- `status`: draft, ready_for_review, approved, archived
- `approved_at`
- `created_at`
- `updated_at`

### shortlists

- `id`
- `campaign_id`
- `name`
- `status`: draft, invited, archived
- `created_at`
- `updated_at`

### shortlist_creators

- `id`
- `shortlist_id`
- `campaign_id`
- `creator_id`
- `rank`
- `notes`
- `status`: draft, invited, removed, booked
- `added_by_user_id`
- `created_at`
- `updated_at`

### collaborations

- `id`
- `workspace_id`
- `brand_id`
- `campaign_id`
- `creator_id`
- `price_amount`
- `currency`
- `status`: invited, accepted, declined, draft, revision_requested, approved, published, completed, cancelled, disputed
- `due_at`
- `accepted_at`
- `completed_at`
- `created_at`
- `updated_at`

### content_drafts

- `id`
- `collaboration_id`
- `author_user_id`
- `version`
- `body`
- `link`
- `review_notes`
- `status`: drafted, submitted, changes_requested, approved, superseded
- `submitted_at`
- `created_at`
- `updated_at`

### published_posts

- `id`
- `collaboration_id`
- `platform`: linkedin, x, youtube, newsletter, podcast
- `url`
- `published_at`
- `submitted_by_user_id`
- `verification_status`: submitted, verified, rejected, archived
- `manual_metrics`
- `created_at`
- `updated_at`

## Tracking and Analytics Tables

### tracking_links

- `id`
- `workspace_id`
- `space_id`
- `campaign_id`
- `creator_id`
- `collaboration_id`
- `published_post_id`
- `token`
- `destination_url`
- `status`: active, disabled, expired, invalid
- `created_at`
- `updated_at`

### tracking_clicks

- `id`
- `tracking_link_id`
- `clicked_at`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `device`
- `browser`
- `country`
- `bot_score`
- `created_at`

### pixel_site_keys

- `id`
- `workspace_id`
- `space_id`
- `key`
- `status`: active, revoked
- `created_at`
- `revoked_at`

### pixel_events

- `id`
- `workspace_id`
- `space_id`
- `site_key_id`
- `event_type`
- `event_id`
- `payload`
- `identity_hash`
- `received_at`
- `processing_status`: received, processed, duplicate, failed, ignored
- `created_at`

### attribution_records

- `id`
- `conversion_event_id`
- `tracking_click_id`
- `campaign_id`
- `creator_id`
- `published_post_id`
- `attribution_model`
- `confidence`
- `explanation`
- `status`: attributed, unattributed, duplicate, recalculated, disputed
- `created_at`
- `updated_at`

## Communication Tables

### message_threads

- `id`
- `workspace_id`
- `entity_type`
- `entity_id`
- `status`: open, archived
- `created_at`
- `updated_at`

### messages

- `id`
- `thread_id`
- `sender_user_id`
- `body`
- `attachments`
- `created_at`
- `updated_at`

### notifications

- `id`
- `recipient_user_id`
- `workspace_id`
- `type`
- `entity_type`
- `entity_id`
- `metadata`
- `status`: unread, read, archived, delivery_pending, delivery_failed
- `read_at`
- `created_at`
- `updated_at`

### email_delivery_attempts

- `id`
- `recipient_user_id`
- `recipient_email`
- `template`
- `status`
- `provider_message_id`
- `error_message`
- `metadata`
- `created_at`
- `updated_at`

Email delivery rules:

- Delivery attempts are persisted separately from in-app notifications.
- Amazon SES is the intended future sender, but SES is not configured for this project right now.
- Email delivery must not be visible in auth/onboarding UI until a later sprint explicitly enables it.
- Provider secrets must not be stored in `metadata`.

## Billing and Referral Tables

### wallet_accounts

- `id`
- `workspace_id`
- `currency`
- `status`
- `created_at`
- `updated_at`

### wallet_ledger_entries

- `id`
- `wallet_account_id`
- `type`
- `amount`
- `currency`
- `status`: pending, posted, reversed, failed
- `source_type`
- `source_id`
- `created_at`

### invoices

- `id`
- `workspace_id`
- `invoice_number`
- `amount`
- `currency`
- `tax_fields`
- `status`: draft, issued, paid, void, refunded
- `issued_at`
- `created_at`
- `updated_at`

### creator_earnings

- `id`
- `creator_id`
- `source_type`
- `source_id`
- `amount`
- `currency`
- `status`: pending, available, requested, processing, paid, failed, cancelled
- `created_at`
- `updated_at`

### referral_links

- `id`
- `referrer_user_id`
- `referrer_workspace_id`
- `type`: brand, creator, deal_link, card_link
- `code`
- `status`: active, disabled
- `created_at`
- `updated_at`

### referral_rewards

- `id`
- `referral_link_id`
- `referred_entity_type`
- `referred_entity_id`
- `reward_window_start`
- `reward_window_end`
- `amount`
- `currency`
- `status`: created, attributed, qualified, earning, payable, paid, rejected, expired
- `created_at`
- `updated_at`

## Later-Version Tables

Later versions may add:

- `agencies`
- `agency_client_workspaces`
- `agency_creator_roster`
- `import_jobs`
- `public_tool_submissions`
- `benchmark_sets`
- `api_keys`
- `webhook_endpoints`
- `webhook_deliveries`
- `creator_audience_snapshots`
- `creator_topic_evidence`
- `managed_campaigns`
- `ops_tasks`
- `audit_logs`
- `integrations`
- `payment_records`
- `payout_records`
- `email_deliveries`
- `ai_generations`
- `crm_connections`
- `data_exports`
- `contracts`
- `sso_connections`
- `creator_channel_profiles`
