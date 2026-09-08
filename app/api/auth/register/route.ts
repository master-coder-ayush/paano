import { type NextRequest } from "next/server";
import {
  redirectOrJson,
  requestPayload,
  setPrototypeSession,
  validateRegister,
  validationResponse,
} from "@/lib/auth-onboarding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { data } = await requestPayload(request);
  const { values, errors } = validateRegister(data);

  if (Object.keys(errors).length > 0) {
    return validationResponse(request, errors, "/register");
  }

  const response = redirectOrJson(
    request,
    "/onboarding",
    {
      user: {
        id: "user_pending_persistence",
        name: values.name,
        email: values.email,
        status: "onboarding_required",
      },
      authAccount: {
        provider: "email",
        providerAccountId: values.email,
      },
      onboarding: {
        status: "not_started",
        currentStep: "role_selection",
      },
    },
    201,
  );

  setPrototypeSession(response, values.email);
  return response;
}
