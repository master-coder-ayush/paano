import { getTranslations } from "next-intl/server";
import { EmptyState, StatGrid, WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { userFromDemoKey } from "@/lib/workspace-foundation";

export default async function CreatorPage({ searchParams }: PageProps<"/creator">) {
  const t = await getTranslations("Creator");
  const user = userFromDemoKey((await searchParams).as);

  return (
    <WorkspaceGuard user={user} allowedTypes={["creator"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="creator"
          title={t("title")}
          description={t("description")}
        >
          <div className="grid gap-5">
            <StatGrid area="creator" />
            <section className="grid gap-4 lg:grid-cols-2">
              <EmptyState
                title={t("empty.card.title")}
                body={t("empty.card.body")}
              />
              <EmptyState
                title={t("empty.collaborations.title")}
                body={t("empty.collaborations.body")}
              />
              <EmptyState
                title={t("empty.earnings.title")}
                body={t("empty.earnings.body")}
              />
              <EmptyState
                title={t("empty.settings.title")}
                body={t("empty.settings.body")}
              />
            </section>
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
