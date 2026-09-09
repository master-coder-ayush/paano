import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCreator } from "@/lib/creator-marketplace";
import { userFromDemoKey, withAsParam } from "@/lib/workspace-foundation";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { listCampaigns } from "@/lib/brand-workspace";
import { addToShortlist } from "@/lib/shortlists";
import { Toast } from "@/components/toast";

export default async function BrandCreatorDetail({
  params,
  searchParams,
}: {
  params: Promise<{ creatorId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("Marketplace");
  const creator = getCreator((await params).creatorId);
  const query = await searchParams;
  const user = userFromDemoKey(query.as);
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="brand"
          title={creator?.name ?? t("notFound")}
          description={creator?.headline ?? t("notFoundBody")}
        >
          <Link
            href={withAsParam("/brand/creators", activeUser)}
            className="text-sm underline"
          >
            {t("back")}
          </Link>
          {creator && (
            <div className="mt-6 max-w-2xl border border-border bg-surface p-6">
              <p className="leading-7">{creator.bio}</p>
              <dl className="mt-6 grid gap-3 text-sm">
                <div>
                  <dt className="font-semibold">{t("linkedin")}</dt>
                  <dd>
                    <a className="underline" href={creator.linkedinUrl}>
                      {creator.linkedinUrl}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">{t("topicsLabel")}</dt>
                  <dd>{creator.topics.join(", ")}</dd>
                </div>
                <div>
                  <dt className="font-semibold">{t("audience")}</dt>
                  <dd>
                    {creator.followerCount.toLocaleString()} {t("followers")}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">{t("rate")}</dt>
                  <dd>
                    ${creator.price.toLocaleString()} {t("perPost")}
                  </dd>
                </div>
              </dl>
            </div>
          )}
          {creator && (
            <div className="mt-6 border border-border bg-surface p-5">
              <h2 className="text-lg font-semibold">{t("addToShortlist")}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {listCampaigns(workspace.id).map((campaign) => (
                  <form
                    key={campaign.id}
                    action={async () => {
                      "use server";
                      const result = addToShortlist({
                        workspaceId: workspace.id,
                        campaignId: campaign.id,
                        creatorId: creator.id,
                        addedBy: activeUser.id,
                      });
                      redirect(
                        `/brand/creators/${creator.id}?as=${activeUser.key}&toast=${result.error ? "error" : "added"}`,
                      );
                    }}
                  >
                    <button className="border border-border px-3 py-2 text-sm">
                      {campaign.name}
                    </button>
                  </form>
                ))}
              </div>
            </div>
          )}
          {query.toast === "added" && (
            <Toast message={t("shortlistAdded")} tone="success" />
          )}
          {query.toast === "error" && (
            <Toast message={t("shortlistError")} tone="error" />
          )}
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
