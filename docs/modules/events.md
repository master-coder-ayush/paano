# Events

Sprint 3 accepts `pageview`, `lead`, `signup`, `trial_started`, `purchase`, and `custom` events through public `POST /api/pixel/events`. `event_id` is idempotent per site key. Unsupported types return a validation error; duplicate events are reported as `duplicate`.

Debug requests use `?paano_debug=1` in the installed script or `debug: true` in the payload. Debug events are retained with `received` status and shown only in the protected brand event viewer; they are excluded from production reporting.

Conversion properties may include `tracking_token`; attribution uses it only to resolve a prior non-bot click and never exposes raw identity data.
