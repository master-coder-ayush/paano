# Briefs

Campaign briefs belong to a workspace and campaign and contain objectives, key messages, creator guidelines, deliverables, usage rights, approval rules, and CTA URL. Drafts may be saved and resumed through the brief builder. Statuses are `draft`, `ready_for_review`, `approved`, and `archived`.

Brief versions are timestamped with `created_at`/`updated_at`; an approved version is immutable. Protected reads and writes require `Authorization: Bearer <token>` and a brand workspace owner/admin authorization. The JSON API returns `403` for missing or invalid authorization, `404` for campaigns outside the authorized workspace, `422` for invalid input, and `409` for approved-version mutation attempts.
