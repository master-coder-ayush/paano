# Version 3 tracking QA

Use the demo brand (`as=brand`), creator (`as=creator`), and admin (`as=admin`) identities.

1. Open `/brand/tracking?as=brand` and `/brand/settings/integrations/pixel?as=brand`.
2. Open `/r/demo-launch-arjun`; confirm a redirect and click capture.
3. Load the pixel snippet on a test page; confirm pageview delivery.
4. Call `paano('track', 'signup', { tracking_token: 'demo-launch-arjun', email: 'qa@example.com' })` and a purchase event; confirm accepted events and attribution.
5. Repeat an event with the same `event_id`; expect `duplicate`.
6. Use an invalid or revoked site key; expect `invalid_key` and no workspace data.
7. Regenerate a pixel key and disable a tracking link; confirm old credentials stop working.
8. Verify `/creator/analytics?as=creator` omits revenue, pipeline, buyer identity, and raw payloads.
9. Verify `/admin/tracking?as=admin` and `/admin/attribution?as=admin` show diagnostics, while brand/creator identities receive forbidden states.

Known limitation: this prototype keeps runtime demo records in memory; production deployment must connect the Drizzle tables and configure retention jobs.
