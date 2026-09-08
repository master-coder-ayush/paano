import { NextResponse, type NextRequest } from "next/server";
import { userFromBearer } from "@/lib/workspace-foundation";
import { addMessage, getThread, listMessages } from "@/lib/collaborations";
export async function GET(request: NextRequest) {
  if (!userFromBearer(request.headers.get("authorization")))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const thread = new URL(request.url).searchParams.get("threadId") ?? "";
  if (!getThread(thread))
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ messages: listMessages(thread) });
}
export async function POST(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const b = await request.json().catch(() => null);
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (
    !b?.threadId ||
    !getThread(b.threadId) ||
    typeof b.body !== "string" ||
    !b.body.trim()
  )
    return NextResponse.json({ error: "validation_error" }, { status: 422 });
  return NextResponse.json(
    { message: addMessage(b.threadId, user.id, b.body.trim()) },
    { status: 201 },
  );
}
