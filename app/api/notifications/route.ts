import { NextResponse, type NextRequest } from "next/server";
import { userFromBearer } from "@/lib/workspace-foundation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const demoNotifications = {
  user_brand_demo: [
    {
      id: "notification_brand_onboarding",
      type: "onboarding_completed",
      status: "unread",
      entityType: "brand",
      entityId: "brand_acme_demo",
      href: "/brand?as=brand",
    },
  ],
  user_creator_demo: [
    {
      id: "notification_creator_review",
      type: "creator_profile_in_review",
      status: "unread",
      entityType: "creator_profile",
      entityId: "profile_arjun_demo",
      href: "/creator?as=creator",
    },
  ],
};

export async function GET(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  return NextResponse.json({
    notifications: demoNotifications[user.id as keyof typeof demoNotifications] ?? [],
  });
}
