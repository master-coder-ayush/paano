import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { walletEntries } from "@/lib/sprint7";
import { userFromDemoKey } from "@/lib/workspace-foundation";
export default async function AdminBillingPage({
  searchParams,
}: PageProps<"/admin/billing">) {
  const user = userFromDemoKey((await searchParams).as);
  return (
    <WorkspaceGuard user={user} allowedTypes={["admin"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="admin"
          title="Billing operations"
          description="Review manual wallet, invoice, and payment placeholders with an auditable next action."
        >
          <div className="border border-border bg-surface p-5">
            <h2 className="font-semibold">Wallet and payment queue</h2>
            <div className="mt-4 grid gap-3">
              {walletEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between border-t border-border pt-3 text-sm"
                >
                  <span>{entry.label}</span>
                  <span>
                    {entry.amount} · {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
