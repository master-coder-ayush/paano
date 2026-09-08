import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import { listSpaces, saveSpace } from "@/lib/brand-workspace";
function auth(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const result = authorizeWorkspace(user, ["brand"]);
  return result.state === "allowed" && result.workspace
    ? { user, workspace: result.workspace }
    : null;
}
export async function GET(request: NextRequest) {
  const a = auth(request);
  return a
    ? NextResponse.json({ spaces: listSpaces(a.workspace.id) })
    : NextResponse.json({ error: "forbidden" }, { status: 403 });
}
export async function POST(request: NextRequest) {
  const a = auth(request);
  if (!a) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body?.name?.trim())
    return NextResponse.json(
      { error: "validation_error", fields: { name: "Name is required." } },
      { status: 422 },
    );
  const space = saveSpace(
    {
      name: body.name.trim(),
      website: body.website?.trim() ?? "",
      description: body.description?.trim() ?? "",
      industry: body.industry?.trim() ?? "",
      icp: body.icp?.trim() ?? "",
      locations: body.locations?.trim() ?? "",
      ctaUrl: body.ctaUrl?.trim() ?? "",
      status: "active",
    },
    a.workspace.id,
    body.id,
  );
  return NextResponse.json({ space }, { status: body.id ? 200 : 201 });
}
