import { getTranslations } from "next-intl/server";
import { EmptyState, StatGrid, WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { userFromDemoKey } from "@/lib/workspace-foundation";

export default async function AgencyPage({ searchParams }: PageProps<"/agency">) {
  const t = await getTranslations("Agency");
  const user = userFromDemoKey((await searchParams).as);

  return (
    <WorkspaceGuard user={user} allowedTypes={["brand_agency", "creator_agency"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="agency"
          title={t("title")}
          description={t("description")}
        >
          <div className="grid gap-5">
            <StatGrid area="agency" />
            <EmptyState
              title={t("empty.title")}
              body={t("empty.body")}
              action={t("empty.action")}
            />
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
