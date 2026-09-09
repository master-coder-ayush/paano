# Admin Module

## Version 1 Sprint 1

### Routes

- `/admin`: protected admin overview.
- `/admin/review`: protected review queue.
- `/admin/support`: protected support placeholder.
- `/api/admin/review`: protected review state transition endpoint.

### Data Entities

- `admin_review_items`: status, subject type, subject ID, optional workspace owner, assignee, notes, timestamps.
- `audit_logs`: actor, action, entity, optional workspace owner, metadata, timestamp.

### Permissions

- Admin routes require an active `admin` workspace.
- Admin review mutations require a bearer token for a user with access to an active `admin` workspace.
- Brand, creator, and agency users must receive `403` for admin mutation attempts.

### Review States

Allowed states:

- `new`
- `in_review`
- `approved`
- `rejected`
- `needs_changes`
- `archived`

Allowed transitions:

- `new` to `in_review` or `archived`.
- `in_review` to `approved`, `rejected`, `needs_changes`, or `archived`.
- `needs_changes` to `in_review`, `rejected`, or `archived`.
- `approved` to `archived`.
- `rejected` to `archived`.
- `archived` has no outgoing transitions.

Invalid transitions return `409` and must not partially update related records. Future persisted mutations should write the review update and audit log transactionally.

### Edge Cases

- Missing ID returns `422`.
- Unknown status returns `422`.
- Invalid transition returns `409`.
- Missing/invalid bearer token returns `401`.
- Non-admin bearer token returns `403`.

### Test Notes

- Verify `/admin?as=admin` renders the admin shell.
- Verify `/admin?as=brand` shows permission denied.
- Verify `/api/admin/review` rejects missing and brand bearer tokens.
- Verify valid admin state transitions return `audited: true`.

## Version 2 Sprint 7

The admin review surface represents queues for creator profiles, brand campaigns, disputes, cancellations, withdrawals, and manual invoice/payment records. `/admin/support` summarizes dispute, cancellation, and withdrawal work; `/admin/billing` and `/admin/payouts` remain manual operations views.

All admin pages require an active admin workspace. Review and payment mutations require a valid bearer token, platform-admin authorization, server-side transition validation, and an audit log entry. No brand or creator workspace can read or mutate admin queue data.
