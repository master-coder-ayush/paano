-- Version 1 Sprint 1 demo seed data.
-- Demo bearer tokens are documented by label in the app UI; only SHA-256 hashes are stored here.

INSERT INTO users (id, name, email, password_hash, status)
VALUES
  ('user_brand_demo', 'Maya Patel', 'maya@acme.dev', 'demo-password-hash', 'active'),
  ('user_creator_demo', 'Arjun Mehta', 'arjun@example.com', 'demo-password-hash', 'active'),
  ('user_agency_demo', 'Nina Rao', 'nina@northstar.example', 'demo-password-hash', 'active'),
  ('user_admin_demo', 'Ops Admin', 'ops@paano.example', 'demo-password-hash', 'active');

INSERT INTO workspaces (id, type, name, status, owner_user_id)
VALUES
  ('workspace_brand_demo', 'brand', 'Acme GTM', 'active', 'user_brand_demo'),
  ('workspace_creator_demo', 'creator', 'Arjun Mehta', 'active', 'user_creator_demo'),
  ('workspace_agency_demo', 'brand_agency', 'Northstar Agency', 'active', 'user_agency_demo'),
  ('workspace_admin_demo', 'admin', 'Paano Ops', 'active', 'user_admin_demo');

INSERT INTO workspace_members (id, workspace_id, user_id, role, status)
VALUES
  ('member_brand_owner', 'workspace_brand_demo', 'user_brand_demo', 'owner', 'active'),
  ('member_creator_owner', 'workspace_creator_demo', 'user_creator_demo', 'creator', 'active'),
  ('member_agency_owner', 'workspace_agency_demo', 'user_agency_demo', 'agency_manager', 'active'),
  ('member_admin_owner', 'workspace_admin_demo', 'user_admin_demo', 'platform_admin', 'active');

INSERT INTO auth_tokens (id, user_id, workspace_id, token_hash, type, scopes)
VALUES
  ('token_brand_demo', 'user_brand_demo', 'workspace_brand_demo', 'b0184bb8dae04bfcd8815bb7bc399d0742d14407a38649124e30cf27d09019b6', 'session', JSON_ARRAY('workspace:read', 'workspace:write')),
  ('token_creator_demo', 'user_creator_demo', 'workspace_creator_demo', 'fa9fcf7163bb0c4c188160ac25477993c922263ae2adeddc311e3d431932281d', 'session', JSON_ARRAY('workspace:read')),
  ('token_agency_demo', 'user_agency_demo', 'workspace_agency_demo', 'f7e72fb68756df536cbf6a2e3054130f4e6070dfd3f698ea6683ab279d3ebc28', 'session', JSON_ARRAY('workspace:read')),
  ('token_admin_demo', 'user_admin_demo', 'workspace_admin_demo', 'e7fca49c20ca62deb525d35f8dc2edd0c4008df5b0bc6411d97b47f268f9245e', 'session', JSON_ARRAY('workspace:read', 'admin:review'));

INSERT INTO brands (id, workspace_id, company_name, website, industry, target_icp, status)
VALUES
  ('brand_acme_demo', 'workspace_brand_demo', 'Acme GTM', 'https://acme.dev', 'Developer tools', 'Founders, heads of growth, and developer marketers at B2B software companies.', 'active');

INSERT INTO spaces (id, workspace_id, brand_id, name, website, description, industry, target_icp, target_locations, default_cta_url, status)
VALUES
  ('space_acme_devtools', 'workspace_brand_demo', 'brand_acme_demo', 'Developer tools launch', 'https://acme.dev', 'A launch workspace for LinkedIn creator campaigns.', 'Developer tools', 'Technical founders and GTM leaders', JSON_ARRAY('United States', 'India'), 'https://acme.dev/book', 'active');

INSERT INTO creators (id, workspace_id, user_id, status, verification_status)
VALUES
  ('creator_arjun_demo', 'workspace_creator_demo', 'user_creator_demo', 'published', 'pending');

INSERT INTO creator_profiles (id, creator_id, public_slug, name, linkedin_url, headline, bio, country, topics, follower_count, price_per_post_amount, currency, public_card_status)
VALUES
  ('profile_arjun_demo', 'creator_arjun_demo', 'arjun-mehta', 'Arjun Mehta', 'https://www.linkedin.com/in/arjun-mehta', 'B2B SaaS and DevTools creator', 'Writes about developer marketing, product launches, and founder-led sales.', 'India', JSON_ARRAY('DevTools', 'B2B SaaS', 'Founder-led sales'), 24000, 900.00, 'USD', 'published');

INSERT INTO campaigns (id, workspace_id, brand_id, space_id, name, goal, budget_amount, currency, target_icp, target_regions, cta_url, status, notes)
VALUES
  ('campaign_acme_launch', 'workspace_brand_demo', 'brand_acme_demo', 'space_acme_devtools', 'Acme launch awareness', 'Drive qualified launch traffic from LinkedIn creators.', 5000.00, 'USD', 'Technical founders and developer marketers', JSON_ARRAY('United States', 'India'), 'https://acme.dev/book', 'draft', 'Manual Sprint 1 campaign fixture.');

INSERT INTO collaborations (id, workspace_id, brand_id, campaign_id, creator_id, deliverable_notes, price_amount, currency, status)
VALUES
  ('collab_acme_arjun', 'workspace_brand_demo', 'brand_acme_demo', 'campaign_acme_launch', 'creator_arjun_demo', 'One LinkedIn text post with CTA link.', 900.00, 'USD', 'invited');

INSERT INTO wallet_accounts (id, workspace_id, currency, status)
VALUES
  ('wallet_acme_usd', 'workspace_brand_demo', 'USD', 'active');

INSERT INTO wallet_ledger_entries (id, wallet_account_id, type, amount, currency, status, source_type, source_id)
VALUES
  ('ledger_acme_manual_topup', 'wallet_acme_usd', 'manual_topup', 2500.00, 'USD', 'posted', 'admin_seed', 'seed-v1-sprint-1');

INSERT INTO admin_review_items (id, workspace_id, subject_type, subject_id, status, assignee_id, notes)
VALUES
  ('review_creator_arjun', 'workspace_creator_demo', 'creator_profile', 'profile_arjun_demo', 'in_review', 'user_admin_demo', 'Verify LinkedIn URL and audience quality.'),
  ('review_brand_acme', 'workspace_brand_demo', 'brand', 'brand_acme_demo', 'new', 'user_admin_demo', 'Confirm company website and ICP.');
