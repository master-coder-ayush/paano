# Identity

Email values are trimmed, lower-cased, and SHA-256 hashed before identity stitching. Raw email is not persisted or returned. Consent `denied` events are ignored; `unknown` and `granted` are recorded as consent metadata. Anonymous events remain anonymous until a permitted hashed identity is present.
