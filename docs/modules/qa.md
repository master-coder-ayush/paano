# QA

V1 Sprint 7 smoke path: use the demo identities `?as=brand`, `?as=creator`, and `?as=admin`; verify `/brand/billing`, `/creator/earnings`, `/admin/review`, `/admin/billing`, and `/admin/payouts`. Confirm brand/creator requests receive permission-denied states, missing bearer tokens return 401, invalid transitions return 409/422, and balances are displayed from ledger records. Manual payment and payout processing are intentionally deferred.
