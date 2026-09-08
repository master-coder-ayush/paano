# Paano Product Roadmap

Research date: 2026-09-08

This roadmap converts the Naano research and earlier product notes into seven incremental product versions. The goal is to finish the core product, internal operations, agencies, reporting, and enterprise-ready codebase features before relying on third-party integrations.

Sprint execution docs live in `docs/sprints/version-*/sprint-*.md`. Module-level docs must live in `docs/modules/`; each sprint file lists the affected modules that developers must create or update.

## Product Positioning

Paano is a B2B LinkedIn creator marketplace.

- Brands hire vetted LinkedIn creators to promote products, spaces, or campaigns.
- Creators monetize their LinkedIn audience through fixed-price sponsored posts.
- Paano manages discovery, campaign briefing, collaboration workflow, tracking, billing, payouts, messaging, and reporting.
- Later versions expand into agencies, managed campaign operations, richer attribution, benchmark tools, and external integrations.

## Sources Reviewed

- https://naano.com/
- https://naano.com/creators
- https://naano.com/agencies
- https://naano.com/pricing
- https://naano.com/pricing.md
- https://naano.com/free-tools
- https://naano.com/selection
- https://naano.com/reports
- https://naano.com/about
- https://naano.com/book
- https://naano.com/case-studies/blogseo
- https://naano.com/sitemap.xml
- https://naano.com/llms.txt

## Architecture

### Product Areas

The app should be split into these product areas from the start:

- Public website: marketing pages, creator landing page, pricing, free creator search, case studies, resources.
- Authentication and onboarding: role selection, brand onboarding, creator onboarding, workspace creation.
- Brand workspace: overview, spaces, creators, campaigns, collaborations, results, messages, billing, settings.
- Creator workspace: overview, My Card, collaborations, analytics, earnings, affiliate/referrals, messages, settings.
- Admin/Ops workspace: creator verification, brand review, campaign moderation, support, managed campaign operations.
- Tracking service: redirect links, pixel script, event ingestion, attribution, conversion reporting.
- Billing service: wallet, invoices, platform fees, creator payments, payout ledger.
- Messaging/notification service: brand-creator chat, system messages, email notifications.
- Integrations layer: OAuth, payments, analytics, CRM, calendar, community, webhooks, APIs.

### Security Model

All product features must be protected by authentication, header-token validation for mutation/API endpoints, and server-side role-based access control.

- Protected pages and loaders must resolve the authenticated user before returning workspace data.
- Protected route handlers, API endpoints, and mutation endpoints must require an `Authorization: Bearer <token>` style authentication header unless a module doc specifies a stricter token format.
- RBAC must check workspace membership, workspace role, entity ownership, and feature-level permissions before any read or write.
- UI-level hiding is only a convenience; it is never the authorization boundary.
- Public surfaces must be explicitly documented as public. Examples include public marketing pages, public creator cards, tracking redirects, and pixel ingestion endpoints.
- Public endpoints must accept only the minimum data required, must validate all input, and must never expose protected brand, creator, agency, billing, or admin data.
- Any sprint that changes the data model must document ownership columns, token/auth requirements, permission checks, and audit/activity requirements in the relevant module docs.

### Core Entities

These entities should exist in the data model early, even if some remain unused until later versions:

- User
- Auth account
- Workspace
- Workspace member
- Role/permission
- Brand
- Space
- Creator
- Creator profile/card
- Creator rate/offer
- Campaign
- Campaign brief
- Shortlist
- Creator invitation
- Creator application
- Collaboration
- Deliverable
- Content draft
- Published post
- Tracking link
- Pixel site key
- Pixel event
- Conversion event
- Attribution record
- Message thread
- Message
- Wallet
- Payment method
- Invoice
- Payout
- Referral link
- Referral attribution
- Referral reward
- Agency
- Agency client workspace
- Agency creator roster
- Integration
- API key/webhook

### Workspace Model

Recommended workspace types:

