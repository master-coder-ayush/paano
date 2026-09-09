# Notifications Module

## Version 1 Sprint 2

### Routes

- `/notifications`: protected in-app notification center.
- `/api/notifications`: protected notification read endpoint.

### Data Entities

- `notifications`: recipient user, optional workspace, type, related entity, metadata JSON, status, read timestamp, created/updated timestamps.
- `email_delivery_attempts`: separate future delivery-attempt persistence table; not used by the UI.

### Notification States

- `unread`
- `read`
- `archived`
- `delivery_pending`
- `delivery_failed`

`delivery_pending` and `delivery_failed` are reserved for future delivery workflows and should not appear as in-app notification states unless a later sprint explicitly uses them.

### Permissions

- `/notifications` uses workspace shell authorization and only shows notifications for the active demo identity.
- `/api/notifications` requires `Authorization: Bearer <token>` and returns only notifications for that authenticated user.
- Missing or invalid bearer token returns `401`.

### Email Delivery

Email delivery is intentionally not visible in the UI.

- `lib/email-delivery.ts` documents the future Amazon SES integration point.
- SES is not being configured for this project right now.
- Auth and onboarding route handlers do not call email delivery.

### Deep Links

Notification rows include protected deep links back to the related workspace area, such as brand overview, creator overview, or admin review.

### Test Notes

- Verify `/notifications?as=brand`, `/notifications?as=creator`, and `/notifications?as=admin`.
- Verify `/api/notifications` rejects missing bearer tokens.
- Verify valid demo bearer tokens return only that user's notifications.

## Version 2 Sprint 1

Dashboard notification badges continue to use the authenticated demo identity and link to `/notifications`. No new notification type or persistence path is introduced by this sprint.
