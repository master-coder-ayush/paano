# Onboarding Module

## Version 1 Sprint 2

### Routes

- `/onboarding`: role selection for new users.
- `/onboarding/brand`: brand onboarding form.
- `/onboarding/creator`: creator onboarding form.
- `/api/onboarding/role`: validates brand/creator role selection.
- `/api/onboarding/brand`: validates brand profile data and returns a brand workspace creation contract.
- `/api/onboarding/creator`: validates creator profile data and returns a creator workspace creation contract.

### Data Entities

- `user_onboarding_states`: user, selected role, status, current step, profile draft JSON, and completion timestamp.
- Brand onboarding writes future records for `workspaces`, `workspace_members`, and `brands`.
- Creator onboarding writes future records for `workspaces`, `workspace_members`, `creators`, and `creator_profiles`.

### States

- `not_started`
- `in_progress`
- `complete`
- `skipped_optional_step`

### Validation

Brand onboarding:

- Company name: at least two characters.
- Website: full HTTP or HTTPS URL.
- Industry: one of the predefined options `b2b_saas`, `fintech`, `healthcare`, `ecommerce`, `education`, `professional_services`, `developer_tools`, or `marketing_advertising`.
- Target ICP: at least ten characters.

Creator onboarding:

- Name: at least two characters.
- LinkedIn URL: full `linkedin.com` URL.
- Headline: required.
- Bio: at least twenty characters.
- Topics: at least one comma-separated topic.
- Country: required.
- Follower count: zero or higher.
- Starting price per post: greater than zero.

### Routing Rules

- A new user must complete role selection before entering a workspace.
- Brand onboarding completion redirects to `/brand?as=brand` in the prototype.
- Creator onboarding completion redirects to `/creator?as=creator` in the prototype.
- Production persistence should update user status from `onboarding_required` to `active` in the same transaction as workspace/profile creation.

### Edge Cases

- Missing session on browser form submissions redirects to `/login`.
- JSON API callers receive validation errors without redirect.
- Invalid role returns `422`.
