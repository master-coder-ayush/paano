import { NextResponse, type NextRequest } from "next/server";
import {
  redirectOrJson,
  requestPayload,
  validateBrandOnboarding,
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
  const { values, errors } = validateBrandOnboarding(data);

  if (Object.keys(errors).length > 0) {
    return validationResponse(request, errors, "/onboarding/brand");
  }

  return redirectOrJson(request, "/brand?as=brand", {
    user: {
      status: "active",
    },
    onboarding: {
      selectedRole: "brand",
      status: "complete",
      currentStep: "complete",
    },
    workspace: {
      id: "workspace_pending_persistence",
      type: "brand",
      name: values.companyName,
      status: "active",
    },
    brand: {
      id: "brand_pending_persistence",
      companyName: values.companyName,
      website: values.website,
      industry: values.industry,
      targetIcp: values.targetIcp,
      status: "active",
    },
    notification: {
      type: "onboarding_completed",
      status: "unread",
    },
  });
}
