import {
  EmptyState,
  WorkspaceGuard,
  WorkspaceShell,
} from "@/components/workspace-shell";
import { invoices, walletEntries } from "@/lib/sprint7";
import { userFromDemoKey } from "@/lib/workspace-foundation";

export default async function BrandBillingPage({
  searchParams,
}: PageProps<"/brand/billing">) {
  const user = userFromDemoKey((await searchParams).as);
  return (
    <WorkspaceGuard user={user} allowedTypes={["brand"]}>
      {({ workspace, user: activeUser }) => (
        <WorkspaceShell
          user={activeUser}
          workspace={workspace}
          area="brand"
          title="Billing"
          description="Manual wallet and invoice placeholders for V1. No payment provider is connected."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="border border-border bg-surface p-5">
              <p className="text-sm text-primary/70">Wallet balance</p>
              <p className="mt-2 text-3xl font-semibold">$1,750.00</p>
              <p className="mt-2 text-sm text-primary/70">
                USD · calculated from posted ledger entries
              </p>
            </div>
            <div className="border border-border bg-surface p-5 lg:col-span-2">
              <h2 className="font-semibold">Manual ledger</h2>
              <div className="mt-4 grid gap-3">
                {walletEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex justify-between border-t border-border pt-3 text-sm"
                  >
                    <span>{entry.label}</span>
                    <span className="font-semibold">
                      {entry.amount}{" "}
                      <span className="ml-2 text-primary/60">
                        {entry.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <section className="mt-5 border border-border bg-surface p-5">
            <h2 className="font-semibold">Invoices</h2>
            <div className="mt-4 grid gap-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-wrap justify-between gap-3 border-t border-border pt-3 text-sm"
                >
                  <span className="font-medium">{invoice.id}</span>
                  <span>{invoice.date}</span>
                  <span>{invoice.amount}</span>
                  <span className="text-primary/70">{invoice.status}</span>
                </div>
              ))}
            </div>
          </section>
          <div className="mt-5">
            <EmptyState
              title="Manual billing only"
              body="Top-ups, invoices, refunds, and card payments are placeholders in Version 1. Operations must reconcile them manually."
            />
          </div>
        </WorkspaceShell>
      )}
    </WorkspaceGuard>
  );
}