- Brand workspace: owned by a company and used to run campaigns.
- Creator workspace: owned by an individual creator.
- Brand agency workspace: manages multiple client brand workspaces.
- Creator agency workspace: manages multiple creator profiles.
- Admin workspace: used by Paano operators.

### Navigation Model

Brand app:

- Overview
- Spaces
- Creators
- Campaigns
- Collaborations
- Results
- Messages
- Billing
- Settings

Creator app:

- Overview
- My Card
- Collaborations
- Analytics
- Community
- Earnings
- Affiliate
- Messages
- Settings

Brand settings:

- Profile
- Audience
- Team and access
- Spaces
- Billing
- Integrations
- Security

Creator settings:

- Profile
- LinkedIn data
- Payment details
- Professional/tax details
- Notifications
- Security
- Delete account

## Priority Rules

1. V1 through V5 should be buildable with the application codebase, database, first-party APIs, and manual operations.
2. Do not add third-party integrations until all practical no-integration product features are already represented.
3. Do not build advanced AI before the manual workflow and rule-based matching are useful.
4. Do not build agencies before single-brand and single-creator flows are stable.
5. Do not build external CRM, Slack, Google Calendar, payment automation, warehouse, tax, SSO, or e-signature integrations until V6 or V7.
6. Every version should improve one complete user loop, not just add isolated screens.
7. Every version must preserve authentication, authorization-header token checks for mutation/API endpoints, and server-side RBAC for all protected data access.

## Version 1: Foundation and Manual Marketplace

Goal: Prove the marketplace can represent brands, creators, spaces, campaigns, and manual collaborations.

### Public Website

- Homepage with clear B2B LinkedIn creator marketplace positioning.
- Header with links for companies, creators, pricing, sign in, and sign up.
- Simple pricing section: Self-Serve and Managed Campaigns.
- Basic creator landing page.
- Basic footer with privacy, terms, help/contact, and source/resource links.

### Authentication and Onboarding

- Email/password signup and login.
- Role selection: brand or creator.
- Basic forgot password flow.
- Brand onboarding:
  - Company name.
  - Website.
  - Industry.
  - Target ICP.
- Creator onboarding:
  - Name.
  - LinkedIn URL.
  - Headline.
  - Bio.
  - Topics.
  - Country.
  - Follower count.
  - Starting price per post.

### Brand Workspace

- Brand overview dashboard with creators activated, posts published, total campaigns, and a basic to-do list.
- Spaces:
  - Create/edit/list spaces.
  - Space fields: name, website, description, industry, ICP.
- Campaigns:
  - Create/list campaigns under a space.
  - Statuses: draft, active, completed.
  - Campaign fields: name, goal, budget, ICP, target region, CTA URL, notes.
- Creators:
  - Manual creator marketplace list.
  - Creator profile detail page.
  - Search and simple filters by topic, country, follower range, and price range.
- Collaborations:
  - Manual collaboration table.
  - Create collaboration from a creator and campaign.
  - Statuses: invited, accepted, draft, published, completed, cancelled.
  - Detail page with creator, campaign, deliverable notes, price, due date, and published post URL.
- Messages:
  - Basic campaign/creator message thread UI.
  - Manual messages stored in-app.
- Billing:
  - Wallet balance placeholder.
  - Manual top-up record.
  - Invoice list placeholder.
- Settings:
  - Profile.
  - Audience.
  - Team list with owner only.
  - Integrations page marked as coming later.

### Creator Workspace

- Creator overview with profile completion, active collaborations, and pending requests.
- My Card:
  - Editable profile/card.
  - Public card preview.
  - Price per post.
  - Topics and follower count.
- Collaborations:
  - View requests.
  - Accept/decline manually.
  - Add draft notes.
  - Submit published LinkedIn post URL.
- Earnings:
  - Manual ledger of pending/available/paid earnings.
- Affiliate:
  - Placeholder unique referral link.
- Messages:
  - Basic in-app chat.
- Settings:
  - Profile.
  - Payment details placeholder.
  - Delete account action.

