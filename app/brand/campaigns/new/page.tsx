import { getTranslations } from "next-intl/server";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { CampaignForm } from "@/components/brand-crud";
import { userFromDemoKey } from "@/lib/workspace-foundation";
import { listSpaces } from "@/lib/brand-workspace";
export default async function NewCampaign({
  searchParams,
}: PageProps<"/brand/campaigns/new">) {
  const q = await searchParams;
  const user = userFromDemoKey(q.as);
  const t = await getTranslations("BrandCampaigns");
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
          <CampaignForm
            token={activeUser.tokenLabel}
            spaces={listSpaces(workspace.id)}
          />
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
