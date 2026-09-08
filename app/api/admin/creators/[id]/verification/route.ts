import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = userFromBearer(request.headers.get("authorization"));
  const auth = authorizeWorkspace(user, ["admin"]);
  if (auth.state === "unauthenticated")
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (auth.state !== "allowed" || !user)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => null)) as {
    verificationStatus?: unknown;
  } | null;
  if (
    !body ||
    !["verified", "unverified"].includes(String(body.verificationStatus))
  )
    return NextResponse.json(
      {
        error: "validation_error",
        fields: { verificationStatus: "Use verified or unverified." },
      },
      { status: 422 },
    );
  return NextResponse.json({
    creatorId: (await params).id,
    verificationStatus: body.verificationStatus,
    audited: true,
    actorUserId: user.id,
  });
}
