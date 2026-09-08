import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import { getSpace, listCampaigns, saveCampaign } from "@/lib/brand-workspace";
function auth(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const result = authorizeWorkspace(user, ["brand"]);
  return result.state === "allowed" && result.workspace
    ? result.workspace
    : null;
}
export async function GET(request: NextRequest) {
  const workspace = auth(request);
  if (!workspace)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({
    campaigns: listCampaigns(
      workspace.id,
      new URL(request.url).searchParams.get("status") ?? undefined,
    ),
  });
}
export async function POST(request: NextRequest) {
  const workspace = auth(request);
  if (!workspace)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const b = await request.json().catch(() => null);
  if (!b?.name?.trim() || !b?.spaceId || !getSpace(workspace.id, b.spaceId))
    return NextResponse.json(
      {
        error: "validation_error",
        fields: { name: "Name and a valid space are required." },
      },
      { status: 422 },
    );
  const campaign = saveCampaign(
    {
      name: b.name.trim(),
      spaceId: b.spaceId,
      goal: b.goal?.trim() ?? "",
      budget: b.budget ?? "0",
      currency: b.currency ?? "USD",
      icp: b.icp?.trim() ?? "",
      regions: b.regions?.trim() ?? "",
      ctaUrl: b.ctaUrl?.trim() ?? "",
      status: ["draft", "active", "completed"].includes(b.status)
        ? b.status
        : "draft",
      startsAt: b.startsAt ?? "",
      endsAt: b.endsAt ?? "",
    },
    workspace.id,
    b.id,
  );
  return NextResponse.json({ campaign }, { status: b.id ? 200 : 201 });
}
