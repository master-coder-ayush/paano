import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import { createTrackingLink, listTrackingLinks } from "@/lib/tracking";
function auth(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const result = authorizeWorkspace(user, ["brand"]);
  return result.state === "allowed" && result.workspace && user
    ? { user, workspace: result.workspace }
    : null;
}
export async function GET(request: NextRequest) {
  const a = auth(request);
  if (!a) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ links: listTrackingLinks(a.workspace.id) });
}
export async function POST(request: NextRequest) {
  const a = auth(request);
  if (!a) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const b = await request.json().catch(() => null);
  const result = createTrackingLink({
    workspaceId: a.workspace.id,
    collaborationId: String(b?.collaborationId ?? ""),
    destinationUrl: String(b?.destinationUrl ?? ""),
    publishedPostId: b?.publishedPostId,
  });
  if (result.error === "duplicate")
    return NextResponse.json({ error: "duplicate" }, { status: 409 });
  if (result.error)
    return NextResponse.json({ error: "validation_error" }, { status: 422 });
  return NextResponse.json({ link: result.item }, { status: 201 });
}
