# Creator profile

Sprint 5 adds creator-owned profile editing and the public card preview. Profiles are scoped through `creator.workspace_id` and may be read publicly only when the profile/card is published; mutations require `Authorization: Bearer <token>` and a creator workspace role with ownership of the profile. The immutable public slug is the public lookup key. Profile fields include LinkedIn URL, headline, bio, country, topics, follower count, and fixed price per post. Invalid URLs, empty topics, negative followers, and non-positive prices are rejected with no partial update. Review and verification state changes remain server-controlled and belong to admin review.

Routes: `/creator/card`, `/creator/settings/profile`, `/creators/[slug]`, and `/api/creator/profile`.
