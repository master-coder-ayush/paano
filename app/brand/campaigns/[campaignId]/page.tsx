import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { userFromDemoKey } from "@/lib/workspace-foundation";
import { getCampaign, getBrief, listSpaces } from "@/lib/brand-workspace";
export default async function CampaignDetail({
  params,
  searchParams,
}: PageProps<"/brand/campaigns/[campaignId]">) {
  const p = await params;
  const q = await searchParams;
  const user = userFromDemoKey(q.as);
  const t = await getTranslations("BrandCampaigns");
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: activeUser }) => {
        const c = getCampaign(workspace.id, p.campaignId);
        if (!c)
          return (
            <WorkspaceShell
              user={activeUser}
              workspace={workspace}
              area="brand"
              title={t("notFound")}
              description={t("notFoundBody")}
            >
              <Link href={`/brand/campaigns?as=${activeUser.key}`}>
                {t("back")}
              </Link>
            </WorkspaceShell>
          );
        const brief = getBrief(workspace.id, c.id);
        return (
          <WorkspaceShell
            user={activeUser}
            workspace={workspace}
            area="brand"
            title={c.name}
            description={c.goal}
          >
            <div className="grid gap-5">
              <div className="border border-border bg-surface p-5">
                <p className="text-sm text-primary/70">
                  {c.status} · {c.currency} {c.budget}
                </p>
                <p className="mt-2">
                  {
                    listSpaces(workspace.id).find((s) => s.id === c.spaceId)
                      ?.name
                  }
                </p>
                <Link
                  className="mt-5 inline-block bg-primary px-4 py-2 text-sm font-semibold text-background"
                  href={`/brand/campaigns/${c.id}/brief?as=${activeUser.key}`}
                >
                  {brief ? t("viewBrief") : t("createBrief")}
                </Link>
              </div>
            </div>
          </WorkspaceShell>
        );
      }}
    </WorkspaceGuard>
  );
}
