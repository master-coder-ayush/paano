import { getTranslations } from "next-intl/server";
import {
  EmptyState,
  WorkspaceGuard,
  WorkspaceShell,
} from "@/components/workspace-shell";
import { userFromDemoKey } from "@/lib/workspace-foundation";

export default async function AdminSupportPage({
  searchParams,
}: PageProps<"/admin/support">) {
  const t = await getTranslations("AdminSupport");
  const user = userFromDemoKey((await searchParams).as);

  return (
    <WorkspaceGuard user={user} allowedTypes={["admin"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="admin"
          title={t("title")}
          description={t("description")}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {(["disputes", "cancellations", "withdrawals"] as const).map(
              (key) => (
                <section
                  className="border border-border bg-surface p-5"
                  key={key}
                >
                  <h2 className="font-semibold">{t(`queues.${key}.title`)}</h2>
                  <p className="mt-2 text-3xl font-semibold">
                    {t(`queues.${key}.count`)}
                  </p>
                  <p className="mt-2 text-sm text-primary/70">
                    {t(`queues.${key}.body`)}
                  </p>
                </section>
              ),
            )}
          </div>
          <div className="mt-5">
            <EmptyState title={t("empty.title")} body={t("empty.body")} />
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
