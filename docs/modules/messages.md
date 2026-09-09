# Messages

## Version 2 Sprint 4

Collaboration detail pages keep protected message context alongside the draft and activity timeline. Thread reads/writes continue to require bearer authentication and workspace/entity ownership.

Sprint 6 provides protected collaboration threads. Threads are scoped to a workspace and collaboration entity; messages include sender, body, attachments metadata in the persisted model, and timestamps. API reads and writes require `Authorization: Bearer <token>` and reject unknown threads or empty bodies. The prototype UI demonstrates the seeded thread; compose controls can be expanded in the next workflow sprint.
