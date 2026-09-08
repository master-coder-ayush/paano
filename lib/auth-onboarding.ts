import { createHash, randomUUID } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";

export type ValidationErrors = Record<string, string>;
export type RoleSelection = "brand" | "creator";

export const BRAND_INDUSTRIES = [
  "b2b_saas",
  "fintech",
  "healthcare",
  "ecommerce",
  "education",
  "professional_services",
  "developer_tools",
  "marketing_advertising",
] as const;

const registeredEmails = new Set([
  "maya@acme.dev",
  "arjun@example.com",
  "nina@northstar.example",
  "ops@paano.example",
]);

export function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function readNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return Number.NaN;
  }

  return Number(value);
}

export function passwordHash(password: string) {
  return createHash("sha256").update(`paano:${password}`).digest("hex");
}

export async function requestPayload(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return {
      data: ((await request.json().catch(() => ({}))) ?? {}) as Record<string, unknown>,
      source: "json" as const,
    };
  }

  const formData = await request.formData();
  return {
    data: Object.fromEntries(formData.entries()) as Record<string, unknown>,
    source: "form" as const,
  };
}

export function wantsJson(request: NextRequest) {
  return request.headers.get("accept")?.includes("application/json") ?? false;
}

export function validationResponse(
  request: NextRequest,
  errors: ValidationErrors,
  fallbackPath: string,
) {
  if (wantsJson(request)) {
    return NextResponse.json({ error: "validation_error", fields: errors }, { status: 422 });
  }

  const url = new URL(fallbackPath, request.url);
  url.searchParams.set("error", Object.values(errors)[0] ?? "validation_error");
  return NextResponse.redirect(url, { status: 303 });
}

export function redirectOrJson(
  request: NextRequest,
  redirectPath: string,
  body: Record<string, unknown>,
  status = 200,
) {
  if (wantsJson(request)) {
    return NextResponse.json(body, { status });
  }

  return NextResponse.redirect(new URL(redirectPath, request.url), { status: 303 });
}

export function validateRegister(data: Record<string, unknown>) {
  const name = readText(data.name);
  const email = normalizeEmail(data.email);
  const password = readText(data.password);
  const errors: ValidationErrors = {};

  if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (registeredEmails.has(email)) {
    errors.email = "An account with this email already exists.";
  }

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return { values: { name, email, passwordHash: passwordHash(password) }, errors };
}

export function validateLogin(data: Record<string, unknown>) {
  const email = normalizeEmail(data.email);
  const password = readText(data.password);
  const errors: ValidationErrors = {};

  if (!registeredEmails.has(email)) {
    errors.email = "No account exists for this email.";
  }

  if (password.length < 8) {
    errors.password = "Enter the password for this account.";
  }

  return { values: { email }, errors };
}

export function validateForgotPassword(data: Record<string, unknown>) {
  const email = normalizeEmail(data.email);
  const errors: ValidationErrors = {};

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  return { values: { email }, errors };
}

export function validateResetPassword(data: Record<string, unknown>) {
  const token = readText(data.token);
  const password = readText(data.password);
  const errors: ValidationErrors = {};

  if (token.length < 12) {
    errors.token = "Reset token is required.";
  }

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return { values: { token, passwordHash: passwordHash(password) }, errors };
}

export function validateRole(data: Record<string, unknown>) {
  const role = readText(data.role);
  const errors: ValidationErrors = {};

  if (role !== "brand" && role !== "creator") {
    errors.role = "Choose brand or creator.";
  }

  return { values: { role: role as RoleSelection }, errors };
}

export function validateBrandOnboarding(data: Record<string, unknown>) {
  const companyName = readText(data.companyName);
  const website = readText(data.website);
  const industry = readText(data.industry);
  const targetIcp = readText(data.targetIcp);
  const errors: ValidationErrors = {};

  if (companyName.length < 2) {
    errors.companyName = "Company name must be at least 2 characters.";
  }

  if (!/^https?:\/\/[^\s]+\.[^\s]+$/.test(website)) {
    errors.website = "Website must be a full URL.";
  }

  if (!(BRAND_INDUSTRIES as readonly string[]).includes(industry)) {
    errors.industry = "Industry is required.";
  }

  if (targetIcp.length < 10) {
    errors.targetIcp = "Target ICP must be at least 10 characters.";
  }

  return { values: { companyName, website, industry, targetIcp }, errors };
}

export function validateCreatorOnboarding(data: Record<string, unknown>) {
  const name = readText(data.name);
  const linkedinUrl = readText(data.linkedinUrl);
  const headline = readText(data.headline);
  const bio = readText(data.bio);
  const topics = readText(data.topics)
    .split(",")
    .map((topic) => topic.trim())
    .filter(Boolean);
  const country = readText(data.country);
  const followerCount = readNumber(data.followerCount);
  const pricePerPostAmount = readNumber(data.pricePerPostAmount);
  const errors: ValidationErrors = {};

  if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(linkedinUrl)) {
    errors.linkedinUrl = "LinkedIn URL must be a full linkedin.com URL.";
  }

  if (headline.length < 4) {
    errors.headline = "Headline is required.";
  }

  if (bio.length < 20) {
    errors.bio = "Bio must be at least 20 characters.";
  }

  if (topics.length === 0) {
    errors.topics = "Enter at least one topic.";
  }

  if (country.length < 2) {
    errors.country = "Country is required.";
  }

  if (!Number.isFinite(followerCount) || followerCount < 0) {
    errors.followerCount = "Follower count must be zero or higher.";
  }

  if (!Number.isFinite(pricePerPostAmount) || pricePerPostAmount <= 0) {
    errors.pricePerPostAmount = "Starting price must be greater than zero.";
  }

  return {
    values: {
      name,
      linkedinUrl,
      headline,
      bio,
      topics,
      country,
      followerCount,
      pricePerPostAmount,
      currency: "USD",
    },
    errors,
  };
}

export function buildSessionCookie(email: string) {
  return createHash("sha256").update(`session:${email}:${randomUUID()}`).digest("hex");
}

export function setPrototypeSession(response: NextResponse, email: string, selectedRole?: RoleSelection) {
  response.cookies.set("paano_session", buildSessionCookie(email), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  response.cookies.set("paano_email", email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  if (selectedRole) {
    response.cookies.set("paano_role", selectedRole, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }
}

export function clearPrototypeSession(response: NextResponse) {
  response.cookies.delete("paano_session");
  response.cookies.delete("paano_email");
  response.cookies.delete("paano_role");
}
