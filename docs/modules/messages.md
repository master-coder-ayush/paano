# Messages

Sprint 6 provides protected collaboration threads. Threads are scoped to a workspace and collaboration entity; messages include sender, body, attachments metadata in the persisted model, and timestamps. API reads and writes require `Authorization: Bearer <token>` and reject unknown threads or empty bodies. The prototype UI demonstrates the seeded thread; compose controls can be expanded in the next workflow sprint.
