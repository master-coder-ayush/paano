import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { StatGrid, WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { listCampaigns, listSpaces } from "@/lib/brand-workspace";
import { getBrandDashboard } from "@/lib/dashboard";
import { userFromDemoKey, withAsParam } from "@/lib/workspace-foundation";

export default async function BrandPage({ searchParams }: PageProps<"/brand">) {
  const t = await getTranslations("Brand");
  const user = userFromDemoKey((await searchParams).as);

  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="brand"
          title={t("title")}
          description={t("description")}
        >
          <div className="grid gap-5">
            <StatGrid area="brand" />
            {(() => {
              const dashboard = getBrandDashboard(workspace.id);
              return (
                <>
                  <section className="grid gap-4 md:grid-cols-3">
                    <Link
                      href={withAsParam("/brand/billing", activeUser)}
                      className="border border-border bg-surface p-5"
                    >
                      <p className="text-sm text-primary/70">
                        {t("wallet.title")}
                      </p>
                      <p className="mt-2 text-3xl font-semibold">
                        $
                        {dashboard.balance.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      <p className="mt-1 text-sm text-primary/70">
                        {t("wallet.body")}
                      </p>
                    </Link>
                    <Link
                      href={withAsParam("/brand/collaborations", activeUser)}
                      className="border border-border bg-surface p-5"
                    >
                      <p className="text-sm text-primary/70">
                        {t("actions.title")}
                      </p>
                      <p className="mt-2 text-3xl font-semibold">
                        {dashboard.pendingCreatorActions.length}
                      </p>
                      <p className="mt-1 text-sm text-primary/70">
                        {t("actions.body")}
                      </p>
                    </Link>
                    <Link
                      href={withAsParam("/brand/collaborations", activeUser)}
                      className="border border-border bg-surface p-5"
                    >
                      <p className="text-sm text-primary/70">
                        {t("approvals.title")}
                      </p>
                      <p className="mt-2 text-3xl font-semibold">
                        {dashboard.pendingApprovals.length}
                      </p>
                      <p className="mt-1 text-sm text-primary/70">
                        {t("approvals.body")}
                      </p>
                    </Link>
                  </section>
                  <section className="grid gap-4 lg:grid-cols-2">
                    <div className="border border-border bg-surface p-5">
                      <h2 className="font-semibold">{t("published.title")}</h2>
                      <p className="mt-2 text-sm text-primary/70">
                        {dashboard.published.length
                          ? t("published.ready")
                          : t("published.empty")}
                      </p>
                    </div>
                    <div className="border border-border bg-surface p-5">
                      <h2 className="font-semibold">{t("next.title")}</h2>
                      <div className="mt-3 grid gap-2 text-sm">
                        {["topUp", "bookCall", "findCreators"].map((key) => (
                          <Link
                            key={key}
                            href={withAsParam(
                              key === "topUp"
                                ? "/brand/billing"
                                : key === "findCreators"
                                  ? "/brand/creators"
                                  : "/help",
                              activeUser,
                            )}
                            className="underline"
                          >
                            {t(`next.${key}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              );
            })()}
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href={`/brand/spaces?as=${activeUser.key}`}
                className="border border-border bg-surface p-5"
              >
                <h2 className="font-semibold">{t("spaces.title")}</h2>
                <p className="mt-2 text-3xl font-semibold">
                  {listSpaces(workspace.id).length}
                </p>
                <p className="mt-1 text-sm text-primary/70">
                  {t("spaces.body")}
                </p>
              </Link>
              <Link
                href={`/brand/creators?as=${activeUser.key}`}
                className="border border-border bg-surface p-5"
              >
                <h2 className="font-semibold">{t("marketplace.title")}</h2>
                <p className="mt-2 text-sm text-primary/70">
                  {t("marketplace.body")}
                </p>
              </Link>
              <Link
                href={`/brand/campaigns?as=${activeUser.key}`}
                className="border border-border bg-surface p-5"
              >
                <h2 className="font-semibold">{t("campaigns.title")}</h2>
                <p className="mt-2 text-3xl font-semibold">
                  {listCampaigns(workspace.id).length}
                </p>
                <p className="mt-1 text-sm text-primary/70">
                  {t("campaigns.body")}
                </p>
              </Link>
            </div>
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
