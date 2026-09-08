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
    <WorkspaceGuard user={user} allowedTypes={["creator"]}>
      {({ workspace, user: active }) => (
        <WorkspaceShell
          user={active}
          workspace={workspace}
          area="creator"
          title={t("detailTitle")}
          description={t("detailDescription")}
        >
          <div className="border border-border bg-surface p-6">
            <p className="text-sm uppercase">{t(`status.${c.status}`)}</p>
            <p className="mt-5">{c.notes}</p>
            <p className="mt-3 text-sm">
              {c.currency} {c.price.toLocaleString()} · {c.dueAt}
            </p>
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
