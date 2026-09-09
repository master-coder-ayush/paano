import { randomUUID } from "node:crypto";
import { listTrackingLinks, listTrackingClicks } from "@/lib/tracking";
import { listPixelEvents } from "@/lib/pixel";
import { listResults, resultTotals } from "@/lib/results";

export type AttributionRecord = {
  id: string;
  workspaceId: string;
  conversionEventId: string;
  trackingClickId?: string;
  campaignId?: string;
  creatorId?: string;
  publishedPostId?: string;
  attributionModel: "last_click";
  confidence: "high" | "medium" | "low";
  explanation: string;
  status:
    | "attributed"
    | "unattributed"
    | "duplicate"
    | "recalculated"
    | "disputed";
  createdAt: string;
};
const records: AttributionRecord[] = [];
export function recalculateAttribution(workspaceId: string) {
  const events = listPixelEvents(workspaceId).filter(
    (event) =>
      !event.debug &&
      ["lead", "signup", "trial_started", "purchase", "custom"].includes(
        event.eventType,
      ),
  );
  const clicks = listTrackingClicks(workspaceId).filter(
    (click) => !click.isBot,
  );
  for (const event of events) {
    if (
      records.some(
        (record) =>
          record.workspaceId === workspaceId &&
          record.conversionEventId === event.id,
      )
    )
      continue;
    const token =
      typeof event.payload.tracking_token === "string"
        ? event.payload.tracking_token
        : typeof event.payload.token === "string"
          ? event.payload.token
          : undefined;
    const link = token
      ? listTrackingLinks(workspaceId).find((item) => item.token === token)
      : undefined;
    const click = link
      ? clicks.find(
          (item) =>
            item.token === link.token &&
            new Date(item.clickedAt) <= new Date(event.receivedAt),
        )
      : undefined;
    records.push({
      id: randomUUID(),
      workspaceId,
      conversionEventId: event.id,
      trackingClickId: click?.id,
      campaignId: link?.campaignId,
      creatorId: link?.creatorId,
      publishedPostId: link?.publishedPostId,
      attributionModel: "last_click",
      confidence: click ? "high" : "low",
      explanation: click
        ? "Matched the latest non-bot click for the supplied tracking token."
        : "No valid non-bot click or tracking token was available.",
      status: click ? "attributed" : "unattributed",
      createdAt: new Date().toISOString(),
    });
  }
  return records.filter((record) => record.workspaceId === workspaceId);
}
export function listAttributions(workspaceId: string) {
  return recalculateAttribution(workspaceId);
}
export function funnel(workspaceId: string) {
  const links = listTrackingLinks(workspaceId);
  const clicks = listTrackingClicks(workspaceId).filter(
    (click) => !click.isBot,
  );
  const events = listPixelEvents(workspaceId).filter(
    (event) => !event.debug && event.status === "processed",
  );
  const manual = resultTotals(listResults(workspaceId));
  const hasLiveEvents = events.length > 0;
  const livePurchases = events.filter(
    (event) => event.eventType === "purchase",
  ).length;
  const liveAttributed = listAttributions(workspaceId).filter(
    (record) => record.status === "attributed",
  ).length;
  return {
    clicks: hasLiveEvents
      ? links.reduce((sum, link) => sum + link.clicks, 0) || clicks.length
      : manual.clicks,
    leads: hasLiveEvents
      ? events.filter((event) => event.eventType === "lead").length
      : manual.leads,
    signups: hasLiveEvents
      ? events.filter((event) =>
          ["signup", "trial_started"].includes(event.eventType),
        ).length
      : manual.signups,
    purchases: hasLiveEvents ? livePurchases : manual.revenue > 0 ? 1 : 0,
    attributed: hasLiveEvents ? liveAttributed : manual.revenue > 0 ? 1 : 0,
  };
}
