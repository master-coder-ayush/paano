import { getTranslations } from "next-intl/server";
import { EmptyState, WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { userFromDemoKey } from "@/lib/workspace-foundation";

export default async function AdminSupportPage({ searchParams }: PageProps<"/admin/support">) {
  const t = await getTranslations("AdminSupport");
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
          <EmptyState
            title={t("empty.title")}
            body={t("empty.body")}
          />
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
