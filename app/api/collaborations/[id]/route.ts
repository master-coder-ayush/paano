import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import {
  getCollaboration,
  transitionCollaboration,
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
  const canChange =
    workspace.type === "brand"
      ? ["cancelled", "completed"].includes(next)
      : ["accepted", "declined"].includes(next);
  if (!canChange || !transitionCollaboration(item, next))
    return NextResponse.json({ error: "invalid_transition" }, { status: 422 });
  return NextResponse.json({ collaboration: item });
}
