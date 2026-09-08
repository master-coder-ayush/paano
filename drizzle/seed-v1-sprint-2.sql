-- Version 1 Sprint 2 demo seed data.
-- Run after seed-v1-sprint-1.sql.

INSERT INTO user_onboarding_states (id, user_id, selected_role, status, current_step, profile_draft, completed_at)
VALUES
  ('onboarding_brand_demo', 'user_brand_demo', 'brand', 'complete', 'complete', JSON_OBJECT('companyName', 'Acme GTM'), NOW()),
  ('onboarding_creator_demo', 'user_creator_demo', 'creator', 'complete', 'complete', JSON_OBJECT('name', 'Arjun Mehta'), NOW());

INSERT INTO notifications (id, recipient_user_id, workspace_id, type, entity_type, entity_id, metadata, status)
VALUES
  ('notification_brand_onboarding', 'user_brand_demo', 'workspace_brand_demo', 'onboarding_completed', 'brand', 'brand_acme_demo', JSON_OBJECT('href', '/brand?as=brand'), 'unread'),
  ('notification_creator_review', 'user_creator_demo', 'workspace_creator_demo', 'creator_profile_in_review', 'creator_profile', 'profile_arjun_demo', JSON_OBJECT('href', '/creator?as=creator'), 'unread'),
  ('notification_admin_review', 'user_admin_demo', 'workspace_admin_demo', 'review_queue_updated', 'admin_review_item', 'review_creator_arjun', JSON_OBJECT('href', '/admin/review?as=admin'), 'unread');

-- TODO: Insert email_delivery_attempts rows only after Amazon SES is set up.
-- SES is intentionally not configured for this project right now, so email delivery
-- attempts are represented in schema/code but not used by the Sprint 2 UI.
