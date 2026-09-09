import { getTranslations } from "next-intl/server";
import {
  EmptyState,
  WorkspaceGuard,
  WorkspaceShell,
} from "@/components/workspace-shell";
import { listCreatorResults, resultTotals } from "@/lib/results";
import { userFromDemoKey } from "@/lib/workspace-foundation";

export default async function CreatorAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = userFromDemoKey((await searchParams).as);
  const t = await getTranslations("Analytics");
  return (
    <WorkspaceGuard user={user} allowedTypes={["creator"]}>
      {({ workspace, user: active }) => {
        const items = listCreatorResults(workspace.id);
        const totals = resultTotals(items);
        return (
          <WorkspaceShell
            user={active}
            workspace={workspace}
            area="creator"
            title={t("title")}
            description={t("description")}
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ["impressions", totals.impressions],
                  ["clicks", totals.clicks],
                  ["leads", totals.leads],
                  ["signups", totals.signups],
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
            <section className="mt-5">
              <div className="mb-4 border border-border bg-surface p-4 text-sm text-primary/70">
                {t("privacyNotice")}
              </div>
              {items.length ? (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="mb-3 border border-border bg-surface p-4"
                  >
                    <p className="font-semibold">{item.postUrl}</p>
                    <p className="mt-2 text-sm text-primary/70">
                      {item.publishedAt} · {item.clicks} {t("metrics.clicks")} ·{" "}
                      {item.leads} {t("metrics.leads")} Â· {item.signups}{" "}
                      {t("metrics.signups")}
                    </p>
                    <p className="mt-2 text-xs text-primary/60">
                      {t("pendingMetrics")}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
              )}
            </section>
          </WorkspaceShell>
        );
      }}
    </WorkspaceGuard>
  );
}
