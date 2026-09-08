import { getTranslations } from "next-intl/server";
import { EmptyState, StatGrid, WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { userFromDemoKey } from "@/lib/workspace-foundation";

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const t = await getTranslations("Admin");
  const user = userFromDemoKey((await searchParams).as);

  return (
    <WorkspaceGuard user={user} allowedTypes={["admin"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="admin"
          title={t("title")}
          description={t("description")}
        >
          <div className="grid gap-5">
            <StatGrid area="admin" />
            <section className="grid gap-4 lg:grid-cols-2">
              <EmptyState
                title={t("reviewEmpty.title")}
                body={t("reviewEmpty.body")}
                action={t("reviewEmpty.action")}
              />
              <EmptyState
                title={t("sensitiveEmpty.title")}
                body={t("sensitiveEmpty.body")}
              />
            </section>
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
