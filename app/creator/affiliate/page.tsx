import {
  WorkspaceGuard,
  WorkspaceShell,
  EmptyState,
} from "@/components/workspace-shell";
import { referralAttributions, referralLinks } from "@/lib/sprint7";
import { userFromDemoKey } from "@/lib/workspace-foundation";

export default async function CreatorAffiliatePage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string | string[] }>;
}) {
  const user = userFromDemoKey((await searchParams).as);
  return (
    <WorkspaceGuard user={user} allowedTypes={["creator"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="creator"
          title="Affiliate"
          description="Share your recorded brand and creator referral links and follow reward windows."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {referralLinks.map((link) => (
              <div
                className="border border-border bg-surface p-5"
                key={link.id}
              >
                <p className="text-sm uppercase text-primary/60">
                  {link.type} referral
                </p>
                <p className="mt-2 font-semibold">
                  paano.example/r/{link.token}
                </p>
                <p className="mt-2 text-sm text-primary/70">
                  {link.referred} · {link.status} · reward {link.reward}
                </p>
              </div>
            ))}
          </div>
          <section className="mt-5 border border-border bg-surface p-5">
            <h2 className="font-semibold">Attributions and reward windows</h2>
            {referralAttributions.map((item) => (
              <div
                className="mt-4 flex flex-wrap justify-between gap-3 border-t border-border pt-3 text-sm"
                key={item.id}
              >
                <span>{item.entity}</span>
                <span>{item.window}</span>
                <span className="capitalize">{item.status}</span>
                <span className="font-semibold">{item.amount}</span>
              </div>
            ))}
          </section>
          {referralLinks.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                title="No referral links yet"
                body="Your unique links will appear once Ops creates them."
              />
            </div>
          ) : null}
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
