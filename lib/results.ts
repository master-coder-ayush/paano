import { randomUUID } from "node:crypto";
import { getCollaboration, listCollaborations } from "@/lib/collaborations";

export type ResultMetric = {
  impressions: number;
  clicks: number;
  leads: number;
  signups: number;
  revenue: number;
};
export type ResultRow = ResultMetric & {
  id: string;
  workspaceId: string;
  campaignId: string;
  creatorId: string;
  postId: string;
  postUrl: string;
  publishedAt: string;
  source: "manual";
  recordedBy: string;
  recordedAt: string;
  status: "fresh" | "partial";
};

const rows: ResultRow[] = [
  {
    id: "result_launch_arjun",
    workspaceId: "workspace_brand_demo",
    campaignId: "campaign_launch_demo",
    creatorId: "creator_arjun",
    postId: "post_launch_arjun",
    postUrl: "https://www.linkedin.com/posts/arjun-mehta_launch",
    publishedAt: "2026-09-07",
    source: "manual",
    recordedBy: "user_brand_demo",
    recordedAt: "2026-09-08",
    status: "fresh",
    impressions: 12800,
    clicks: 640,
    leads: 48,
    signups: 19,
    revenue: 4750,
  },
];

export function listResults(
  workspaceId: string,
  filters: {
    campaignId?: string;
    creatorId?: string;
    postId?: string;
    from?: string;
    to?: string;
  } = {},
) {
  return rows.filter(
    (row) =>
      row.workspaceId === workspaceId &&
      (!filters.campaignId || row.campaignId === filters.campaignId) &&
      (!filters.creatorId || row.creatorId === filters.creatorId) &&
      (!filters.postId || row.postId === filters.postId) &&
      (!filters.from || row.publishedAt >= filters.from) &&
      (!filters.to || row.publishedAt <= filters.to),
  );
}

export function listCreatorResults(workspaceId: string) {
  const creatorIds = new Set(
    listCollaborations(workspaceId, "creator").map((item) => item.creatorId),
  );
  return rows.filter((row) => creatorIds.has(row.creatorId));
}

export function campaignsForResults(workspaceId: string) {
  return [
    ...new Set(
      rows
        .filter((row) => row.workspaceId === workspaceId)
        .map((row) => row.campaignId),
    ),
  ];
}

export function saveManualResult(
  input: Omit<ResultRow, "id" | "source" | "recordedAt" | "status">,
) {
  if (
    !input.postId ||
    Object.values(input).some(
      (value) =>
        typeof value === "number" && (!Number.isFinite(value) || value < 0),
    )
  )
    return { error: "invalid_metrics" as const };
  const existing = rows.find((row) => row.postId === input.postId);
  if (existing)
    Object.assign(existing, input, {
      source: "manual" as const,
      recordedAt: new Date().toISOString(),
      status: "fresh" as const,
    });
  else
    rows.push({
      ...input,
      id: randomUUID(),
      source: "manual",
      recordedAt: new Date().toISOString(),
      status: "fresh",
    });
  return { row: rows.find((row) => row.postId === input.postId)! };
}

export function resultTotals(items: ResultRow[]) {
  return items.reduce(
    (total, row) => ({
      impressions: total.impressions + row.impressions,
      clicks: total.clicks + row.clicks,
      leads: total.leads + row.leads,
      signups: total.signups + row.signups,
      revenue: total.revenue + row.revenue,
    }),
    { impressions: 0, clicks: 0, leads: 0, signups: 0, revenue: 0 },
  );
}

export function publishedPostForCollaboration(id: string) {
  const collaboration = getCollaboration(id);
  return collaboration?.publishedPostUrl
    ? rows.find((row) => row.postUrl === collaboration.publishedPostUrl)
    : undefined;
}
