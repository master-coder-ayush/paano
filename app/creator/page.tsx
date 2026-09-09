import { getTranslations } from "next-intl/server";
import {
  EmptyState,
  StatGrid,
  WorkspaceGuard,
  WorkspaceShell,
} from "@/components/workspace-shell";
import { userFromDemoKey } from "@/lib/workspace-foundation";
import Link from "next/link";
import { getCreatorDashboard } from "@/lib/dashboard";
import { withAsParam } from "@/lib/workspace-foundation";

export default async function CreatorPage({
  searchParams,
}: PageProps<"/creator">) {
  const t = await getTranslations("Creator");
  const user = userFromDemoKey((await searchParams).as);

  return (
    <WorkspaceGuard user={user} allowedTypes={["creator"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="creator"
          title={t("title")}
          description={t("description")}
        >
          <div className="grid gap-5">
            <StatGrid area="creator" />
            {(() => {
              const dashboard = getCreatorDashboard(workspace.id);
              return (
                <section className="grid gap-4 md:grid-cols-3">
                  <Link
                    href={withAsParam("/creator/collaborations", activeUser)}
                    className="border border-border bg-surface p-5"
                  >
                    <p className="text-sm text-primary/70">
                      {t("dashboard.active")}
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                      {dashboard.activeCollaborations.length}
                    </p>
                  </Link>
                  <Link
                    href={withAsParam("/creator/collaborations", activeUser)}
                    className="border border-border bg-surface p-5"
                  >
                    <p className="text-sm text-primary/70">
                      {t("dashboard.requests")}
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                      {dashboard.pendingRequests.length}
                    </p>
                  </Link>
                  <Link
                    href={withAsParam("/creator/messages", activeUser)}
                    className="border border-border bg-surface p-5"
                  >
                    <p className="text-sm text-primary/70">
                      {t("dashboard.messages")}
                    </p>
                    <p className="mt-2 text-3xl font-semibold">1</p>
                  </Link>
                </section>
              );
            })()}
            <Link
              href={`/creator/card?as=${activeUser.key}`}
              className="border border-border bg-surface p-5"
            >
              <h2 className="font-semibold">{t("empty.card.title")}</h2>
              <p className="mt-2 text-sm text-primary/70">
                {t("empty.card.body")}
              </p>
            </Link>
            <section className="grid gap-4 lg:grid-cols-2">
              <EmptyState
                title={t("empty.card.title")}
                body={t("empty.card.body")}
              />
              <EmptyState
                title={t("empty.collaborations.title")}
                body={t("empty.collaborations.body")}
              />
              <EmptyState
                title={t("empty.earnings.title")}
                body={t("empty.earnings.body")}
              />
              <EmptyState
                title={t("empty.settings.title")}
                body={t("empty.settings.body")}
              />
            </section>
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
