import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import { getBrief, getCampaign, saveBrief } from "@/lib/brand-workspace";
function workspace(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const r = authorizeWorkspace(user, ["brand"]);
  return r.state === "allowed" ? r.workspace : null;
}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const w = workspace(request);
  const { campaignId } = await params;
  if (!w) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!getCampaign(w.id, campaignId))
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ brief: getBrief(w.id, campaignId) ?? null });
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  const w = workspace(request);
  const { campaignId } = await params;
  if (!w) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!getCampaign(w.id, campaignId))
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  const body = await request.json().catch(() => null);
  const fields = [
    "objectives",
    "keyMessages",
    "guidelines",
    "deliverables",
    "usageRights",
    "approvalRules",
    "ctaUrl",
  ];
  if (
    !body ||
    fields.some((f) => typeof body[f] !== "string" || !body[f].trim())
  )
    return NextResponse.json({ error: "validation_error" }, { status: 422 });
  try {
    return NextResponse.json({
      brief: saveBrief(w.id, campaignId, {
        objectives: body.objectives.trim(),
        keyMessages: body.keyMessages.trim(),
        guidelines: body.guidelines.trim(),
        deliverables: body.deliverables.trim(),
        usageRights: body.usageRights.trim(),
        approvalRules: body.approvalRules.trim(),
        ctaUrl: body.ctaUrl.trim(),
        status:
          body.status === "ready_for_review" ? "ready_for_review" : "draft",
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "approved_brief_immutable" },
      { status: 409 },
    );
  }
}
