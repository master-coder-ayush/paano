# Billing

Sprint 7 introduces protected `/brand/billing` and `/admin/billing` pages plus `billing_profiles`, `invoice_records`, `payment_records`, `wallet_accounts`, and append-only `wallet_ledger_entries`. Brand owners can read only their workspace records; platform admins can review the operational queue. Mutation/API access requires an `Authorization: Bearer <token>` token and server-side RBAC. Wallet balances are derived from posted ledger entries; direct balance edits are forbidden. Real payment providers are deferred.

Sprint 6 keeps billing manual and defines wallet-to-earnings reconciliation as an append-only boundary. Sensitive status changes require bearer authentication, RBAC, and audit activity.
