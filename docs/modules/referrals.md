# Referrals

Sprint 6 adds protected `/creator/affiliate` and `/admin/referrals` surfaces. Referral links are workspace-owned. Attribution and reward records include the referrer, referred entity, reward window, status, amount, and versioned rule. Creators can read only their own records; platform admins can review and manually transition statuses. Duplicate link tokens and duplicate link/entity attributions are rejected. Protected mutations use the existing `Authorization: Bearer <token>` contract and require audit activity.
