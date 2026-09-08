import { NextResponse, type NextRequest } from "next/server";
import {
  redirectOrJson,
  requestPayload,
  validateCreatorOnboarding,
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
  const { values, errors } = validateCreatorOnboarding(data);

  if (Object.keys(errors).length > 0) {
    return validationResponse(request, errors, "/onboarding/creator");
  }

  return redirectOrJson(request, "/creator?as=creator", {
    user: {
      status: "active",
    },
    onboarding: {
      selectedRole: "creator",
      status: "complete",
      currentStep: "complete",
    },
    workspace: {
      id: "workspace_pending_persistence",
      type: "creator",
      name: values.name,
      status: "active",
    },
    creator: {
      id: "creator_pending_persistence",
      status: "pending_review",
      verificationStatus: "pending",
    },
    profile: {
      id: "profile_pending_persistence",
      ...values,
      publicCardStatus: "draft",
    },
    notification: {
      type: "onboarding_completed",
      status: "unread",
    },
  });
}
