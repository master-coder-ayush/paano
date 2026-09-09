import { NextResponse, type NextRequest } from "next/server";
import { getTrackingLink, recordClick } from "@/lib/tracking";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const link = getTrackingLink(token);
  if (!link || link.status !== "active")
    return new NextResponse("Tracking link unavailable", { status: 404 });
  recordClick(link, request);
  return NextResponse.redirect(link.destinationUrl, 302);
}
