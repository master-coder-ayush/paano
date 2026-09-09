# Marketplace

Sprint 5 exposes `/brand/creators` and `/brand/creators/[creatorId]`. Brand reads are protected by bearer authentication and brand workspace authorization; only published, verified creator cards are listed. Search matches name, headline, bio, and topics. Topic, country, follower-range, and price-range filtering are supported. A brand can view marketplace profile fields but not creator workspace settings or review notes.
# Sprint 3

Brand marketplace reads expose only published, verified creator card fields. Brand users may add a creator to a campaign shortlist; creator workspace settings and admin notes remain private. Shortlist mutations use the bearer-token contract and brand workspace RBAC.