### Admin/Ops

- Admin can create/edit creators.
- Admin can verify/unverify creators.
- Admin can view brands, spaces, campaigns, and collaborations.
- Admin can update collaboration status manually.

### Not Yet

- Real payments.
- Real pixel tracking.
- OAuth.
- AI matching.
- Advanced analytics.
- Agencies.
- Third-party integrations.

## Version 2: Complete Self-Serve Workflow

Goal: Make the brand-to-creator collaboration loop complete without advanced automation.

### Brand Workspace

- Improved overview:
  - Wallet balance.
  - Pending creator actions.
  - Pending brand approvals.
  - Recently published posts.
  - Next steps: top up wallet, book a call, find creators.
- Campaign brief builder:
  - Manual multi-step brief form.
  - Objectives.
  - Key messages.
  - Creator guidelines.
  - Deliverables.
  - Usage rights.
  - Approval rules.
  - CTA URL.
- Creator marketplace:
  - Saved creator shortlist.
  - Add creator to campaign.
  - Compare selected creators.
- Collaboration lifecycle:
  - Invite creator.
  - Creator accepts/declines.
  - Draft submission.
  - Brand review: approve or request changes.
  - Published post URL submission.
  - Mark as completed.
- Results:
  - Manual metrics entry per published post: impressions, clicks, leads, signups, revenue/pipeline.
  - Campaign selector with first available campaign auto-selected.
  - Basic creator/post performance table.
- Billing:
  - Campaign spend ledger.
  - Invoice/receipt records.
  - Payment status fields: unpaid, reserved, paid, refunded.

### Creator Workspace

- Better collaboration detail:
  - Brief view.
  - Deliverable checklist.
  - Draft submission.
  - Revision requests.
  - Published post URL submission.
- My Card:
  - Publish/unpublish card.
  - Share card link.
  - Past partnerships.
- Analytics:
  - Manual performance summaries from collaborations.
- Earnings:
  - Earnings by collaboration.
  - Pending/available/paid chart.
  - Withdrawal request button, still manually processed.

### Notifications

- In-app notifications for new invitations, accept/decline events, draft submissions, approvals, published URLs, and completed collaborations.

### Admin/Ops

- Admin review queues for new creator profiles, brand campaigns, disputes, and cancellations.
- Admin can issue manual invoice/payment status updates.

### Not Yet

- Pixel script.
- Automated payment processor.
- AI matching.
- OAuth imports.
- External integrations.

## Version 3: Tracking, Attribution, and Real Results

Goal: Replace manual performance reporting with first-party tracking links and pixel attribution.

### Tracking Links

- Generate unique tracking links for each collaboration/post.
- Tracking link includes space, campaign, creator, collaboration, and published post.
- Redirect users to the brand CTA URL.
- Capture click timestamp, referrer, UTM parameters, device/browser basics, IP-derived region where legally allowed, and bot filtering status.

### Pixel Script

Support this pattern:

```html
<script>
  window.paano = window.paano || function () {
    (window.paano.q = window.paano.q || []).push(arguments);
  };
</script>
<script async src="https://paano.com/n.js"
        data-site="pn_6fdc4bb3f2fa4e56a953dfdd74f1aed3"></script>
```

Event examples:

```js
paano('track', 'signup', { email });
paano('track', 'purchase', { value: 49, order_id });
```

Pixel features:

- Unique site key per space.
- Copy snippet action.
- Regenerate key with warning that the previous key stops working.
- Queue events before script load.
- Track pageview, lead, signup, trial_started, purchase, and custom conversion.
- Identity stitching by email when available.
- Debug/test event mode.
- Basic consent/GDPR-friendly mode.

### Results

- Campaign analytics based on tracked events.
- Metrics: clicks, leads, signups, purchases, revenue, conversion rate.
- Results by campaign, space, creator, post, and date range.
- Funnel: click -> lead/signup -> purchase.
- CSV export.

### Brand Settings

