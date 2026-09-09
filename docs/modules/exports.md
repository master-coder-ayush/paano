# Exports

Brand results expose a protected CSV export through `/api/brand/results/export`. The endpoint requires a brand bearer token, applies visible campaign, creator, post, date, and event-type filters, and includes a generated timestamp in every row. Export jobs are represented by workspace-scoped `export_jobs` records for future asynchronous storage.
