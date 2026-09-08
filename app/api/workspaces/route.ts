import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    workspaces: user.workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      type: workspace.type,
      status: workspace.status,
      role: workspace.role,
    })),
  });
}

export async function POST(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const auth = authorizeWorkspace(user, ["brand", "creator", "brand_agency", "creator_agency"]);

  if (auth.state === "unauthenticated") {
    return NextResponse.json({ error: auth.state }, { status: 401 });
  }

  if (auth.state !== "allowed") {
    return NextResponse.json({ error: auth.state }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { name?: unknown; type?: unknown } | null;

  if (!body || typeof body.name !== "string" || body.name.trim().length < 2) {
    return NextResponse.json(
      { error: "validation_error", fields: { name: "Name must be at least 2 characters." } },
      { status: 422 },
    );
  }

  if (body.type !== auth.workspace?.type) {
    return NextResponse.json(
      { error: "validation_error", fields: { type: "Workspace type must match active role." } },
      { status: 422 },
    );
  }

  return NextResponse.json(
    {
      id: "workspace_pending_persistence",
      name: body.name.trim(),
      type: body.type,
      status: "active",
      ownerUserId: user?.id,
    },
    { status: 201 },
  );
}