- Integrations now includes pixel setup, tracking keys, and event documentation.

### Creator Analytics

- Creator can see post-level clicks and conversions for their collaborations.
- Creator cannot see sensitive buyer PII unless explicitly shared by brand/admin policy.

### Admin/Ops

- Pixel event viewer.
- Attribution debugging tools.
- Tracking link inspector.

### Not Yet

- Verified revenue webhooks.
- CRM integrations.
- Automated payments.
- Advanced AI.

## Version 4: Agencies, Public Growth Tools, and Content Engine

Goal: Expand acquisition and operations beyond direct brand/creator accounts.

### Brand Agency Workspace

- Agency manager account.
- Portfolio dashboard across client workspaces.
- Create one workspace per client.
- Add and allocate client budgets.
- Track campaigns and next actions per client.
- Client-level reporting.
- Agency team access.

### Creator Agency Workspace

- Creator roster management.
- CSV creator import.
- Manage creator profiles and rates.
- Run collaborations without requiring every creator to log in.
- Track roster earnings and active opportunities.
- Creator agency reporting.

### Public Free Tools

- Free LinkedIn creator search form:
  - Company name.
  - Website.
  - Work email.
  - Campaign goal.
  - Exact creator budget.
  - Target audience/ICP.
  - Human-built shortlist delivered within 48 hours.
- LinkedIn creator worth calculator.
- LinkedIn engagement rate calculator.
- Sponsored post delivery odds estimator.
- Creator campaign budget planner.

### Public Content and Trust

- Reports hub.
- Price index reports.
- Creator-led growth benchmark reports.
- Vertical landing pages for sales tech, RevOps, DevTools, product, HR tech, fintech, marketing ops, and vertical SaaS.
- Case studies with customer logo, challenge, campaign, results, metrics grid, LinkedIn post links, and CTA to book call.
- Blog/resource pages for SEO and education.
- Machine-readable pages: `llms.txt` and `pricing.md`.

### Community

- Creator community page.
- Community CTA using an internal page or external link placeholder.
- Creator announcements and playbooks.

### No Third-Party Integrations Yet

- Blog, reports, and case studies can use local MDX/content files first.
- Free tool submissions can be stored in the database and handled manually.
- Community can link to a placeholder until Slack is connected later.

## Version 5: Enterprise Codebase Features and Advanced Automation

Goal: Complete advanced platform features that require codebase work but do not require outside services.

### Advanced Attribution

- Verified revenue through server-side webhook/API key.
- Custom conversion schemas.
- Offline conversion import.
- Account/company attribution.
- Pipeline attribution.
- Multi-touch attribution.
- Deduplication across campaigns and creators.
- Advanced fraud/bot filtering.
- Consent-region behavior and data retention controls.

### Internal API and Webhooks

- Public API foundation:
  - Campaigns.
  - Creators.
  - Collaborations.
  - Results.
  - Events.
- API key management.
- Webhook endpoint management.
- Outbound webhook event log and retry queue.
- Webhook events:
  - Collaboration status changed.
  - Creator accepted.
  - Post published.
  - Lead/signup/purchase attributed.
  - Payment marked as released.

### Rule-Based Matching and Creator Intelligence

- Campaign-based match score without LLM dependency.
- Match labels: strong match, good match, medium match, low fit, incomplete profile.
- Match reasons:
  - Exact observed topic.
  - Related observed topic.
  - Adjacent topic.
  - Audience fits ICP.
  - Audience in target market.
  - Exact/related/adjacent sector.
  - Competitive CPM.
  - Strong reach.
  - Limited data.
- Confidence labels: high confidence, moderate confidence, emerging signal.
- Add matched creators to shortlist or campaign.
- Creator audience snapshots:
  - Roles.
  - Seniorities.
  - Industries.
  - Company sizes.
  - Countries.
  - Locations.
  - Companies.
- Topic evidence:
  - Post-level topic.
  - Content format: text, image, video, document, article, other.
  - Median impressions.
  - Median reactions.
  - Post frequency.
  - Audience reached by topic.
