# Architecture Module

## Version 1 Sprint 1

### Routes

- Public: `/`, `/api/health`.
- Protected shell: `/dashboard`, `/brand`, `/creator`, `/agency`, `/admin`, `/admin/review`, `/admin/support`.
- Protected API: `/api/workspaces`, `/api/admin/review`.

`/dashboard` is a demo workspace selector for Sprint 1. It exposes only deterministic demo identities and does not return protected business records from the database.

### App Boundaries

- Public website routes describe Paano positioning and link to the workspace selector.
- Brand routes use the brand navigation model: overview, spaces, campaigns, creators, collaborations, messages, billing, settings.
- Creator routes use the creator navigation model: overview, My Card, collaborations, earnings, affiliate, messages, settings.
- Agency routes are reserved for Version 4 and expose no cross-client or creator-roster data in Sprint 1.
- Admin routes are isolated from brand and creator workspaces and require an admin workspace role.

### UI Foundation

- Global typography uses Inter through `next/font/google`.
- Tailwind theme tokens live in `app/globals.css`.
- Current UI uses a simple light neutral palette: near-white app background, white surfaces, light stone sidebar, black primary actions/text, and light gray borders/accents.
- Global border radius is reset to `0`; shell cards, buttons, panels, and navigation are square-edged.
- Visible app text is routed through `next-intl` messages in `messages/en.json`.
- Workspace sidebar is a collapsible light rail on desktop: icons remain visible when collapsed, and labels appear on hover. Mobile keeps labels visible.

### Service Contracts

- UI route guards resolve a demo user from `?as=brand`, `?as=creator`, `?as=agency`, or `?as=admin` until real email/password auth is implemented.
- API and mutation routes require `Authorization: Bearer <token>`.
- Demo bearer tokens are compared by SHA-256 hash in `lib/workspace-foundation.ts`; seed SQL stores hashes only.

### Edge States

Protected route guards render explicit states for `unauthenticated`, `unauthorized`, `workspace_missing`, and `role_missing`.

### Test Notes

- Run `npm run lint` and `npm run build`.
- Manually verify protected shell URLs without `?as=` show permission denied.
- Manually verify role mismatch, such as `/admin?as=brand`, shows permission denied.

## Version 1 Sprint 2

### Routes

- Public auth UI: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/logout`.
- Public auth handlers: `/api/auth/register`, `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/logout`.
- Onboarding UI: `/onboarding`, `/onboarding/brand`, `/onboarding/creator`.
- Onboarding handlers: `/api/onboarding/role`, `/api/onboarding/brand`, `/api/onboarding/creator`.
- Protected notifications: `/notifications`, `/api/notifications`.

### UI Foundation

- Auth and onboarding visible text is routed through `messages/en.json`.
- Auth/onboarding forms use the same light, square-edged UI foundation as workspace shells.
- No email delivery controls or email provider status are visible in the UI.

### Service Contracts

- Browser form submissions redirect after success or back to the form with a validation message.
- JSON clients receive status objects or `422` field validation errors.
- `/api/notifications` requires `Authorization: Bearer <token>`.
