import { getTranslations } from "next-intl/server";
import {
  EmptyState,
  WorkspaceGuard,
  WorkspaceShell,
} from "@/components/workspace-shell";
import { listTrackingLinks } from "@/lib/tracking";
import { userFromDemoKey } from "@/lib/workspace-foundation";
export default async function TrackingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const user = userFromDemoKey(q.as);
  const t = await getTranslations("Tracking");
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: active }) => (
        <WorkspaceShell
          user={active}
          workspace={workspace}
          area="brand"
          title={t("title")}
          description={t("description")}
        >
          <div className="grid gap-3">
            {listTrackingLinks(workspace.id).map((link) => (
              <div
                key={link.id}
                className="border border-border bg-surface p-5"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{link.token}</h2>
                    <p className="mt-1 text-sm text-primary/70">
                      {link.destinationUrl}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase">
                    {t(`status.${link.status}`)}
                  </span>
                </div>
                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
                  <span>
                    {t("clicks")}: {link.clicks}
                  </span>
                  <span>
                    {t("campaign")}: {link.campaignId}
                  </span>
                  <span>
                    {t("creator")}: {link.creatorId}
                  </span>
                  <a
                    className="underline"
                    href={`/r/${link.token}`}
                    target="_blank"
                  >
                    {t("open")}
                  </a>
                </div>
              </div>
            ))}
            {listTrackingLinks(workspace.id).length === 0 && (
              <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
            )}
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
