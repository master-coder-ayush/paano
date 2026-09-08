import { NextResponse, type NextRequest } from "next/server";
import {
  requestPayload,
  validateForgotPassword,
  validationResponse,
  wantsJson,
} from "@/lib/auth-onboarding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { data } = await requestPayload(request);
  const { values, errors } = validateForgotPassword(data);

  if (Object.keys(errors).length > 0) {
    return validationResponse(request, errors, "/forgot-password");
  }

  // TODO: When Amazon SES is set up, create an email_delivery_attempts row and
  // enqueue a password reset email. SES is intentionally not configured here.
  if (wantsJson(request)) {
    return NextResponse.json({
      status: "accepted",
      email: values.email,
      tokenStoredAs: "sha256_hash",
    });
  }

  const url = new URL("/forgot-password", request.url);
  url.searchParams.set("sent", "1");
  return NextResponse.redirect(url, { status: 303 });
}
