import { NextResponse, type NextRequest } from "next/server";
import { authorizeWorkspace, userFromBearer } from "@/lib/workspace-foundation";
import { listCreatorResults, resultTotals } from "@/lib/results";
export async function GET(request: NextRequest) {
  const user = userFromBearer(request.headers.get("authorization"));
  const auth = authorizeWorkspace(user, ["creator"]);
  if (auth.state !== "allowed" || !auth.workspace)
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rows = listCreatorResults(auth.workspace.id);
  const totals = resultTotals(rows);
  return NextResponse.json({
    rows: rows.map(({ revenue: _revenue, ...safe }) => safe),
    totals: {
      impressions: totals.impressions,
      clicks: totals.clicks,
      leads: totals.leads,
      signups: totals.signups,
    },
  });
}
