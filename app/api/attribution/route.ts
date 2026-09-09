import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import { funnel, listAttributions } from "@/lib/attribution";
export async function GET(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const auth = authorizeWorkspace(user, ["brand", "admin"]);
  if (auth.state !== "allowed" || !auth.workspace)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({
    funnel: funnel(auth.workspace.id),
    attributions: listAttributions(auth.workspace.id),
  });
}
