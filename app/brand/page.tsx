import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  EmptyState,
  StatGrid,
  WorkspaceGuard,
  WorkspaceShell,
} from "@/components/workspace-shell";
import { listCampaigns, listSpaces } from "@/lib/brand-workspace";
import { userFromDemoKey } from "@/lib/workspace-foundation";

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
            <section className="grid gap-4 lg:grid-cols-2">
              <EmptyState
                title={t("empty.spaces.title")}
                body={t("empty.spaces.body")}
                action={t("empty.spaces.action")}
              />
              <EmptyState
                title={t("empty.campaigns.title")}
                body={t("empty.campaigns.body")}
              />
              <EmptyState
                title={t("empty.marketplace.title")}
                body={t("empty.marketplace.body")}
              />
              <EmptyState
                title={t("empty.billing.title")}
                body={t("empty.billing.body")}
              />
            </section>
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
