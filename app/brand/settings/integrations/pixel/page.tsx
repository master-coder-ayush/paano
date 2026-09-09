import { getTranslations } from "next-intl/server";
import { PixelSetup } from "@/components/pixel-setup";
import {
  EmptyState,
  WorkspaceGuard,
  WorkspaceShell,
} from "@/components/workspace-shell";
import { listSpaces } from "@/lib/brand-workspace";
import { ensurePixelKey } from "@/lib/pixel";
import { userFromDemoKey } from "@/lib/workspace-foundation";
export default async function PixelSettings({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const user = userFromDemoKey(q.as);
  const t = await getTranslations("Pixel");
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: active }) => {
        const spaces = listSpaces(workspace.id);
        return (
          <WorkspaceShell
            user={active}
            workspace={workspace}
            area="brand"
            title={t("title")}
            description={t("description")}
          >
            {spaces.length ? (
              <div className="grid gap-5">
                {spaces.map((space) => {
                  const key = ensurePixelKey(workspace.id, space.id);
                  return (
                    <section
                      key={space.id}
                      className="border border-border bg-surface p-5"
                    >
                      <h2 className="text-lg font-semibold">{space.name}</h2>
                      <p className="mt-1 text-sm text-primary/70">
                        {t("installOn", { website: space.website })}
                      </p>
                      <div className="mt-4">
                        <PixelSetup
                          token={active.tokenLabel}
                          spaceId={space.id}
                          initialKey={key.key}
                          labels={{
                            copy: t("copy"),
                            copied: t("copied"),
                            regenerate: t("regenerate"),
                            warning: t("warning"),
                            saved: t("saved"),
                          }}
                        />
                      </div>
                    </section>
                  );
                })}
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
