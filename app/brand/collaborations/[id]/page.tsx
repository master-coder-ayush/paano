import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { getCollaboration } from "@/lib/collaborations";
import { userFromDemoKey } from "@/lib/workspace-foundation";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const c = getCollaboration((await params).id);
  if (!c) notFound();
  const user = userFromDemoKey((await searchParams).as);
  const t = await getTranslations("Collaborations");
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: active }) => (
        <WorkspaceShell
          user={active}
          workspace={workspace}
          area="brand"
          title={t("detailTitle")}
          description={t("detailDescription")}
        >
          <div className="border border-border bg-surface p-6">
            <p className="text-sm uppercase">{t(`status.${c.status}`)}</p>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="font-semibold">{t("price")}</dt>
                <dd>
                  {c.currency} {c.price.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="font-semibold">{t("due")}</dt>
                <dd>{c.dueAt}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold">{t("notes")}</dt>
                <dd>{c.notes}</dd>
              </div>
            </dl>
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
