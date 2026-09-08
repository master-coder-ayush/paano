import { getTranslations } from "next-intl/server";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { SpaceForm } from "@/components/brand-crud";
import { userFromDemoKey } from "@/lib/workspace-foundation";
export default async function NewSpace({
  searchParams,
}: PageProps<"/brand/spaces/new">) {
  const q = await searchParams;
  const user = userFromDemoKey(q.as);
  const t = await getTranslations("BrandSpaces");
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="brand"
          title={t("newTitle")}
          description={t("description")}
        >
          <SpaceForm token={activeUser.tokenLabel} />
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
