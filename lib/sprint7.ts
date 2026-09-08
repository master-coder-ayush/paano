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
