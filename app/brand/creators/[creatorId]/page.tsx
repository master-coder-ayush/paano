import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCreator } from "@/lib/creator-marketplace";
import { userFromDemoKey, withAsParam } from "@/lib/workspace-foundation";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";

export default async function BrandCreatorDetail({
  params,
  searchParams,
}: {
  params: Promise<{ creatorId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const t = await getTranslations("Marketplace");
  const creator = getCreator((await params).creatorId);
  const user = userFromDemoKey((await searchParams).as);
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
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
