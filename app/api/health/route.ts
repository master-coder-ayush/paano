import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/db/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const database = await checkDatabaseConnection();
  const status = database.connected ? 200 : 503;

  return NextResponse.json(
    {
      service: "running",
      database,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}
