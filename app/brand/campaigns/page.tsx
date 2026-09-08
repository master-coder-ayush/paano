import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { StatusFilter } from "@/components/brand-crud";
import { userFromDemoKey } from "@/lib/workspace-foundation";
import { listCampaigns, listSpaces } from "@/lib/brand-workspace";
export default async function CampaignsPage({
  searchParams,
}: PageProps<"/brand/campaigns">) {
  const q = await searchParams;
  const user = userFromDemoKey(q.as);
  const status = Array.isArray(q.status) ? q.status[0] : q.status;
  const t = await getTranslations("BrandCampaigns");
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <StatusFilter current={status} token={activeUser.tokenLabel} />
            <Link
              href={`/brand/campaigns/new?as=${activeUser.key}`}
              className="bg-primary px-4 py-2 text-sm font-semibold text-background"
            >
              {t("new")}
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {listCampaigns(workspace.id, status).map((campaign) => (
              <Link
                key={campaign.id}
                href={`/brand/campaigns/${campaign.id}?as=${activeUser.key}`}
                className="border border-border bg-surface p-5"
              >
                <div className="flex justify-between gap-4">
                  <h2 className="font-semibold">{campaign.name}</h2>
                  <span className="text-xs font-semibold uppercase">
                    {campaign.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-primary/70">{campaign.goal}</p>
                <p className="mt-3 text-sm">
                  {campaign.currency} {campaign.budget} ·{" "}
                  {
                    listSpaces(workspace.id).find(
                      (s) => s.id === campaign.spaceId,
                    )?.name
                  }
                </p>
              </Link>
            ))}
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
