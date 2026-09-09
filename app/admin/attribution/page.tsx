import { getTranslations } from "next-intl/server";
import {
  EmptyState,
  WorkspaceGuard,
  WorkspaceShell,
} from "@/components/workspace-shell";
import { listAttributions } from "@/lib/attribution";
import { userFromDemoKey } from "@/lib/workspace-foundation";
export default async function AttributionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = userFromDemoKey((await searchParams).as);
  const t = await getTranslations("Attribution");
  return (
    <WorkspaceGuard user={user} allowedTypes={["admin"]}>
      {({ workspace, user: active }) => {
        const items = listAttributions("workspace_brand_demo");
        return (
          <WorkspaceShell
            user={active}
            workspace={workspace}
            area="admin"
            title={t("title")}
            description={t("description")}
          >
            {items.length ? (
              <div className="grid gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border border-border bg-surface p-5"
                  >
                    <div className="flex justify-between gap-3">
                      <span className="font-semibold">{item.status}</span>
                      <span className="text-sm text-primary/60">
                        {item.confidence}
                      </span>
                    </div>
                    <p className="mt-2 text-sm">{item.explanation}</p>
                    <p className="mt-3 text-xs text-primary/60">
                      {item.campaignId ?? t("unmatched")} ·{" "}
                      {item.creatorId ?? t("unknownCreator")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
            )}
          </WorkspaceShell>
        );
      }}
    </WorkspaceGuard>
  );
}
