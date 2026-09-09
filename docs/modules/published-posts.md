# Published posts

Version 3 tracking links may reference a published post and are inspected from the protected brand tracking surface.

Sprint 5 introduces the `published_posts` persistence contract. Each record belongs to a workspace and collaboration, stores platform, URL, publication date, submitter, verification status, and optional documented `manual_metrics` JSON. Query-critical metrics are normalized into `result_snapshots`; the JSON field is reserved for non-query metadata.
