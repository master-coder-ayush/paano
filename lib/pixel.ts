import { createHash, randomBytes, randomUUID } from "node:crypto";
import { getSpace, listSpaces } from "@/lib/brand-workspace";

export type PixelKey = {
  id: string;
  workspaceId: string;
  spaceId: string;
  key: string;
  status: "active" | "revoked";
  createdAt: string;
  revokedAt?: string;
};
export type PixelEvent = {
  id: string;
  workspaceId: string;
  spaceId: string;
  siteKeyId: string;
  eventType: string;
  eventId: string;
  payload: Record<string, unknown>;
  receivedAt: string;
  status: "received" | "processed" | "duplicate" | "failed" | "ignored";
};
const keys: PixelKey[] = [
  {
    id: "pixel_key_demo",
    workspaceId: "workspace_brand_demo",
    spaceId: "space_acme_demo",
    key: "pn_6fdc4bb3f2fa4e56a953dfdd74f1aed3",
    status: "active",
    createdAt: "2026-09-08T09:00:00.000Z",
  },
];
const events: PixelEvent[] = [];
export function listPixelKeys(workspaceId: string) {
  return keys.filter((key) => key.workspaceId === workspaceId);
}
export function getPixelKey(key: string) {
  return keys.find((item) => item.key === key);
}
export function getPixelKeyForSpace(workspaceId: string, spaceId: string) {
  return keys.find(
    (item) =>
      item.workspaceId === workspaceId &&
      item.spaceId === spaceId &&
      item.status === "active",
  );
}
export function listPixelEvents(workspaceId: string) {
  return events
    .filter((event) => event.workspaceId === workspaceId)
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
}
export function ensurePixelKey(workspaceId: string, spaceId: string) {
  const existing = getPixelKeyForSpace(workspaceId, spaceId);
  if (existing) return existing;
  const item: PixelKey = {
    id: randomUUID(),
    workspaceId,
    spaceId,
    key: `pn_${randomBytes(16).toString("hex")}`,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  keys.push(item);
  return item;
}
export function regeneratePixelKey(workspaceId: string, spaceId: string) {
  const old = getPixelKeyForSpace(workspaceId, spaceId);
  if (old) {
    old.status = "revoked";
    old.revokedAt = new Date().toISOString();
  }
  return ensurePixelKey(workspaceId, spaceId);
}
export function receivePixelEvent(
  siteKey: string,
  eventType: string,
  payload: Record<string, unknown>,
  request: Request,
  debug = false,
) {
  const key = getPixelKey(siteKey);
  if (!key || key.status !== "active") return { error: "invalid_key" as const };
  const space = getSpace(key.workspaceId, key.spaceId);
  if (!space || space.status !== "active")
    return { error: "invalid_space" as const };
  const eventId =
    typeof payload.event_id === "string" ? payload.event_id : randomUUID();
  if (
    events.some(
      (event) => event.siteKeyId === key.id && event.eventId === eventId,
    )
  )
    return {
      event: {
        ...events.find(
          (event) => event.siteKeyId === key.id && event.eventId === eventId,
        )!,
        status: "duplicate" as const,
      },
    };
  const identity =
    typeof payload.email === "string"
      ? createHash("sha256")
          .update(payload.email.trim().toLowerCase())
          .digest("hex")
      : undefined;
  const event: PixelEvent = {
    id: randomUUID(),
    workspaceId: key.workspaceId,
    spaceId: key.spaceId,
    siteKeyId: key.id,
    eventType: eventType.trim(),
    eventId,
    payload: {
      ...payload,
      user_agent: request.headers.get("user-agent") ?? undefined,
    },
    receivedAt: new Date().toISOString(),
    status: debug ? "received" : "processed",
  };
  events.push(event);
  return { event, identityHash: identity };
}
export function pixelSnippet(key: string) {
  return `<script>\n  window.paano = window.paano || function () {\n    (window.paano.q = window.paano.q || []).push(arguments);\n  };\n</script>\n<script async src="/n.js" data-site="${key}"></script>`;
}
