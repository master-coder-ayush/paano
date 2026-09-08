# Permissions Module

## Version 1 Sprint 1

### Auth Contract

- Protected APIs and mutation routes require `Authorization: Bearer <token>`.
- Tokens are hashed with SHA-256 before comparison.
- Seed records store token hashes only in `auth_tokens.token_hash`.
- Future production auth must validate token status, expiry, revocation, scopes, workspace access, and user status against persisted records.

### Page Auth

Sprint 1 uses explicit demo identities through the `?as=` query parameter so role-safe routing can be tested before email/password signup is implemented.

Allowed demo keys:

- `brand`
- `creator`
- `agency`
- `admin`

### RBAC Rules

- `brand` routes require workspace type `brand`.
- `creator` routes require workspace type `creator`.
- `agency` routes require workspace type `brand_agency` or `creator_agency`.
- `admin` routes require workspace type `admin` and role `platform_admin`, `admin`, or `owner`.
- UI navigation follows the active workspace type and is not treated as the authorization boundary.

### Protected API Outcomes

- Missing/invalid token: `401 { "error": "unauthenticated" }`.
- Authenticated but wrong workspace/role: `403`.
- Invalid input: `422`.
- Invalid state transition: `409`.

### Test Notes

Manual examples:

```bash
curl http://localhost:3000/api/workspaces
curl -H "Authorization: Bearer paano_demo_brand" http://localhost:3000/api/workspaces
curl -X PATCH -H "Authorization: Bearer paano_demo_brand" http://localhost:3000/api/admin/review
curl -X PATCH -H "Authorization: Bearer paano_demo_admin" -H "Content-Type: application/json" -d "{\"id\":\"review_creator_arjun\",\"fromStatus\":\"in_review\",\"toStatus\":\"approved\"}" http://localhost:3000/api/admin/review
```
