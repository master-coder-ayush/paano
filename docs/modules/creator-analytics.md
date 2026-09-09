# Creator analytics

Sprint 6 exposes `/creator/analytics` and `GET /api/creator/analytics` with creator-scoped post metrics: impressions, clicks, leads, and signups/trials. Revenue, pipeline values, buyer identity, raw event payloads, email hashes, and brand attribution explanations are suppressed by policy.

Access requires a bearer token resolving to the creator workspace and only collaborations attached to that creator are returned. Empty data shows a no-data state; delayed or incomplete tracked metrics are labeled as pending.
