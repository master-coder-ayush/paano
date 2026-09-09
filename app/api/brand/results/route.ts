import { NextRequest, NextResponse } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import { saveManualResult } from "@/lib/results";

export async function POST(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const auth = authorizeWorkspace(user, ["brand"]);
  if (auth.state === "unauthenticated")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (auth.state !== "allowed" || !user || !auth.workspace)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || body.workspaceId !== auth.workspace.id)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const result = saveManualResult({
    ...body,
    workspaceId: auth.workspace.id,
    recordedBy: user.id,
  });
  if ("error" in result) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result, { status: 201 });
}
