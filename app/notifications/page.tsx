import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { EmptyState, WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { userFromDemoKey, withAsParam } from "@/lib/workspace-foundation";
import type { SearchPageProps } from "@/lib/page-props";

const rowsByUser = {
  brand: [{ key: "brandOnboarding", href: "/brand" }],
  creator: [{ key: "creatorReview", href: "/creator" }],
  agency: [],
  admin: [{ key: "adminReview", href: "/admin/review" }],
} as const;

export default async function NotificationsPage({ searchParams }: SearchPageProps) {
  const t = await getTranslations("Notifications");
  const user = userFromDemoKey((await searchParams).as);

  return (
    <WorkspaceGuard user={user} allowedTypes={["brand", "creator", "brand_agency", "creator_agency", "admin"]}>
      {({ workspace, user: activeUser }) => {
        const area = workspace.type === "admin" ? "admin" : workspace.type === "creator" ? "creator" : workspace.type.includes("agency") ? "agency" : "brand";
        const rows = rowsByUser[activeUser.key];

        return (
          <WorkspaceShell
            user={activeUser}
            workspace={workspace}
            area={area}
            title={t("title")}
            description={t("description")}
          >
            {rows.length === 0 ? (
              <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
            ) : (
              <div className="overflow-hidden border border-border bg-surface">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-accent text-foreground">
                    <tr>
                      <th className="px-4 py-3 font-semibold">{t("headers.type")}</th>
                      <th className="px-4 py-3 font-semibold">{t("headers.status")}</th>
                      <th className="px-4 py-3 font-semibold">{t("headers.entity")}</th>
                      <th className="px-4 py-3 font-semibold">{t("headers.action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr className="border-t border-border" key={row.key}>
                        <td className="px-4 py-3">{t(`rows.${row.key}.type`)}</td>
                        <td className="px-4 py-3">{t(`rows.${row.key}.status`)}</td>
                        <td className="px-4 py-3">{t(`rows.${row.key}.entity`)}</td>
                        <td className="px-4 py-3">
                          <Link className="font-semibold text-primary" href={withAsParam(row.href, activeUser)}>
                            {t(`rows.${row.key}.action`)}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </WorkspaceShell>
        );
      }}
    </WorkspaceGuard>
  );
}
