import { NextRequest, NextResponse } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import {
  getCreatorForWorkspace,
  updateCreator,
} from "@/lib/creator-marketplace";

function auth(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const result = authorizeWorkspace(user, ["creator"]);
  return result.state === "allowed" && result.workspace
    ? result.workspace
    : null;
}

export async function GET(request: NextRequest) {
  const workspace = auth(request);
  if (!workspace)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({
    profile: getCreatorForWorkspace(workspace.id) ?? null,
  });
}

export async function PATCH(request: NextRequest) {
  const workspace = auth(request);
  if (!workspace)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "validation_error" }, { status: 422 });
  const allowed = [
    "linkedinUrl",
    "headline",
    "bio",
    "country",
    "topics",
    "followerCount",
    "price",
  ];
  const input = Object.fromEntries(
    Object.entries(body).filter(([key]) => allowed.includes(key)),
  );
  if (
    typeof input.linkedinUrl !== "string" ||
    !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(input.linkedinUrl)
  )
    return NextResponse.json(
      { error: "invalid_linkedin_url" },
      { status: 422 },
    );
  if (
    !Array.isArray(input.topics) ||
    input.topics.length === 0 ||
    Number(input.followerCount) < 0 ||
    Number(input.price) <= 0
  )
    return NextResponse.json(
      { error: "invalid_profile_values" },
      { status: 422 },
    );
  const profile = updateCreator(workspace.id, {
    ...input,
    followerCount: Number(input.followerCount),
    price: Number(input.price),
  } as never);
  return NextResponse.json({ profile });
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const body = Object.fromEntries(form.entries());
  body.topics = String(body.topics ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean) as unknown as string;
  return PATCH(
    new NextRequest(request.url, {
      method: "PATCH",
      headers: {
        authorization:
          request.headers.get("authorization") ??
          "content-type: application/json",
      },
      body: JSON.stringify(body),
    }),
  );
}
