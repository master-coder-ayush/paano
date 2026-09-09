import { NextResponse, type NextRequest } from "next/server";
import { receivePixelEvent } from "@/lib/pixel";
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const site = String(body?.site ?? request.headers.get("x-paano-site") ?? "");
  const type = String(body?.event ?? body?.event_type ?? "pageview");
  const payload =
    (body?.properties && typeof body.properties === "object"
      ? body.properties
      : body) ?? {};
  const result = receivePixelEvent(
    site,
    type,
    payload,
    request,
    body?.debug === true,
  );
  if (result.error)
    return NextResponse.json({ error: result.error }, { status: 422 });
  return NextResponse.json({
    ok: true,
    eventId: result.event.id,
    status: result.event.status,
  });
}
