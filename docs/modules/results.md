# Results

## Sprint 5

`result_snapshots` stores normalized manual metrics for a published post: impressions, clicks, leads, signups, revenue, currency, source, actor, timestamp, status, workspace, campaign, creator, and post. `published_posts` stores the verified LinkedIn URL and ownership relationship. Manual writes use `POST /api/brand/results` with `Authorization: Bearer <token>` and are restricted server-side to the active brand workspace. Duplicate post submissions update the existing snapshot; negative, non-finite, or missing values are rejected. Manual rows are future inputs for Version 3 tracking and attribution.

Migration `drizzle/0007_overrated_marvex.sql` creates the two tables and reporting indexes. The prototype service mirrors the same ownership and validation contract until the database-backed repository is enabled.
