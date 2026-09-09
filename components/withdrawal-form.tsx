"use client";

import { useState } from "react";

export function WithdrawalForm() {
  const [requested, setRequested] = useState(false);
  return (
    <section className="mt-5 border border-border bg-surface p-5">
      <h2 className="font-semibold">Request a withdrawal</h2>
      <p className="mt-1 text-sm text-primary/70">
        Available earnings are reviewed and processed manually by Ops.
      </p>
      <form
        className="mt-4 flex flex-wrap gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          setRequested(true);
        }}
      >
        <input
          aria-label="Withdrawal amount"
          className="border border-border bg-background px-3 py-2 text-sm"
          defaultValue="500"
          inputMode="decimal"
          min="1"
          type="number"
        />
        <button
          className="bg-primary px-4 py-2 text-sm font-semibold text-background"
          type="submit"
        >
          Request withdrawal
        </button>
      </form>
      {requested ? (
        <p className="mt-3 text-sm text-primary/75">
          Withdrawal requested. Ops will review it manually.
        </p>
      ) : null}
    </section>
  );
}
