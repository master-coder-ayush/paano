import { NextResponse, type NextRequest } from "next/server";
import {
  redirectOrJson,
  requestPayload,
  setPrototypeSession,
  validateRole,
  validationResponse,
  wantsJson,
} from "@/lib/auth-onboarding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!request.cookies.get("paano_session") && !wantsJson(request)) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }

  const { data } = await requestPayload(request);
  const { values, errors } = validateRole(data);

  if (Object.keys(errors).length > 0) {
    return validationResponse(request, errors, "/onboarding");
  }

  const nextPath = values.role === "brand" ? "/onboarding/brand" : "/onboarding/creator";
  const response = redirectOrJson(request, nextPath, {
    onboarding: {
      selectedRole: values.role,
      status: "in_progress",
      currentStep: `${values.role}_profile`,
    },
  });

  setPrototypeSession(response, request.cookies.get("paano_email")?.value ?? "new-user@example.com", values.role);
  return response;
}
