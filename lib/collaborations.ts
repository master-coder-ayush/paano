import { randomUUID } from "node:crypto";
import { getCampaign } from "@/lib/brand-workspace";
import { type CreatorCard } from "@/lib/creator-marketplace";

export const collaborationStatuses = [
  "invited",
  "accepted",
  "declined",
  "draft",
  "revision_requested",
  "approved",
  "published",
  "completed",
  "cancelled",
] as const;
export type CollaborationStatus = (typeof collaborationStatuses)[number];
export type Collaboration = {
  id: string;
  workspaceId: string;
  brandId: string;
  campaignId: string;
  creatorId: string;
  creatorWorkspaceId: string;
  price: number;
  currency: string;
  status: CollaborationStatus;
  dueAt: string;
  acceptedAt?: string;
  completedAt?: string;
  notes: string;
  publishedPostUrl?: string;
  reviewNotes?: string;
};
export type ContentDraft = {
  id: string;
  collaborationId: string;
  authorUserId: string;
  body: string;
  version: number;
  status:
    | "draft"
    | "submitted"
    | "changes_requested"
    | "approved"
    | "superseded";
  reviewNotes?: string;
  submittedAt?: string;
};
export type CollaborationActivity = {
  id: string;
  collaborationId: string;
  actorUserId: string;
  action: string;
  note?: string;
  createdAt: string;
};
export type Message = {
  id: string;
  threadId: string;
  senderUserId: string;
  body: string;
  createdAt: string;
};

const collaborations: Collaboration[] = [
  {
    id: "collab_launch_arjun",
    workspaceId: "workspace_brand_demo",
    brandId: "brand_acme_demo",
    campaignId: "campaign_launch_demo",
    creatorId: "creator_arjun",
    creatorWorkspaceId: "workspace_creator_demo",
    price: 750,
    currency: "USD",
    status: "invited",
    dueAt: "2026-10-15",
    notes: "One thoughtful LinkedIn post about the developer tools launch.",
  },
];
const messages: Message[] = [
  {
    id: "message_welcome",
    threadId: "thread_collab_launch_arjun",
    senderUserId: "user_brand_demo",
    body: "Hi Arjun — we would love your perspective on this launch.",
    createdAt: "2026-09-08T10:00:00.000Z",
  },
];
const invitationNotifications: Array<{
  id: string;
  recipientUserId: string;
  collaborationId: string;
  type: string;
}> = [];
const drafts: ContentDraft[] = [];
const activities: CollaborationActivity[] = [
  {
    id: "activity_invited",
    collaborationId: "collab_launch_arjun",
    actorUserId: "user_brand_demo",
    action: "invited",
    createdAt: "2026-09-08T09:00:00.000Z",
  },
];

export function listCollaborations(
  workspaceId: string,
  role: "brand" | "creator",
) {
  return collaborations.filter((c) =>
    role === "brand"
      ? c.workspaceId === workspaceId
      : c.creatorWorkspaceId === workspaceId,
  );
}
export function getCollaboration(id: string) {
  return collaborations.find((c) => c.id === id);
}
export function getThread(id: string) {
  return id === "thread_collab_launch_arjun"
    ? { id, collaborationId: "collab_launch_arjun" }
    : undefined;
}
export function listMessages(threadId: string) {
  return messages.filter((m) => m.threadId === threadId);
}
export function createCollaboration(input: {
  workspaceId: string;
  campaignId: string;
  creator: CreatorCard;
  price: number;
  dueAt: string;
  notes: string;
}) {
  if (
    collaborations.some(
      (c) =>
        c.workspaceId === input.workspaceId &&
        c.campaignId === input.campaignId &&
        c.creatorId === input.creator.id &&
        c.status !== "cancelled",
    )
  )
    return { error: "duplicate" as const };
  const campaign = getCampaign(input.workspaceId, input.campaignId);
  if (!campaign) return { error: "campaign" as const };
  const item = {
    id: randomUUID(),
    workspaceId: input.workspaceId,
    brandId: "brand_acme_demo",
    campaignId: campaign.id,
    creatorId: input.creator.id,
    creatorWorkspaceId: input.creator.workspaceId,
    price: input.price,
    currency: input.creator.currency,
    status: "invited" as const,
    dueAt: input.dueAt,
    notes: input.notes,
  };
  collaborations.push(item);
  invitationNotifications.push({
    id: randomUUID(),
    recipientUserId:
      input.creator.workspaceId === "workspace_creator_demo"
        ? "user_creator_demo"
        : input.creator.workspaceId,
    collaborationId: item.id,
    type: "collaboration_invited",
  });
  return { item };
}
export function listInvitationNotifications(recipientUserId: string) {
  return invitationNotifications.filter(
    (item) => item.recipientUserId === recipientUserId,
  );
}
export function listDrafts(collaborationId: string) {
  return drafts
    .filter((d) => d.collaborationId === collaborationId)
    .sort((a, b) => b.version - a.version);
}
export function listActivity(collaborationId: string) {
  return activities
    .filter((a) => a.collaborationId === collaborationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
export function submitDraft(
  collaborationId: string,
  authorUserId: string,
  body: string,
) {
  const item = getCollaboration(collaborationId);
  if (
    !item ||
    !body.trim() ||
    !["accepted", "draft", "revision_requested"].includes(item.status)
  )
    return { error: "invalid_state" as const };
  drafts
    .filter(
      (d) => d.collaborationId === collaborationId && d.status === "submitted",
    )
    .forEach((d) => {
      d.status = "superseded";
    });
  const draft = {
    id: randomUUID(),
    collaborationId,
    authorUserId,
    body: body.trim(),
    version: listDrafts(collaborationId).length + 1,
    status: "submitted" as const,
    submittedAt: new Date().toISOString(),
  };
  drafts.push(draft);
  item.status = "draft";
  recordActivity(item, authorUserId, "draft_submitted");
  return { draft };
}
function recordActivity(
  item: Collaboration,
  actorUserId: string,
  action: string,
  note?: string,
) {
  activities.push({
    id: randomUUID(),
    collaborationId: item.id,
    actorUserId,
    action,
    note,
    createdAt: new Date().toISOString(),
  });
}
export function transitionCollaboration(
  item: Collaboration,
  next: CollaborationStatus,
  actorUserId = "system",
  note?: string,
) {
  const allowed: Record<CollaborationStatus, CollaborationStatus[]> = {
    invited: ["accepted", "declined", "cancelled"],
    accepted: ["draft", "cancelled"],
    declined: [],
    draft: ["revision_requested", "approved", "cancelled"],
    revision_requested: ["draft", "cancelled"],
    approved: ["published", "cancelled"],
    published: ["completed"],
    completed: [],
    cancelled: [],
  };
  if (!allowed[item.status].includes(next)) return false;
  item.status = next;
  if (next === "accepted") item.acceptedAt = new Date().toISOString();
  if (next === "completed") item.completedAt = new Date().toISOString();
  if (note) item.reviewNotes = note;
  recordActivity(item, actorUserId, next, note);
  return true;
}
export function addMessage(
  threadId: string,
  senderUserId: string,
  body: string,
) {
  const message = {
    id: randomUUID(),
    threadId,
    senderUserId,
    body,
    createdAt: new Date().toISOString(),
  };
  messages.push(message);
  return message;
}
