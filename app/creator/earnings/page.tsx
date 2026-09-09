import { WorkspaceGuard, WorkspaceShell } from "@/components/workspace-shell";
import { earnings } from "@/lib/sprint7";
import { userFromDemoKey } from "@/lib/workspace-foundation";
import { WithdrawalForm } from "@/components/withdrawal-form";

export default async function CreatorEarningsPage({
  searchParams,
}: PageProps<"/creator/earnings">) {
  const user = userFromDemoKey((await searchParams).as);
  return (
    <WorkspaceGuard user={user} allowedTypes={["creator"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="creator"
          title="Earnings"
          description="Track collaboration earnings and request manual withdrawals."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {["pending", "available", "paid"].map((status) => (
              <div key={status} className="border border-border bg-surface p-5">
                <p className="text-sm capitalize text-primary/70">{status}</p>
                <p className="mt-2 text-2xl font-semibold">
                  {status === "pending"
                    ? "$750"
                    : status === "available"
                      ? "$500"
                      : "$350"}
                </p>
              </div>
            ))}
          </div>
          <section className="mt-5 border border-border bg-surface p-5">
            <h2 className="font-semibold">Ledger entries</h2>
            <div className="mt-4 grid gap-3">
              {earnings.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-wrap justify-between gap-3 border-t border-border pt-3 text-sm"
                >
                  <span>{entry.label}</span>
                  <span className="font-semibold">{entry.amount}</span>
                  <span className="capitalize text-primary/70">
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-border pt-4 text-sm text-primary/70">
              Withdrawals are manually processed. Available balance is not
              editable and is derived from posted ledger entries.
            </p>
          </section>
          <section className="mt-5 border border-border bg-surface p-5">
            <h2 className="font-semibold">Earnings trend</h2>
            <div className="mt-4 flex h-32 items-end gap-4 border-b border-border px-2">
              {[35, 58, 42, 76, 64, 92].map((height, index) => (
                <div
                  className="flex flex-1 flex-col items-center gap-2"
                  key={index}
                >
                  <div
                    className="w-full bg-accent"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-primary/60">{index + 1}</span>
                </div>
              ))}
            </div>
          </section>
          <WithdrawalForm />
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
