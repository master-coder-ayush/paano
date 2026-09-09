import { getTranslations } from "next-intl/server";
import {
  EmptyState,
  WorkspaceGuard,
  WorkspaceShell,
} from "@/components/workspace-shell";
import { listCampaigns } from "@/lib/brand-workspace";
import { listResults, resultTotals } from "@/lib/results";
import { userFromDemoKey } from "@/lib/workspace-foundation";
import { funnel } from "@/lib/attribution";

export default async function BrandResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const user = userFromDemoKey(q.as);
  const t = await getTranslations("Results");
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: active }) => {
        const filters = {
          campaignId: typeof q.campaign === "string" ? q.campaign : undefined,
          creatorId: typeof q.creator === "string" ? q.creator : undefined,
          postId: typeof q.post === "string" ? q.post : undefined,
          from: typeof q.from === "string" ? q.from : undefined,
          to: typeof q.to === "string" ? q.to : undefined,
        };
        const items = listResults(workspace.id, filters);
        const totals = resultTotals(items);
        const campaigns = listCampaigns(workspace.id);
        const conversionFunnel = funnel(workspace.id);
        return (
          <WorkspaceShell
            user={active}
            workspace={workspace}
            area="brand"
            title={t("brandTitle")}
            description={t("brandDescription")}
          >
            <form
              className="grid gap-3 border border-border bg-surface p-4 md:grid-cols-5"
              method="get"
            >
              <input type="hidden" name="as" value={active.key} />
              <select
                name="campaign"
                defaultValue={filters.campaignId ?? ""}
                className="border border-border bg-background p-2 text-sm"
              >
                <option value="">{t("allCampaigns")}</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                name="creator"
                placeholder={t("creatorPlaceholder")}
                className="border border-border bg-background p-2 text-sm"
              />
              <input
                name="from"
                type="date"
                className="border border-border bg-background p-2 text-sm"
              />
              <input
                name="to"
                type="date"
                className="border border-border bg-background p-2 text-sm"
              />
              <button className="bg-primary px-4 py-2 text-sm font-semibold text-background">
                {t("filter")}
              </button>
            </form>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {(
                [
                  ["impressions", totals.impressions],
                  ["clicks", totals.clicks],
                  ["leads", totals.leads],
                  ["signups", totals.signups],
                  ["revenue", `$${totals.revenue.toLocaleString()}`],
                ] as const
              ).map(([key, value]) => (
                <div key={key} className="border border-border bg-surface p-4">
                  <p className="text-sm text-primary/70">
                    {t(`metrics.${key}`)}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <section className="mt-5 border border-border bg-surface p-5">
              <h2 className="font-semibold">{t("funnelTitle")}</h2>
              <p className="mt-1 text-sm text-primary/70">
                {t("funnelDescription")}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {(
                  [
                    ["clicks", conversionFunnel.clicks],
                    ["leads", conversionFunnel.leads],
                    ["signups", conversionFunnel.signups],
                    ["purchases", conversionFunnel.purchases],
                    ["attributed", conversionFunnel.attributed],
                  ] as const
                ).map(([key, value]) => (
                  <div key={key} className="border border-border p-4">
                    <p className="text-sm text-primary/70">
                      {t(`funnel.${key}`)}
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="mt-5 border border-border bg-surface p-5">
              <h2 className="font-semibold">{t("tableTitle")}</h2>
              {items.length ? (
                <div className="mt-4 grid gap-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-2 border-t border-border pt-3 text-sm md:grid-cols-5"
                    >
                      <span>{item.postUrl}</span>
                      <span>{item.publishedAt}</span>
                      <span>
                        {item.impressions.toLocaleString()}{" "}
                        {t("metrics.impressions")}
                      </span>
                      <span>
                        {item.clicks.toLocaleString()} {t("metrics.clicks")}
                      </span>
                      <span className="font-semibold">
                        ${item.revenue.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4">
                  <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
                </div>
              )}
            </section>
          </WorkspaceShell>
        );
      }}
    </WorkspaceGuard>
  );
}
