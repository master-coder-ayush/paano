import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import { createCollaboration, listCollaborations } from "@/lib/collaborations";
import { getCreator } from "@/lib/creator-marketplace";
function auth(request: NextRequest, types: ("brand" | "creator")[]) {
  const user = userFromBearer(request.headers.get("authorization"));
  const result = authorizeWorkspace(user, types);
  return result.state === "allowed" && result.workspace && user
    ? { user, workspace: result.workspace }
    : null;
}
export async function GET(request: NextRequest) {
  const a = auth(request, ["brand", "creator"]);
  if (!a) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({
    collaborations: listCollaborations(a.workspace.id, a.workspace.type as "brand" | "creator"),
  });
}
export async function POST(request: NextRequest) {
  const a = auth(request, ["brand"]);
  if (!a) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const b = await request.json().catch(() => null);
  const creator = getCreator(String(b?.creatorId ?? ""));
  const price = Number(b?.price);
  if (
    !creator ||
    !b?.campaignId ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !b?.dueAt
  )
    return NextResponse.json({ error: "validation_error" }, { status: 422 });
  const result = createCollaboration({
    workspaceId: a.workspace.id,
    campaignId: b.campaignId,
    creator,
    price,
    dueAt: b.dueAt,
    notes: String(b.notes ?? "").trim(),
  });
  if (result.error === "duplicate")
    return NextResponse.json({ error: "duplicate" }, { status: 409 });
  if (result.error)
    return NextResponse.json({ error: "invalid_campaign" }, { status: 422 });
  return NextResponse.json({ collaboration: result.item }, { status: 201 });
}
