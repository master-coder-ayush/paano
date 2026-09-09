# Earnings

Sprint 7 adds protected `/creator/earnings` and `/admin/payouts` surfaces backed by `creator_earnings`, `withdrawal_requests`, and `payout_records`. Creators can read their own ledger; admins can process the queue. Earnings are append-only, sourced by collaboration or referral references, and use pending, available, and paid placeholder states. API mutations require bearer authentication, RBAC, and an audit entry.

Sprint 6 adds withdrawal request validation and a pending/available/paid trend view. Available balance is derived from append-only earnings and active requests; invalid amounts, insufficient balance, duplicate active requests, and invalid transitions are rejected.
