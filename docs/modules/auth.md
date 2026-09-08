# Auth Module

## Version 1 Sprint 2

### Routes

- Public UI: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/logout`.
- Public route handlers: `/api/auth/register`, `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/logout`.

Auth entry routes are public because unauthenticated users must be able to create accounts, sign in, request a reset, and end a local session. They must not return protected workspace data.

### Data Entities

- `users`: email/password identity, status, and `last_login_at`.
- `auth_accounts`: email provider account link.
- `auth_tokens`: session, password reset, email verification, API, webhook, and integration token hashes.
- `email_delivery_attempts`: delivery-attempt persistence shape for future transactional email.

### Token and Password Rules

- Passwords and bearer/session tokens must never be stored in plain text.
- Prototype route handlers return hash-oriented persistence contracts; production wiring should replace the current deterministic placeholders with database writes.
- `auth_tokens.type` covers `session`, `password_reset`, and `email_verification`; separate password reset and verification tables are not required for this sprint.

### Email Delivery

Email delivery is intentionally dormant in Sprint 2.

- `email_delivery_attempts` exists in schema for future delivery auditability.
- `lib/email-delivery.ts` contains a TODO to wire delivery to Amazon SES once SES is set up.
- SES is not being configured for this project right now.
- Email delivery is not called by the auth routes and is not visible in the UI.

### Validation

- Register requires name, valid unique email, and password of at least eight characters.
- Login requires an existing demo email and password of at least eight characters.
- Forgot password accepts a valid email and returns a generic accepted state.
- Reset password requires a token of at least twelve characters and a password of at least eight characters.

### Test Notes

- POST JSON to each `/api/auth/*` route and verify `422` validation errors.
- Submit UI forms and verify redirect behavior.
- Confirm forgot-password UI mentions only reset-request acceptance, not email delivery.
