# Privacy

Pixel ingestion is public but returns only event status and an opaque event ID. Workspace event data requires bearer-authenticated brand/admin access. User-agent metadata is accepted for operational debugging; email is suppressed from stored payloads in the production persistence implementation. Debug events are separate by status and should be retained only for the configured operational window.
