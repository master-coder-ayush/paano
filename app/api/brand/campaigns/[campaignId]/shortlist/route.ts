import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import { getCampaign } from "@/lib/brand-workspace";
import {
  addToShortlist,
  listShortlist,
  removeFromShortlist,
} from "@/lib/shortlists";

async function access(request: NextRequest, campaignId: string) {
  const user = userFromBearer(request.headers.get("authorization"));
  const auth = authorizeWorkspace(user, ["brand"]);
  if (
    auth.state !== "allowed" ||
    !user ||
    !auth.workspace ||
    !getCampaign(auth.workspace.id, campaignId)
  )
    return null;
  return { user, workspace: auth.workspace };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const a = await access(request, (await params).campaignId);
  if (!a) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({
    shortlist: listShortlist(a.workspace.id, (await params).campaignId),
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const campaignId = (await params).campaignId;
  const a = await access(request, campaignId);
  if (!a) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body?.creatorId)
    return NextResponse.json({ error: "validation_error" }, { status: 422 });
  const result = addToShortlist({
    workspaceId: a.workspace.id,
    campaignId,
    creatorId: String(body.creatorId),
    addedBy: a.user.id,
    notes: String(body.notes ?? ""),
  });
  if (result.error === "duplicate")
    return NextResponse.json({ error: result.error }, { status: 409 });
  if (result.error)
    return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json(result, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const campaignId = (await params).campaignId;
  const a = await access(request, campaignId);
  if (!a) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const creatorId = new URL(request.url).searchParams.get("creatorId");
  if (!creatorId || !removeFromShortlist(a.workspace.id, campaignId, creatorId))
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
