import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCreatorForWorkspace } from "@/lib/creator-marketplace";
import { userFromDemoKey, withAsParam } from "@/lib/workspace-foundation";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import type { SearchPageProps } from "@/lib/page-props";
export default async function CreatorCardPage({
  searchParams,
}: SearchPageProps) {
  const t = await getTranslations("CreatorCard");
  const user = userFromDemoKey((await searchParams).as);
  return (
    <WorkspaceGuard user={user} allowedTypes={["creator"]}>
      {({ workspace, user: activeUser }) => {
        const card = getCreatorForWorkspace(workspace.id);
        return (
          <WorkspaceShell
            user={activeUser}
            workspace={workspace}
            area="creator"
            title={t("title")}
            description={t("description")}
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <section className="border border-border bg-surface p-6">
                <h2 className="text-2xl font-semibold">
                  {card?.name ?? t("missing")}
                </h2>
                <p className="mt-2 text-primary/70">{card?.headline}</p>
                <p className="mt-5 leading-7">{card?.bio}</p>
                <p className="mt-4 text-sm">{card?.topics.join(" · ")}</p>
                <p className="mt-4 text-sm">
                  {card?.followerCount.toLocaleString()} {t("followers")} · $
                  {card?.price.toLocaleString()} {t("perPost")}
                </p>
              </section>
              <section className="border border-border bg-surface p-6">
                <h2 className="text-xl font-semibold">{t("preview")}</h2>
                <p className="mt-3 text-sm text-primary/70">
                  {t("previewBody")}
                </p>
                {card?.status === "published" && (
                  <Link
                    className="mt-5 inline-block underline"
                    href={`/creators/${card.slug}`}
                  >
                    {t("openPublic")}
                  </Link>
                )}
                <Link
                  className="mt-5 block underline"
                  href={withAsParam("/creator/settings/profile", activeUser)}
                >
                  {t("edit")}
                </Link>
              </section>
            </div>
          </WorkspaceShell>
        );
      }}
    </WorkspaceGuard>
  );
}
