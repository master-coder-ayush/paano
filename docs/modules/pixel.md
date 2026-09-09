# Pixel

Version 3 Sprint 2 adds one active public `pixel_site_keys` record per brand space. Keys are public identifiers, scoped to a workspace and space, and may be revoked by an authenticated brand owner/admin. Regeneration revokes the prior key before issuing a new one.

Protected `GET/POST /api/pixel/keys` requires `Authorization: Bearer <token>` and brand workspace ownership. Public `POST /api/pixel/events` accepts only a site key, event name, optional `event_id`, and event properties; it returns no workspace data. Duplicate `(site_key_id, event_id)` events are marked duplicate. Email identity is hashed before use and never returned.
