import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import { listResults } from "@/lib/results";
export async function GET(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const auth = authorizeWorkspace(user, ["brand"]);
  if (auth.state !== "allowed" || !auth.workspace)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const url = new URL(request.url);
  const rows = listResults(auth.workspace.id, {
    campaignId: url.searchParams.get("campaign") ?? undefined,
    creatorId: url.searchParams.get("creator") ?? undefined,
    postId: url.searchParams.get("post") ?? undefined,
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
  });
  const generated = new Date().toISOString();
  const header =
    "post_url,published_at,impressions,clicks,leads,signups,revenue,conversion_rate,event_type,generated_at";
  const csv = [
    header,
    ...rows.map((row) =>
      [
        row.postUrl,
        row.publishedAt,
        row.impressions,
        row.clicks,
        row.leads,
        row.signups,
        row.revenue,
        `${row.clicks ? ((row.signups / row.clicks) * 100).toFixed(2) : "0.00"}%`,
        url.searchParams.get("eventType") ?? "all",
        generated,
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(","),
    ),
  ].join("\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="paano-results-${generated.slice(0, 10)}.csv"`,
    },
  });
}
