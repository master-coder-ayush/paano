import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  WorkspaceGuard,
  WorkspaceShell,
  EmptyState,
} from "@/components/workspace-shell";
import { listCollaborations } from "@/lib/collaborations";
import { userFromDemoKey, withAsParam } from "@/lib/workspace-foundation";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const user = userFromDemoKey(q.as);
  const t = await getTranslations("Collaborations");
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: active }) => (
        <WorkspaceShell
          user={active}
          workspace={workspace}
          area="brand"
          title={t("brandTitle")}
          description={t("brandDescription")}
        >
          <div className="grid gap-3">
            {listCollaborations(workspace.id, "brand").map((c) => (
              <Link
                key={c.id}
                href={withAsParam(`/brand/collaborations/${c.id}`, active)}
                className="border border-border bg-surface p-5"
              >
                <div className="flex justify-between">
                  <h2 className="font-semibold">{c.id}</h2>
                  <span className="text-xs font-semibold uppercase">
                    {t(`status.${c.status}`)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-primary/70">
                  {c.currency} {c.price.toLocaleString()} · {c.dueAt}
                </p>
              </Link>
            ))}
            {listCollaborations(workspace.id, "brand").length === 0 && (
              <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
            )}
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
