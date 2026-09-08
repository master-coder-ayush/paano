# Public Website

Version 1 Sprint 3 adds a static, content-driven public website. Public pages use the `Public` namespace in `messages/en.json` through `next-intl`; copy is not embedded in route components.

Public routes include `/`, `/creators`, `/pricing`, `/about`, `/help`, `/reports`, `/resources`, `/contact`, `/privacy`, and `/terms`. `/pricing.md` and `/llms.txt` are read-only route handlers for machine-readable content.

The public shell has no authentication requirement and never reads protected workspace records. Sign-in and registration links enter the existing auth flow. Dynamic content and persisted case studies are intentionally deferred until a content model is introduced.

Loading, permission-denied, and error behavior: static routes render without data loading; no permission-denied state applies to public content; route-level failures use Next.js's root error boundary and unknown URLs use the not-found boundary.
