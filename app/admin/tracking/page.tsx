import { getTranslations } from "next-intl/server";
import {
  EmptyState,
  WorkspaceGuard,
  WorkspaceShell,
} from "@/components/workspace-shell";
import { listAttributions } from "@/lib/attribution";
import { listPixelEvents } from "@/lib/pixel";
import { listTrackingLinks } from "@/lib/tracking";
import { userFromDemoKey } from "@/lib/workspace-foundation";
export default async function AdminTracking({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = userFromDemoKey((await searchParams).as);
  const t = await getTranslations("AdminTracking");
  return (
    <WorkspaceGuard user={user} allowedTypes={["admin"]}>
      {({ workspace, user: active }) => {
        const scope = "workspace_brand_demo";
        const links = listTrackingLinks(scope);
        const events = listPixelEvents(scope);
        const attributions = listAttributions(scope);
        return (
          <WorkspaceShell
            user={active}
            workspace={workspace}
            area="admin"
            title={t("title")}
            description={t("description")}
          >
            <div className="grid gap-5 lg:grid-cols-3">
              <section className="border border-border bg-surface p-5">
                <h2 className="font-semibold">{t("links")}</h2>
                <p className="mt-2 text-3xl font-semibold">{links.length}</p>
                {links.length ? (
                  <div className="mt-4 grid gap-2 text-sm">
                    {links.map((link) => (
                      <div
                        key={link.id}
                        className="border-t border-border pt-2"
                      >
                        <div className="flex justify-between">
                          <span>{link.token}</span>
                          <span>{link.status}</span>
                        </div>
                        <p className="text-primary/60">
                          {link.clicks} {t("clicks")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm">{t("none")}</p>
                )}
              </section>
              <section className="border border-border bg-surface p-5">
                <h2 className="font-semibold">{t("events")}</h2>
                <p className="mt-2 text-3xl font-semibold">{events.length}</p>
                {events.length ? (
                  <div className="mt-4 grid gap-2 text-sm">
                    {events.slice(0, 8).map((event) => (
                      <div
                        key={event.id}
                        className="flex justify-between border-t border-border pt-2"
                      >
                        <span>{event.eventType}</span>
                        <span>{event.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm">{t("none")}</p>
                )}
              </section>
              <section className="border border-border bg-surface p-5">
                <h2 className="font-semibold">{t("attributions")}</h2>
                <p className="mt-2 text-3xl font-semibold">
                  {attributions.length}
                </p>
                {attributions.length ? (
                  <div className="mt-4 grid gap-2 text-sm">
                    {attributions.slice(0, 8).map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between border-t border-border pt-2"
                      >
                        <span>{item.status}</span>
                        <span>{item.confidence}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm">{t("none")}</p>
                )}
              </section>
            </div>
            <section className="mt-5">
              <EmptyState
                title={t("qaTitle")}
                body={t("qaBody")}
                action={t("qaAction")}
              />
            </section>
          </WorkspaceShell>
        );
      }}
    </WorkspaceGuard>
  );
}
