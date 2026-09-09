import { randomBytes, randomUUID } from "node:crypto";
import { getCampaign, listSpaces } from "@/lib/brand-workspace";
import { getCollaboration } from "@/lib/collaborations";

export type TrackingLink = {
  id: string;
  workspaceId: string;
  spaceId: string;
  campaignId: string;
  creatorId: string;
  collaborationId: string;
  publishedPostId?: string;
  destinationUrl: string;
  token: string;
  status: "active" | "disabled" | "expired" | "invalid";
  createdAt: string;
  clicks: number;
};
export type TrackingClick = TrackingLink & {
  clickedAt: string;
  referrer?: string;
  device: string;
  browser: string;
  isBot: boolean;
  utm: Record<string, string>;
};
const links: TrackingLink[] = [
  {
    id: "track_demo",
    workspaceId: "workspace_brand_demo",
    spaceId: "space_acme_demo",
    campaignId: "campaign_launch_demo",
    creatorId: "creator_arjun",
    collaborationId: "collab_launch_arjun",
    publishedPostId: "post_demo",
    destinationUrl:
      "https://acme.dev/developer-tools?utm_source=paano&utm_medium=creator",
    token: "demo-launch-arjun",
    status: "active",
    createdAt: "2026-09-08T09:00:00.000Z",
    clicks: 12,
  },
];
const clicks: TrackingClick[] = [];
export function listTrackingLinks(workspaceId: string) {
  return links.filter((l) => l.workspaceId === workspaceId);
}
export function getTrackingLink(token: string) {
  return links.find((l) => l.token === token);
}
export function listTrackingClicks(workspaceId: string) {
  return clicks.filter((c) => c.workspaceId === workspaceId);
}
export function createTrackingLink(input: {
  workspaceId: string;
  collaborationId: string;
  destinationUrl: string;
  publishedPostId?: string;
}) {
  const collaboration = getCollaboration(input.collaborationId);
  const campaign =
    collaboration && getCampaign(input.workspaceId, collaboration.campaignId);
  const space =
    campaign &&
    listSpaces(input.workspaceId).find((s) => s.id === campaign.spaceId);
  if (
    !collaboration ||
    !campaign ||
    !space ||
    !/^https?:\/\//i.test(input.destinationUrl)
  )
    return { error: "invalid" as const };
  if (
    links.some(
      (l) =>
        l.workspaceId === input.workspaceId &&
        l.collaborationId === input.collaborationId &&
        l.status === "active",
    )
  )
    return { error: "duplicate" as const };
  const item: TrackingLink = {
    id: randomUUID(),
    workspaceId: input.workspaceId,
    spaceId: space.id,
    campaignId: campaign.id,
    creatorId: collaboration.creatorId,
    collaborationId: collaboration.id,
    publishedPostId: input.publishedPostId,
    destinationUrl: input.destinationUrl,
    token: randomBytes(12).toString("base64url"),
    status: "active",
    createdAt: new Date().toISOString(),
    clicks: 0,
  };
  links.push(item);
  return { item };
}
export function recordClick(link: TrackingLink, request: Request) {
  const url = new URL(request.url);
  const ua = request.headers.get("user-agent") ?? "";
  const isBot = /bot|crawler|spider|slurp/i.test(ua);
  const utm = Object.fromEntries(
    [...url.searchParams].filter(([k]) => k.startsWith("utm_")),
  );
  link.clicks += 1;
  clicks.push({
    ...link,
    clickedAt: new Date().toISOString(),
    referrer: request.headers.get("referer") ?? undefined,
    device: /mobile/i.test(ua) ? "mobile" : "desktop",
    browser: /chrome/i.test(ua)
      ? "Chrome"
      : /safari/i.test(ua)
        ? "Safari"
        : "Other",
    isBot,
    utm,
  });
}