- Campaign compatibility score.

### Managed Campaign Operations

- Internal operator dashboard.
- Booked strategy call tracking, using manual call records first.
- Campaign strategy notes.
- Creator sourcing queue.
- Shortlist builder.
- Brief writing and approval workflow.
- Creator coordination queue.
- Reporting and optimization notes.
- Account manager assignment.
- Client-facing managed campaign status.

### Advanced Automation

- Automated creator recommendations when a campaign is created, using rule-based matching first.
- Auto-generated shortlists from saved creator data.
- Auto-chase task creation for pending actions.
- Smart approval reminders.
- Campaign pacing alerts.
- Budget exhaustion alerts.
- Performance anomaly alerts.
- Reporting summary templates without LLM dependency.
- Next-best-action rules.

### Enterprise Administration

- Advanced roles and permissions.
- Audit logs.
- Workspace-level data retention.
- Admin impersonation with audit trail.
- SLA/support workflow.

### Multi-Channel Data Model

LinkedIn remains the core channel, but the codebase can prepare for:

- X/Twitter creator posts.
- YouTube creator integrations.
- Newsletter sponsorships.
- Podcast sponsorships.

Only expose these channels after LinkedIn campaign tracking, payments, creator workflow, and attribution are mature.

### No Third-Party Integrations Yet

- This version should be implemented with internal logic, local data, and first-party APIs only.
- CRM, payment, LLM, calendar, community, SSO, warehouse, tax, and e-signature integrations remain deferred.

## Version 6: Payments, Payouts, AI Assistance, and Operational Integrations

Goal: Add the first necessary third-party services after the full in-house product workflow exists.

### Real Payments and Payouts

- Real wallet top-up.
- Add/remove payment card.
- Campaign spend ledger.
- Reserve funds for accepted collaborations.
- Release payment after post approval/publication.
- Failed payment handling.
- Refund and cancellation records.
- Invoice and receipt downloads.
- VAT/tax fields.
- Creator payout method.
- Automated or semi-automated payouts.
- Payout history.
- Tax/professional details required before payout.

### Platform Revenue and Referral Economics

- Platform commission model.
- Managed plan fee support.
- Commission ledger by collaboration.
- Revenue reporting for admin.
- Brand referral link.
- Creator referral link.
- Creator My Card link and Deal Link.
- Reward window starts after first paid campaign/collaboration.
- 25% of Paano commission for 3 months on eligible referred activity.
- Referral tracking table with company/creator, introduction or join date, status, reward window, and reward amount.
- Reward simulator with monthly campaign volume, active referred brands, and estimated potential earnings.

### AI-Assisted Features

- AI campaign brief generation.
- AI creator angle generation.
- AI matching explanation copy.
- AI reporting summaries.
- Brand can edit and approve generated AI output.
- Store generated brief versions.

### Operational Integrations

- Stripe Payments for brand card payments and wallet top-ups.
- Stripe Connect for creator payouts.
- Stripe invoices/receipts where possible.
- Email delivery provider for transactional emails.
- OpenAI or equivalent LLM provider for AI assistance.
- LinkedIn profile/audience import provider or controlled import workflow where compliant.
- Google Calendar booking integration for campaign strategy calls.
- Slack for creator community.
- CMS or MDX publishing workflow can remain local unless a hosted CMS becomes necessary.

### Admin/Ops

- Payment admin view.
- Payout admin view.
- Refund/dispute handling.
- Referral reward review and override.
- AI output review and audit trail.
- Integration health/status pages.

## Version 7: Enterprise Third-Party Integrations and Multi-Channel Scale

Goal: Connect Paano to customer systems, compliance services, data warehouses, and additional distribution channels.

### Enterprise CRM and Data Integrations

- HubSpot CRM integration:
  - Sync leads, companies, deals, pipeline, and campaign source.
- Salesforce CRM integration:
  - Sync leads, contacts, accounts, opportunities, and campaign attribution.
