# Tracking

Version 3 Sprint 1 introduces workspace-scoped `tracking_links` and `tracking_clicks`. A link resolves space, campaign, creator, collaboration, and optional published post, then redirects publicly to its validated HTTPS destination. `GET /r/[token]` is public and records timestamp, referrer, UTM parameters, coarse device/browser, and a simple bot flag before redirecting.

`GET/POST /api/tracking` requires `Authorization: Bearer <token>` and a brand workspace. Active links are unique per collaboration. Missing or disabled links return a controlled 404. Bot clicks remain recorded and are excluded from later conversion metrics.
