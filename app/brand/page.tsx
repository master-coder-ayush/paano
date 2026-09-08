import { getTranslations } from "next-intl/server";
import { EmptyState, StatGrid, WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
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
