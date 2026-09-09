import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import { ensurePixelKey, listPixelKeys, regeneratePixelKey } from "@/lib/pixel";
import { getSpace } from "@/lib/brand-workspace";
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
  return NextResponse.json({ keys: listPixelKeys(workspace.id) });
}
export async function POST(request: NextRequest) {
  const workspace = auth(request);
  if (!workspace)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const spaceId = String(body?.spaceId ?? "");
  if (!getSpace(workspace.id, spaceId))
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  const key = body?.regenerate
    ? regeneratePixelKey(workspace.id, spaceId)
    : ensurePixelKey(workspace.id, spaceId);
  return NextResponse.json({ key });
}
