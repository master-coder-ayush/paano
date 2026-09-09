import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { referralAttributions } from "@/lib/sprint7";
import { userFromDemoKey } from "@/lib/workspace-foundation";

export default async function AdminReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string | string[] }>;
}) {
  const user = userFromDemoKey((await searchParams).as);
  return (
    <WorkspaceGuard user={user} allowedTypes={["admin"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="admin"
          title="Referrals"
          description="Review attribution and manually update referral reward status."
        >
          <section className="border border-border bg-surface p-5">
            <h2 className="font-semibold">Referral attribution queue</h2>
            {referralAttributions.map((item) => (
              <div
                className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-sm"
                key={item.id}
              >
                <span>{item.entity}</span>
                <span>{item.amount}</span>
                <span className="capitalize">{item.status}</span>
                <button
                  className="border border-border px-3 py-2 font-medium hover:bg-accent/30"
                  type="button"
                >
                  Mark payable
                </button>
              </div>
            ))}
          </section>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
