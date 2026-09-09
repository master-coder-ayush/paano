import { randomUUID } from "node:crypto";
import { getCreator, type CreatorCard } from "@/lib/creator-marketplace";

export type ShortlistStatus = "draft" | "invited" | "removed" | "booked";
export type ShortlistCreator = {
  id: string;
  campaignId: string;
  workspaceId: string;
  creatorId: string;
  notes: string;
  rank: number;
  status: ShortlistStatus;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
};

const records: ShortlistCreator[] = [];

export function listShortlist(workspaceId: string, campaignId: string) {
  return records
    .filter(
      (item) =>
        item.workspaceId === workspaceId &&
        item.campaignId === campaignId &&
        item.status !== "removed",
    )
    .sort((a, b) => a.rank - b.rank)
    .map((item) => ({ ...item, creator: getCreator(item.creatorId) }))
    .filter((item): item is typeof item & { creator: CreatorCard } =>
      Boolean(item.creator),
    );
}

export function addToShortlist(input: {
  workspaceId: string;
  campaignId: string;
  creatorId: string;
  addedBy: string;
  notes?: string;
}) {
  const creator = getCreator(input.creatorId);
  if (
    !creator ||
    creator.status !== "published" ||
    creator.verification !== "verified"
  )
    return { error: "creator_unavailable" as const };
  const existing = records.find(
    (item) =>
      item.workspaceId === input.workspaceId &&
      item.campaignId === input.campaignId &&
      item.creatorId === input.creatorId &&
      item.status !== "removed",
  );
  if (existing) return { error: "duplicate" as const };
  const now = new Date().toISOString();
  const item: ShortlistCreator = {
    id: randomUUID(),
    ...input,
    notes: input.notes?.trim() ?? "",
    rank:
      records.filter(
        (r) =>
          r.workspaceId === input.workspaceId &&
          r.campaignId === input.campaignId,
      ).length + 1,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
  records.push(item);
  return { item };
}

export function removeFromShortlist(
  workspaceId: string,
  campaignId: string,
  creatorId: string,
) {
  const item = records.find(
    (r) =>
      r.workspaceId === workspaceId &&
      r.campaignId === campaignId &&
      r.creatorId === creatorId &&
      r.status !== "removed",
  );
  if (!item) return false;
  item.status = "removed";
  item.updatedAt = new Date().toISOString();
  return true;
}
