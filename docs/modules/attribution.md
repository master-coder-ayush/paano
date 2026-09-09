# Attribution

Sprint 4 uses a deterministic last-click model. A conversion event with `tracking_token` is matched to the latest non-bot click for that tracking link occurring before the conversion. The resulting record carries campaign, creator, and published-post context, confidence, explanation, and status. Missing tokens, missing clicks, bot clicks, duplicate events, and debug events are not attributed.

`GET /api/attribution` and `/admin/attribution` require bearer-authenticated brand/admin access. The public pixel endpoint never exposes attribution data.
