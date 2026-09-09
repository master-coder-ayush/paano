import { getTranslations } from "next-intl/server";
import { PixelSetup } from "@/components/pixel-setup";
import {
  EmptyState,
  WorkspaceGuard,
  WorkspaceShell,
} from "@/components/workspace-shell";
import { listSpaces } from "@/lib/brand-workspace";
import { ensurePixelKey, listPixelEvents } from "@/lib/pixel";
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
        const debugEvents = listPixelEvents(workspace.id).filter(
          (event) => event.debug,
        );
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
                <section className="border border-border bg-surface p-5">
                  <h2 className="font-semibold">{t("debugTitle")}</h2>
                  <p className="mt-1 text-sm text-primary/70">
                    {t("debugBody")}
                  </p>
                  {debugEvents.length ? (
                    <div className="mt-4 grid gap-2">
                      {debugEvents.slice(0, 10).map((event) => (
                        <div
                          key={event.id}
                          className="flex justify-between gap-3 border border-border p-3 text-sm"
                        >
                          <span>{event.eventType}</span>
                          <span className="text-primary/60">
                            {event.receivedAt}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm">{t("debugEmpty")}</p>
                  )}
                </section>
                <section className="border border-border bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/60">{t("docsEyebrow")}</p>
                  <h2 className="mt-2 text-xl font-semibold">{t("docsTitle")}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-primary/70">{t("docsIntro")}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {(["pageview", "lead", "signup", "trial_started", "purchase", "custom"] as const).map((event) => (
                      <div key={event} className="border border-border p-4">
                        <h3 className="font-semibold">{t(`events.${event}.title`)}</h3>
                        <p className="mt-2 text-sm leading-6 text-primary/70">{t(`events.${event}.body`)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-3 lg:grid-cols-2">
                    <div>
                      <h3 className="font-semibold">{t("implementationTitle")}</h3>
                      <p className="mt-2 text-sm leading-6 text-primary/70">{t("implementationBody")}</p>
                    </div>
                    <pre className="overflow-x-auto border border-border bg-background p-4 text-xs leading-6"><code>{`paano('track', 'signup', { email: 'person@example.com' });\npaano('track', 'purchase', { value: 49, order_id: 'order_123' });`}</code></pre>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-primary/60">{t("debugHelp")}</p>
                </section>
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
