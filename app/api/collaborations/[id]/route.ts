import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import {
  getCollaboration,
  transitionCollaboration,
  submitDraft,
} from "@/lib/collaborations";
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = userFromBearer(request.headers.get("authorization"));
  const item = getCollaboration((await params).id);
  if (!user || !item)
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  const workspace = user.workspaces.find(
    (w) => w.id === item.workspaceId || w.id === item.creatorWorkspaceId,
  );
  if (
    !workspace ||
    authorizeWorkspace(user, [workspace.type as "brand" | "creator"]).state !==
      "allowed"
  )
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const b = await request.json().catch(() => null);
  const next = String(b?.status) as Parameters<
    typeof transitionCollaboration
  >[1];
  if (typeof b?.publishedPostUrl === "string") {
    if (!/^https:\/\/(www\.)?linkedin\.com\//i.test(b.publishedPostUrl.trim()) || item.status !== "approved")
      return NextResponse.json({ error: "validation_error" }, { status: 422 });
    item.publishedPostUrl = b.publishedPostUrl.trim();
  }
  const canChange =
    workspace.type === "brand"
      ? ["cancelled", "completed", "revision_requested", "approved"].includes(next)
      : ["accepted", "declined", "draft", "published"].includes(next);
  if (!canChange || !transitionCollaboration(item, next, user.id, typeof b?.note === "string" ? b.note.trim() : undefined))
    return NextResponse.json({ error: "invalid_transition" }, { status: 422 });
  return NextResponse.json({ collaboration: item });
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = userFromBearer(request.headers.get("authorization"));
  const item = getCollaboration((await params).id); const b = await request.json().catch(() => null);
  if (!user || !item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const owns = user.workspaces.some((w) => w.id === item.creatorWorkspaceId && w.type === "creator");
  if (!owns) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const result = submitDraft(item.id, user.id, String(b?.body ?? ""));
  if (result.error) return NextResponse.json({ error: "invalid_state" }, { status: 422 });
  return NextResponse.json(result, { status: 201 });
}
