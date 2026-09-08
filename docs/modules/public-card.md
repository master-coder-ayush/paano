# Public card

`/creators/[slug]` is an explicitly public route. It returns only published card fields: name, headline, bio, LinkedIn URL, topics, follower count, and fixed rate. Unpublished, missing, or suspended cards return not-found behavior. Slugs are intended to be unique and immutable; the public route never exposes workspace, payout, admin, or customer data.
