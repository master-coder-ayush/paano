"use client";
import { useState } from "react";
import type { CampaignBrief } from "@/lib/brand-workspace";
export function BriefForm({
  token,
  campaignId,
  initial,
}: {
  token: string;
  campaignId: string;
  initial?: CampaignBrief;
}) {
  const [message, setMessage] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch(`/api/brand/campaigns/${campaignId}/brief`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    setMessage(r.ok ? "Saved" : "Unable to save brief");
  }
  const fields = [
    "objectives",
    "keyMessages",
    "guidelines",
    "deliverables",
    "usageRights",
    "approvalRules",
    "ctaUrl",
  ];
  return (
    <form
      onSubmit={submit}
      className="grid gap-4 border border-border bg-surface p-5"
    >
      {fields.map((f) => (
        <label key={f} className="grid gap-1 text-sm font-medium">
          <span className="capitalize">
            {f.replace(/[A-Z]/g, (m) => ` ${m}`)}
          </span>
          <textarea
            name={f}
            defaultValue={(initial as any)?.[f] ?? ""}
            required
            className="min-h-20 border border-border bg-background px-3 py-2 font-normal"
          />
        </label>
      ))}
      <select
        name="status"
        defaultValue={initial?.status ?? "draft"}
        className="border border-border bg-background px-3 py-2"
      >
        <option value="draft">Draft</option>
        <option value="ready_for_review">Ready for review</option>
      </select>
      <button className="w-fit bg-primary px-4 py-2 text-sm font-semibold text-background">
        Save brief
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
