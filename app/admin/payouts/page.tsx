import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { payoutQueue } from "@/lib/sprint7";
import { userFromDemoKey } from "@/lib/workspace-foundation";
export default async function AdminPayoutsPage({
  searchParams,
}: PageProps<"/admin/payouts">) {
  const user = userFromDemoKey((await searchParams).as);
  return (
    <WorkspaceGuard user={user} allowedTypes={["admin"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="admin"
          title="Payouts"
          description="Manually review creator withdrawal requests and record payout outcomes."
        >
          <div className="border border-border bg-surface p-5">
            <h2 className="font-semibold">Withdrawal queue</h2>
            {payoutQueue.map((item) => (
              <div
                key={item.id}
                className="mt-4 flex flex-wrap justify-between gap-3 border-t border-border pt-3 text-sm"
              >
                <span>{item.creator}</span>
                <span>{item.amount}</span>
                <span className="capitalize">{item.status}</span>
              </div>
            ))}
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
