import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, reviewStatuses, userFromBearer } from "@/lib/workspace-foundation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const validTransitions: Record<string, string[]> = {
  new: ["in_review", "archived"],
  in_review: ["approved", "rejected", "needs_changes", "archived"],
  needs_changes: ["in_review", "rejected", "archived"],
  approved: ["archived"],
  rejected: ["archived"],
  archived: [],
};

export async function PATCH(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const auth = authorizeWorkspace(user, ["admin"]);

  if (auth.state === "unauthenticated") {
    return NextResponse.json({ error: auth.state }, { status: 401 });
  }

  if (auth.state !== "allowed") {
    return NextResponse.json({ error: auth.state }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as
    | { id?: unknown; fromStatus?: unknown; toStatus?: unknown; notes?: unknown }
    | null;

  if (!body || typeof body.id !== "string" || body.id.length < 4) {
    return NextResponse.json(
      { error: "validation_error", fields: { id: "Review item ID is required." } },
      { status: 422 },
    );
  }

  if (
    typeof body.fromStatus !== "string" ||
    typeof body.toStatus !== "string" ||
    !reviewStatuses.includes(body.fromStatus as (typeof reviewStatuses)[number]) ||
    !reviewStatuses.includes(body.toStatus as (typeof reviewStatuses)[number])
  ) {
    return NextResponse.json(
      { error: "validation_error", fields: { status: "Known review statuses are required." } },
      { status: 422 },
    );
  }

  if (!validTransitions[body.fromStatus].includes(body.toStatus)) {
    return NextResponse.json(
      {
        error: "invalid_transition",
        message: `${body.fromStatus} cannot transition to ${body.toStatus}.`,
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    id: body.id,
    status: body.toStatus,
    notes: typeof body.notes === "string" ? body.notes : null,
    audited: true,
    actorUserId: user?.id,
  });
}
