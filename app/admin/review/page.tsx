import { getTranslations } from "next-intl/server";
import { EmptyState, WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { userFromDemoKey } from "@/lib/workspace-foundation";

const reviewRows = ["creator", "brand", "campaign"] as const;

export default async function AdminReviewPage({ searchParams }: PageProps<"/admin/review">) {
  const t = await getTranslations("AdminReview");
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
          <div className="overflow-hidden border border-border bg-surface">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-accent text-primary">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("headers.subject")}</th>
                  <th className="px-4 py-3 font-semibold">{t("headers.record")}</th>
                  <th className="px-4 py-3 font-semibold">{t("headers.status")}</th>
                  <th className="px-4 py-3 font-semibold">{t("headers.nextAction")}</th>
                </tr>
              </thead>
              <tbody>
                {reviewRows.map((row) => (
                  <tr key={row} className="border-t border-border">
                    <td className="px-4 py-3">{t(`rows.${row}.subject`)}</td>
                    <td className="px-4 py-3 font-medium">{t(`rows.${row}.record`)}</td>
                    <td className="px-4 py-3">{t(`rows.${row}.status`)}</td>
                    <td className="px-4 py-3 text-primary/75">{t(`rows.${row}.action`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5">
            <EmptyState
              title={t("empty.title")}
              body={t("empty.body")}
            />
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
