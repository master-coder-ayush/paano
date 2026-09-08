import { type NextRequest } from "next/server";
import {
  redirectOrJson,
  requestPayload,
  validateResetPassword,
  validationResponse,
} from "@/lib/auth-onboarding";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { data } = await requestPayload(request);
  const { values, errors } = validateResetPassword(data);

  if (Object.keys(errors).length > 0) {
    return validationResponse(request, errors, "/reset-password");
  }

  return redirectOrJson(request, "/login", {
    status: "password_reset",
    token: {
      hashOnly: true,
      preview: values.token.slice(0, 4),
    },
    passwordHash: values.passwordHash,
  });
}
