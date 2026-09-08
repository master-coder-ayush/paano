import { type NextRequest } from "next/server";
import {
  redirectOrJson,
  requestPayload,
  setPrototypeSession,
  validateLogin,
  validationResponse,
} from "@/lib/auth-onboarding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { data } = await requestPayload(request);
  const { values, errors } = validateLogin(data);

  if (Object.keys(errors).length > 0) {
    return validationResponse(request, errors, "/login");
  }

  const response = redirectOrJson(
    request,
    "/dashboard",
    {
      user: {
        email: values.email,
        status: "active",
        lastLoginAt: new Date().toISOString(),
      },
      session: {
        type: "session",
        tokenStoredAs: "sha256_hash",
      },
    },
  );

  setPrototypeSession(response, values.email);
  return response;
}
