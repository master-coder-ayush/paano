import {
  authorizeWorkspace,
  type DemoUser,
  userFromBearer,
} from "@/lib/workspace-foundation";
import type { NextRequest } from "next/server";

export const walletEntries = [
  {
    id: "wallet-topup-001",
    label: "Manual top-up · INV-1001",
    amount: "+$2,500.00",
    status: "posted",
  },
  {
    id: "wallet-reserve-001",
    label: "Reserved for Developer tools launch",
    amount: "-$750.00",
    status: "reserved",
  },
];
export const invoices = [
  { id: "INV-1001", amount: "$2,500.00", status: "paid", date: "Sep 08, 2026" },
];
export const earnings = [
  {
    id: "earn-001",
    label: "Developer tools launch",
    amount: "$750.00",
    status: "pending",
  },
  {
    id: "earn-002",
    label: "Q3 GTM collaboration",
    amount: "$500.00",
    status: "available",
  },
  { id: "earn-003", label: "Spring launch", amount: "$350.00", status: "paid" },
];
export const payoutQueue = [
  {
    id: "payout-001",
    creator: "Arjun Mehta",
    amount: "$500.00",
    status: "requested",
  },
];
export const referralLinks = [
  {
    id: "ref-brand-001",
    type: "brand",
    token: "arjun-brand",
    status: "active",
    referred: "Acme GTM",
    reward: "$120.00",
  },
  {
    id: "ref-creator-001",
    type: "creator",
    token: "arjun-creator",
    status: "active",
    referred: "Mira Shah",
    reward: "$0.00",
  },
];
export const referralAttributions = [
  {
    id: "attr-001",
    link: "arjun-brand",
    entity: "Acme GTM",
    status: "earning",
    window: "Sep 08 – Dec 08, 2026",
    amount: "$120.00",
  },
  {
    id: "attr-002",
    link: "arjun-creator",
    entity: "Mira Shah",
    status: "created",
    window: "Not started",
    amount: "$0.00",
  },
];

export const demoNotifications = {
  brand: [
    { key: "invitation", href: "/brand/collaborations" },
    { key: "draftSubmitted", href: "/brand/collaborations" },
    { key: "publishedUrl", href: "/brand/collaborations" },
    { key: "completion", href: "/brand/collaborations" },
  ],
  creator: [
    { key: "invitation", href: "/creator/collaborations" },
    { key: "approval", href: "/creator/collaborations" },
    { key: "revisionRequest", href: "/creator/collaborations" },
    { key: "withdrawalRequest", href: "/creator/earnings" },
  ],
  agency: [],
  admin: [
    { key: "creatorProfile", href: "/admin/review" },
    { key: "adminReview", href: "/admin/review" },
    { key: "paymentManual", href: "/admin/billing" },
  ],
} as const;

export const adminReviewQueue = [
  "creatorProfile",
  "brandCampaign",
  "dispute",
  "cancellation",
  "withdrawal",
  "manualPayment",
] as const;

export function bearerAuth(
  request: NextRequest,
  types: Parameters<typeof authorizeWorkspace>[1],
) {
  const user = userFromBearer(request.headers.get("authorization"));
  const auth = authorizeWorkspace(user, types);
  return { user, auth };
}

export function demoAuth(
  user: DemoUser | null,
  types: Parameters<typeof authorizeWorkspace>[1],
) {
  return authorizeWorkspace(user, types);
}
