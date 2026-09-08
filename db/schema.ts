import { randomUUID } from "node:crypto";
import {
  decimal,
  index,
  int,
  json,
  mysqlTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

const id = (name = "id") =>
  varchar(name, { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID());

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
};

export const userStatuses = [
  "registered",
  "email_unverified",
  "onboarding_required",
  "active",
  "disabled",
] as const;

export const workspaceTypes = [
  "brand",
  "creator",
  "brand_agency",
  "creator_agency",
  "admin",
] as const;

export const workspaceStatuses = ["active", "suspended", "archived"] as const;

export const workspaceRoles = [
  "owner",
  "admin",
  "member",
  "viewer",
  "creator",
  "agency_manager",
  "platform_admin",
] as const;

export const reviewStatuses = [
  "new",
  "in_review",
  "approved",
  "rejected",
  "needs_changes",
  "archived",
] as const;

export const serviceChecks = mysqlTable("service_checks", {
  id: serial("id").primaryKey(),
  service: varchar("service", { length: 80 }).notNull(),
  status: varchar("status", { length: 40 }).notNull(),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
});

export const users = mysqlTable(
  "users",
  {
    id: id(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerifiedAt: timestamp("email_verified_at"),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    status: varchar("status", { length: 40 }).$type<(typeof userStatuses)[number]>().notNull(),
    lastLoginAt: timestamp("last_login_at"),
    ...timestamps,
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    statusIdx: index("users_status_idx").on(table.status),
  }),
);

export const authAccounts = mysqlTable(
  "auth_accounts",
  {
    id: id(),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    provider: varchar("provider", { length: 40 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    ...timestamps,
  },
  (table) => ({
    userIdx: index("auth_accounts_user_id_idx").on(table.userId),
    providerIdx: uniqueIndex("auth_accounts_provider_account_idx").on(
      table.provider,
      table.providerAccountId,
    ),
  }),
);

export const workspaces = mysqlTable(
  "workspaces",
  {
    id: id(),
    type: varchar("type", { length: 40 }).$type<(typeof workspaceTypes)[number]>().notNull(),
    name: varchar("name", { length: 180 }).notNull(),
    status: varchar("status", { length: 40 }).$type<(typeof workspaceStatuses)[number]>().notNull(),
    ownerUserId: varchar("owner_user_id", { length: 36 }).notNull().references(() => users.id),
    ...timestamps,
  },
  (table) => ({
    ownerIdx: index("workspaces_owner_user_id_idx").on(table.ownerUserId),
    typeStatusIdx: index("workspaces_type_status_idx").on(table.type, table.status),
  }),
);

export const authTokens = mysqlTable(
  "auth_tokens",
  {
    id: id(),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    workspaceId: varchar("workspace_id", { length: 36 }).references(() => workspaces.id),
    tokenHash: varchar("token_hash", { length: 128 }).notNull(),
    type: varchar("type", { length: 40 }).notNull(),
    scopes: json("scopes").$type<string[]>().notNull(),
    expiresAt: timestamp("expires_at"),
    lastUsedAt: timestamp("last_used_at"),
    revokedAt: timestamp("revoked_at"),
    ...timestamps,
  },
  (table) => ({
    tokenHashIdx: uniqueIndex("auth_tokens_token_hash_idx").on(table.tokenHash),
    userIdx: index("auth_tokens_user_id_idx").on(table.userId),
    workspaceIdx: index("auth_tokens_workspace_id_idx").on(table.workspaceId),
  }),
);

export const workspaceMembers = mysqlTable(
  "workspace_members",
  {
    id: id(),
    workspaceId: varchar("workspace_id", { length: 36 }).notNull().references(() => workspaces.id),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    role: varchar("role", { length: 40 }).$type<(typeof workspaceRoles)[number]>().notNull(),
    status: varchar("status", { length: 40 }).notNull(),
    ...timestamps,
  },
  (table) => ({
    memberIdx: uniqueIndex("workspace_members_workspace_user_idx").on(
      table.workspaceId,
      table.userId,
    ),
    userIdx: index("workspace_members_user_id_idx").on(table.userId),
    roleStatusIdx: index("workspace_members_role_status_idx").on(table.role, table.status),
  }),
);

export const workspaceInvites = mysqlTable(
  "workspace_invites",
  {
    id: id(),
    workspaceId: varchar("workspace_id", { length: 36 }).notNull().references(() => workspaces.id),
    email: varchar("email", { length: 255 }).notNull(),
    role: varchar("role", { length: 40 }).$type<(typeof workspaceRoles)[number]>().notNull(),
    tokenHash: varchar("token_hash", { length: 128 }).notNull(),
    status: varchar("status", { length: 40 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    acceptedAt: timestamp("accepted_at"),
    ...timestamps,
  },
  (table) => ({
    tokenIdx: uniqueIndex("workspace_invites_token_hash_idx").on(table.tokenHash),
    workspaceEmailIdx: index("workspace_invites_workspace_email_idx").on(
      table.workspaceId,
      table.email,
    ),
  }),
);

export const brands = mysqlTable(
  "brands",
  {
    id: id(),
    workspaceId: varchar("workspace_id", { length: 36 }).notNull().references(() => workspaces.id),
    companyName: varchar("company_name", { length: 180 }).notNull(),
    website: varchar("website", { length: 255 }),
    industry: varchar("industry", { length: 120 }),
    targetIcp: text("target_icp"),
    defaultSpaceId: varchar("default_space_id", { length: 36 }),
    status: varchar("status", { length: 40 }).notNull(),
    ...timestamps,
  },
  (table) => ({
    workspaceIdx: uniqueIndex("brands_workspace_id_idx").on(table.workspaceId),
    statusIdx: index("brands_status_idx").on(table.status),
  }),
);

export const creators = mysqlTable(
  "creators",
  {
    id: id(),
    workspaceId: varchar("workspace_id", { length: 36 }).notNull().references(() => workspaces.id),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    status: varchar("status", { length: 40 }).notNull(),
    verificationStatus: varchar("verification_status", { length: 40 }).notNull(),
    ...timestamps,
  },
  (table) => ({
    workspaceIdx: uniqueIndex("creators_workspace_id_idx").on(table.workspaceId),
    userIdx: index("creators_user_id_idx").on(table.userId),
    statusIdx: index("creators_status_idx").on(table.status, table.verificationStatus),
  }),
);

export const creatorProfiles = mysqlTable(
  "creator_profiles",
  {
    id: id(),
    creatorId: varchar("creator_id", { length: 36 }).notNull().references(() => creators.id),
    publicSlug: varchar("public_slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    linkedinUrl: varchar("linkedin_url", { length: 255 }).notNull(),
    headline: varchar("headline", { length: 255 }),
    bio: text("bio"),
    country: varchar("country", { length: 80 }),
    topics: json("topics").$type<string[]>().notNull(),
    followerCount: int("follower_count").notNull(),
    pricePerPostAmount: decimal("price_per_post_amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    publicCardStatus: varchar("public_card_status", { length: 40 }).notNull(),
    publishedAt: timestamp("published_at"),
    ...timestamps,
  },
  (table) => ({
    slugIdx: uniqueIndex("creator_profiles_public_slug_idx").on(table.publicSlug),
    creatorIdx: uniqueIndex("creator_profiles_creator_id_idx").on(table.creatorId),
    countryIdx: index("creator_profiles_country_idx").on(table.country),
  }),
);

export const spaces = mysqlTable(
  "spaces",
  {
    id: id(),
    workspaceId: varchar("workspace_id", { length: 36 }).notNull().references(() => workspaces.id),
    brandId: varchar("brand_id", { length: 36 }).notNull().references(() => brands.id),
    name: varchar("name", { length: 160 }).notNull(),
    website: varchar("website", { length: 255 }),
    description: text("description"),
    industry: varchar("industry", { length: 120 }),
    targetIcp: text("target_icp"),
    targetLocations: json("target_locations").$type<string[]>().notNull(),
    defaultCtaUrl: varchar("default_cta_url", { length: 255 }),
    status: varchar("status", { length: 40 }).notNull(),
    ...timestamps,
  },
  (table) => ({
    workspaceIdx: index("spaces_workspace_id_idx").on(table.workspaceId),
    brandIdx: index("spaces_brand_id_idx").on(table.brandId),
    statusIdx: index("spaces_status_idx").on(table.status),
  }),
);

export const campaigns = mysqlTable(
  "campaigns",
  {
    id: id(),
    workspaceId: varchar("workspace_id", { length: 36 }).notNull().references(() => workspaces.id),
    brandId: varchar("brand_id", { length: 36 }).notNull().references(() => brands.id),
    spaceId: varchar("space_id", { length: 36 }).notNull().references(() => spaces.id),
    name: varchar("name", { length: 180 }).notNull(),
    goal: text("goal"),
    budgetAmount: decimal("budget_amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    targetIcp: text("target_icp"),
    targetRegions: json("target_regions").$type<string[]>().notNull(),
    ctaUrl: varchar("cta_url", { length: 255 }),
    status: varchar("status", { length: 40 }).notNull(),
    notes: text("notes"),
    startsAt: timestamp("starts_at"),
    endsAt: timestamp("ends_at"),
    ...timestamps,
  },
  (table) => ({
    workspaceStatusIdx: index("campaigns_workspace_status_idx").on(table.workspaceId, table.status),
    spaceIdx: index("campaigns_space_id_idx").on(table.spaceId),
  }),
);

export const collaborations = mysqlTable(
  "collaborations",
  {
    id: id(),
    workspaceId: varchar("workspace_id", { length: 36 }).notNull().references(() => workspaces.id),
    brandId: varchar("brand_id", { length: 36 }).notNull().references(() => brands.id),
    campaignId: varchar("campaign_id", { length: 36 }).notNull().references(() => campaigns.id),
    creatorId: varchar("creator_id", { length: 36 }).notNull().references(() => creators.id),
    deliverableNotes: text("deliverable_notes"),
    publishedPostUrl: varchar("published_post_url", { length: 255 }),
    priceAmount: decimal("price_amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    status: varchar("status", { length: 40 }).notNull(),
    dueAt: timestamp("due_at"),
    acceptedAt: timestamp("accepted_at"),
    completedAt: timestamp("completed_at"),
    ...timestamps,
  },
  (table) => ({
    workspaceStatusIdx: index("collaborations_workspace_status_idx").on(
      table.workspaceId,
      table.status,
    ),
    campaignIdx: index("collaborations_campaign_id_idx").on(table.campaignId),
    creatorIdx: index("collaborations_creator_id_idx").on(table.creatorId),
  }),
);

export const messageThreads = mysqlTable(
  "message_threads",
  {
    id: id(),
    workspaceId: varchar("workspace_id", { length: 36 }).notNull().references(() => workspaces.id),
    entityType: varchar("entity_type", { length: 80 }).notNull(),
    entityId: varchar("entity_id", { length: 36 }).notNull(),
    status: varchar("status", { length: 40 }).notNull(),
    ...timestamps,
  },
  (table) => ({
    workspaceEntityIdx: index("message_threads_workspace_entity_idx").on(
      table.workspaceId,
      table.entityType,
      table.entityId,
    ),
  }),
);

export const messages = mysqlTable(
  "messages",
  {
    id: id(),
    threadId: varchar("thread_id", { length: 36 }).notNull().references(() => messageThreads.id),
    senderUserId: varchar("sender_user_id", { length: 36 }).notNull().references(() => users.id),
    body: text("body").notNull(),
    attachments: json("attachments").$type<Array<{ name: string; url: string }>>().notNull(),
    ...timestamps,
  },
  (table) => ({
    threadIdx: index("messages_thread_id_idx").on(table.threadId),
    senderIdx: index("messages_sender_user_id_idx").on(table.senderUserId),
  }),
);

export const walletAccounts = mysqlTable(
  "wallet_accounts",
  {
    id: id(),
    workspaceId: varchar("workspace_id", { length: 36 }).notNull().references(() => workspaces.id),
    currency: varchar("currency", { length: 3 }).notNull(),
    status: varchar("status", { length: 40 }).notNull(),
    ...timestamps,
  },
  (table) => ({
    workspaceCurrencyIdx: uniqueIndex("wallet_accounts_workspace_currency_idx").on(
      table.workspaceId,
      table.currency,
    ),
  }),
);

export const walletLedgerEntries = mysqlTable(
  "wallet_ledger_entries",
  {
    id: id(),
    walletAccountId: varchar("wallet_account_id", { length: 36 })
      .notNull()
      .references(() => walletAccounts.id),
    type: varchar("type", { length: 40 }).notNull(),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    status: varchar("status", { length: 40 }).notNull(),
    sourceType: varchar("source_type", { length: 80 }),
    sourceId: varchar("source_id", { length: 36 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    walletIdx: index("wallet_ledger_entries_wallet_id_idx").on(table.walletAccountId),
    statusIdx: index("wallet_ledger_entries_status_idx").on(table.status),
  }),
);

export const adminReviewItems = mysqlTable(
  "admin_review_items",
  {
    id: id(),
    workspaceId: varchar("workspace_id", { length: 36 }).references(() => workspaces.id),
    subjectType: varchar("subject_type", { length: 80 }).notNull(),
    subjectId: varchar("subject_id", { length: 36 }).notNull(),
    status: varchar("status", { length: 40 }).$type<(typeof reviewStatuses)[number]>().notNull(),
    assigneeId: varchar("assignee_id", { length: 36 }).references(() => users.id),
    notes: text("notes"),
    ...timestamps,
  },
  (table) => ({
    statusIdx: index("admin_review_items_status_idx").on(table.status),
    assigneeIdx: index("admin_review_items_assignee_id_idx").on(table.assigneeId),
    subjectIdx: index("admin_review_items_subject_idx").on(table.subjectType, table.subjectId),
    workspaceIdx: index("admin_review_items_workspace_id_idx").on(table.workspaceId),
  }),
);

export const auditLogs = mysqlTable(
  "audit_logs",
  {
    id: id(),
    workspaceId: varchar("workspace_id", { length: 36 }).references(() => workspaces.id),
    actorUserId: varchar("actor_user_id", { length: 36 }).references(() => users.id),
    action: varchar("action", { length: 120 }).notNull(),
    entityType: varchar("entity_type", { length: 80 }).notNull(),
    entityId: varchar("entity_id", { length: 36 }).notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("audit_logs_workspace_id_idx").on(table.workspaceId),
    actorIdx: index("audit_logs_actor_user_id_idx").on(table.actorUserId),
    entityIdx: index("audit_logs_entity_idx").on(table.entityType, table.entityId),
  }),
);
