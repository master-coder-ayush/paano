"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Link from "next/link";
import type { Campaign, Space } from "@/lib/brand-workspace";
export function SpaceForm({
  token,
  initial,
}: {
  token: string;
  initial?: Space;
}) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/brand/spaces", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, id: initial?.id }),
    });
    setSaved(res.ok);
    setError(res.ok ? "" : "Unable to save this space.");
  }
  return (
    <form
      onSubmit={submit}
      className="grid gap-4 border border-border bg-surface p-5 sm:grid-cols-2"
    >
      {[
        ["name", "Name"],
        ["website", "Website"],
        ["industry", "Industry"],
        ["locations", "Target locations"],
        ["icp", "Ideal customer profile"],
        ["ctaUrl", "Default CTA URL"],
      ].map(([key, label]) => (
        <label key={key} className="grid gap-1 text-sm font-medium">
          {label}
          <input
            name={key}
            defaultValue={(initial as any)?.[key] ?? ""}
            required={key === "name"}
            className="border border-border bg-background px-3 py-2 font-normal"
          />
        </label>
      ))}
      <label className="grid gap-1 text-sm font-medium sm:col-span-2">
        Description
        <textarea
          name="description"
          defaultValue={initial?.description ?? ""}
          className="border border-border bg-background px-3 py-2 font-normal"
        />
      </label>
      <button className="w-fit bg-primary px-4 py-2 text-sm font-semibold text-background">
        {initial ? "Save changes" : "Create space"}
      </button>
      {saved && <p className="text-sm text-green-700">Saved.</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
export function CampaignForm({
  token,
  spaces,
  initial,
}: {
  token: string;
  spaces: Space[];
  initial?: Campaign;
}) {
  const [saved, setSaved] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/brand/campaigns", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, id: initial?.id }),
    });
    setSaved(res.ok);
  }
  return (
    <form
      onSubmit={submit}
      className="grid gap-4 border border-border bg-surface p-5 sm:grid-cols-2"
    >
      {[
        ["name", "Campaign name"],
        ["goal", "Goal"],
        ["budget", "Budget amount"],
        ["currency", "Currency"],
        ["regions", "Target regions"],
        ["ctaUrl", "CTA URL"],
        ["startsAt", "Starts at"],
        ["endsAt", "Ends at"],
      ].map(([key, label]) => (
        <label key={key} className="grid gap-1 text-sm font-medium">
          {label}
          <input
            name={key}
            type={key.includes("At") ? "date" : "text"}
            defaultValue={(initial as any)?.[key] ?? ""}
            required={key === "name"}
            className="border border-border bg-background px-3 py-2 font-normal"
          />
        </label>
      ))}
      <label className="grid gap-1 text-sm font-medium">
        Space
        <select
          name="spaceId"
          defaultValue={initial?.spaceId ?? spaces[0]?.id}
          className="border border-border bg-background px-3 py-2 font-normal"
        >
          {spaces.map((space) => (
            <option key={space.id} value={space.id}>
              {space.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Status
        <select
          name="status"
          defaultValue={initial?.status ?? "draft"}
          className="border border-border bg-background px-3 py-2 font-normal"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <button className="w-fit bg-primary px-4 py-2 text-sm font-semibold text-background">
        {initial ? "Save changes" : "Create campaign"}
      </button>
      {saved && <p className="text-sm text-green-700">Saved.</p>}
    </form>
  );
}
export function StatusFilter({
  current,
  token,
}: {
  current?: string;
  token: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {["all", "draft", "active", "completed"].map((status) => (
        <Link
          key={status}
          href={`/brand/campaigns?as=brand${status === "all" ? "" : `&status=${status}`}`}
          className={`border px-3 py-2 text-sm ${current === status || (!current && status === "all") ? "bg-primary text-background" : "bg-surface"}`}
        >
          {status[0].toUpperCase() + status.slice(1)}
        </Link>
      ))}
    </div>
  );
}
