import { createHash } from "node:crypto";

export type WorkspaceType = "brand" | "creator" | "brand_agency" | "creator_agency" | "admin";
export type WorkspaceRole =
  | "owner"
  | "admin"
  | "member"
  | "viewer"
  | "creator"
  | "agency_manager"
  | "platform_admin";

export type AuthState =
  | "unauthenticated"
  | "unauthorized"
  | "workspace_missing"
  | "role_missing"
  | "allowed";

export const reviewStatuses = [
  "new",
  "in_review",
  "approved",
  "rejected",
  "needs_changes",
  "archived",
] as const;

export type DemoWorkspace = {
  id: string;
  type: WorkspaceType;
  name: string;
  status: "active" | "suspended" | "archived";
  role: WorkspaceRole;
};

export type DemoUser = {
  id: string;
  key: "brand" | "creator" | "agency" | "admin";
  name: string;
  email: string;
  tokenLabel: string;
  tokenHash: string;
  workspaces: DemoWorkspace[];
};

const tokenHashes = {
  brand: "b0184bb8dae04bfcd8815bb7bc399d0742d14407a38649124e30cf27d09019b6",
  creator: "fa9fcf7163bb0c4c188160ac25477993c922263ae2adeddc311e3d431932281d",
  agency: "f7e72fb68756df536cbf6a2e3054130f4e6070dfd3f698ea6683ab279d3ebc28",
  admin: "e7fca49c20ca62deb525d35f8dc2edd0c4008df5b0bc6411d97b47f268f9245e",
};

export const demoUsers: DemoUser[] = [
  {
    id: "user_brand_demo",
    key: "brand",
    name: "Maya Patel",
    email: "maya@acme.dev",
    tokenLabel: "paano_demo_brand",
    tokenHash: tokenHashes.brand,
    workspaces: [
      {
        id: "workspace_brand_demo",
        type: "brand",
        name: "Acme GTM",
        status: "active",
        role: "owner",
      },
    ],
  },
  {
    id: "user_creator_demo",
    key: "creator",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    tokenLabel: "paano_demo_creator",
    tokenHash: tokenHashes.creator,
    workspaces: [
      {
        id: "workspace_creator_demo",
        type: "creator",
        name: "Arjun Mehta",
        status: "active",
        role: "creator",
      },
    ],
  },
  {
    id: "user_agency_demo",
    key: "agency",
    name: "Nina Rao",
    email: "nina@northstar.example",
    tokenLabel: "paano_demo_agency",
    tokenHash: tokenHashes.agency,
    workspaces: [
      {
        id: "workspace_agency_demo",
        type: "brand_agency",
        name: "Northstar Agency",
        status: "active",
        role: "agency_manager",
      },
    ],
  },
  {
    id: "user_admin_demo",
    key: "admin",
    name: "Ops Admin",
    email: "ops@paano.example",
    tokenLabel: "paano_demo_admin",
    tokenHash: tokenHashes.admin,
    workspaces: [
      {
        id: "workspace_admin_demo",
        type: "admin",
        name: "Paano Ops",
        status: "active",
        role: "platform_admin",
      },
    ],
  },
];

export const navigationByType: Record<WorkspaceType, Array<{ labelKey: string; href: string }>> = {
  brand: [
    { labelKey: "overview", href: "/brand" },
    { labelKey: "spaces", href: "/brand/spaces" },
    { labelKey: "campaigns", href: "/brand/campaigns" },
    { labelKey: "creators", href: "/brand/creators" },
    { labelKey: "collaborations", href: "/brand#collaborations" },
    { labelKey: "messages", href: "/brand#messages" },
    { labelKey: "billing", href: "/brand#billing" },
    { labelKey: "settings", href: "/brand#settings" },
  ],
  creator: [
    { labelKey: "overview", href: "/creator" },
    { labelKey: "myCard", href: "/creator/card" },
    { labelKey: "collaborations", href: "/creator#collaborations" },
    { labelKey: "earnings", href: "/creator#earnings" },
    { labelKey: "affiliate", href: "/creator#affiliate" },
    { labelKey: "messages", href: "/creator#messages" },
    { labelKey: "settings", href: "/creator/settings/profile" },
  ],
  brand_agency: [
    { labelKey: "overview", href: "/agency" },
    { labelKey: "clients", href: "/agency#clients" },
    { labelKey: "budgets", href: "/agency#budgets" },
    { labelKey: "reports", href: "/agency#reports" },
  ],
  creator_agency: [
    { labelKey: "overview", href: "/agency" },
    { labelKey: "roster", href: "/agency#roster" },
    { labelKey: "opportunities", href: "/agency#opportunities" },
    { labelKey: "earnings", href: "/agency#earnings" },
  ],
  admin: [
    { labelKey: "overview", href: "/admin" },
    { labelKey: "review", href: "/admin/review" },
    { labelKey: "support", href: "/admin/support" },
  ],
};

export const demoStats = {
  brand: [
    ["creatorsActivated", "3"],
    ["postsPublished", "1"],
    ["totalCampaigns", "2"],
    ["openCollaborations", "4"],
  ],
  creator: [
    ["profileCompletion", "78%"],
    ["activeCollaborations", "2"],
    ["pendingRequests", "1"],
    ["availableEarnings", "$0"],
  ],
  agency: [
    ["clientWorkspaces", "0"],
    ["openTasks", "0"],
    ["managedBudget", "$0"],
    ["reportsReady", "0"],
  ],
  admin: [
    ["creatorReviews", "2"],
    ["brandReviews", "1"],
    ["openSupportItems", "0"],
    ["auditedChanges", "3"],
  ],
};

export const demoNotificationCounts: Record<DemoUser["key"], number> = {
  brand: 1,
  creator: 1,
  agency: 0,
  admin: 2,
};

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function userFromBearer(authorization: string | null) {
  const [scheme, token] = authorization?.split(" ") ?? [];

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  const tokenHash = hashToken(token);
  return demoUsers.find((user) => user.tokenHash === tokenHash) ?? null;
}

export function userFromDemoKey(value: string | string[] | undefined) {
  const key = Array.isArray(value) ? value[0] : value;
  return demoUsers.find((user) => user.key === key) ?? null;
}

export function authorizeWorkspace(user: DemoUser | null, allowedTypes: WorkspaceType[]) {
  if (!user) {
    return { state: "unauthenticated" as AuthState, workspace: null };
  }

  const workspace = user.workspaces.find((item) => allowedTypes.includes(item.type));

  if (!workspace) {
    return { state: "workspace_missing" as AuthState, workspace: null };
  }

  if (workspace.status !== "active") {
    return { state: "unauthorized" as AuthState, workspace };
  }

  const hasAllowedRole =
    workspace.role === "owner" ||
    workspace.role === "admin" ||
    workspace.role === "platform_admin" ||
    workspace.role === "creator" ||
    workspace.role === "agency_manager";

  if (!hasAllowedRole) {
    return { state: "role_missing" as AuthState, workspace };
  }

  return { state: "allowed" as AuthState, workspace };
}

export function withAsParam(href: string, user: DemoUser) {
  const joiner = href.includes("?") ? "&" : "?";
  return `${href}${joiner}as=${user.key}`;
}
