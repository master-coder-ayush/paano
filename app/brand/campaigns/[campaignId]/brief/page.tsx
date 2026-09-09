import { getTranslations } from "next-intl/server";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { userFromDemoKey } from "@/lib/workspace-foundation";
import { getBrief, getCampaign } from "@/lib/brand-workspace";
import { BriefForm } from "@/components/brief-form";
export default async function BriefPage({
  params,
  searchParams,
}: PageProps<"/brand/campaigns/[campaignId]/brief">) {
  const p = await params;
  const q = await searchParams;
  const user = userFromDemoKey(q.as);
  const t = await getTranslations("BrandBrief");
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: activeUser }) => {
        const c = getCampaign(workspace.id, p.campaignId);
        const b = c && getBrief(workspace.id, c.id);
        return (
          <WorkspaceShell
            user={activeUser}
            workspace={workspace}
            area="brand"
            title={t("title")}
            description={t("description")}
          >
            {c ? (
              <BriefForm
                token={activeUser.tokenLabel}
                campaignId={c.id}
                initial={b}
              />
            ) : (
              <p>{t("notFound")}</p>
            )}
          </WorkspaceShell>
        );
      }}
    </WorkspaceGuard>
  );
}
