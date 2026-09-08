import { NextResponse, type NextRequest } from "next/server";
import { clearPrototypeSession, wantsJson } from "@/lib/auth-onboarding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const response = wantsJson(request)
    ? NextResponse.json({ status: "logged_out" })
    : NextResponse.redirect(new URL("/login", request.url), { status: 303 });

  clearPrototypeSession(response);
  return response;
}