- Segment integration:
  - Send/receive conversion events.
- Google Tag Manager integration:
  - Easier pixel deployment.
- Zapier or Make integration:
  - No-code workflows.
- Webhooks:
  - Collaboration status changed.
  - Creator accepted.
  - Post published.
  - Lead/signup/purchase attributed.
  - Payment released.
- Public API:
  - Campaigns.
  - Creators.
  - Collaborations.
  - Results.
  - Events.
- Data export:
  - CSV.
  - Scheduled email reports.
  - BigQuery/Snowflake later if needed.

### Advanced Payments and Compliance Integrations

- Automated tax/VAT handling.
- Multi-currency payments.
- Creator KYC/KYB.
- Contract generation and e-signature.
- Usage rights management.
- Dispute workflow.
- Chargeback workflow.

### Multi-Channel Integrations

- X/Twitter creator posts.
- YouTube creator integrations.
- Newsletter sponsorships.
- Podcast sponsorships.

### Enterprise Access Integrations

- SSO/SAML.
- SCIM user provisioning.
- Enterprise identity provider support.

### Third-Party Integrations Introduced or Completed

- HubSpot.
- Salesforce.
- Segment.
- Google Tag Manager.
- Zapier/Make.
- BigQuery or Snowflake.
- DocuSign or equivalent e-signature provider.
- Tax/VAT provider.
- SSO/SAML provider.

## Cross-Version Feature Matrix

| Area | V1 | V2 | V3 | V4 | V5 | V6 | V7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Public marketing site | Basic | Improved | Tracking docs | Public tools/content | Enterprise positioning | Payment/AI trust | Integration marketplace |
| Brand onboarding | Basic | Complete | Tracking setup | Agency-ready | Enterprise controls | Payment/call setup | SSO/CRM setup |
| Creator onboarding | Manual | Public card | Analytics-aware | Agency roster | Intelligence-ready | Payout/AI-assisted | KYC/multi-channel |
| Spaces | Basic | Campaign-linked | Pixel site keys | Agency client spaces | Enterprise controls | Billing attribution | External sync |
| Campaigns | Basic | Full manual lifecycle | Tracked results | Managed/agency campaigns | Automation/rule matching | Paid workflow + AI | Multi-channel |
| Creator marketplace | Manual list | Shortlists | Results-aware | Agency roster support | Rule-based matching | AI matching | Multi-channel integrations |
| Collaborations | Manual | Draft/review/publish | Tracked posts | Agency ops | Contracts/disputes model | Payment release | E-sign/compliance |
| Results | Manual metrics | Basic dashboards | Pixel attribution | Benchmarks/reports | Advanced attribution/API | AI summaries | CRM/pipeline sync |
| Billing | Placeholder | Manual ledger | Tracking-ready | Agency billing model | Internal revenue ledgers | Stripe/wallet/payouts | Tax/multi-currency |
| Referrals | Placeholder | Manual tracking | Attributed signups | Creator community | Commission rules/simulator | Paid rewards | Partner ecosystem |
| Integrations | None | None | First-party pixel | None required | First-party API/webhooks | Stripe/email/LLM/Calendar/Slack | CRM/SSO/data/e-sign/tax |

## Recommended Build Order

1. Data model and workspace model.
2. Auth and role-based onboarding.
3. Brand spaces and campaigns.
4. Creator profiles and marketplace.
5. Collaboration lifecycle.
6. Messaging and notifications.
7. Manual billing/earnings ledger.
8. Tracking links and pixel.
9. Agencies.
10. Public tools/content/reports.
11. Enterprise codebase features: roles, audit logs, retention, API keys, webhooks.
12. Rule-based matching, creator intelligence, managed ops, and internal automation.
13. Real payments, payouts, and paid referral rewards.
14. AI assistance, LinkedIn import, calendar, Slack, and transactional email integrations.
15. Enterprise integrations: CRM, SSO, e-signature, tax, data warehouse, and multi-channel services.
