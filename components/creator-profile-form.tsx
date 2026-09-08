"use client";
import { useState } from "react";
import type { CreatorCard } from "@/lib/creator-marketplace";
export function CreatorProfileForm({
  card,
  token,
  labels,
}: {
  card: CreatorCard | undefined;
  token: string;
  labels: Record<string, string>;
}) {
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        const data = new FormData(event.currentTarget);
        const response = await fetch("/api/creator/profile", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            linkedinUrl: data.get("linkedinUrl"),
            headline: data.get("headline"),
            country: data.get("country"),
            followerCount: Number(data.get("followerCount")),
            price: Number(data.get("price")),
            bio: data.get("bio"),
            topics: String(data.get("topics"))
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          }),
        });
        setSaving(false);
        setMessage(response.ok ? labels.saved : labels.error);
      }}
      className="grid max-w-2xl gap-4 border border-border bg-surface p-6"
    >
      <label className="grid gap-2 text-sm">
        {labels.linkedinUrl}
        <input
          name="linkedinUrl"
          defaultValue={card?.linkedinUrl}
          className="border border-border bg-background p-3"
        />
      </label>
      <label className="grid gap-2 text-sm">
        {labels.headline}
        <input
          name="headline"
          defaultValue={card?.headline}
          className="border border-border bg-background p-3"
        />
      </label>
      <label className="grid gap-2 text-sm">
        {labels.country}
        <input
          name="country"
          defaultValue={card?.country}
          className="border border-border bg-background p-3"
        />
      </label>
      <label className="grid gap-2 text-sm">
        {labels.followerCount}
        <input
          name="followerCount"
          type="number"
          defaultValue={card?.followerCount}
          className="border border-border bg-background p-3"
        />
      </label>
      <label className="grid gap-2 text-sm">
        {labels.price}
        <input
          name="price"
          type="number"
          defaultValue={card?.price}
          className="border border-border bg-background p-3"
        />
      </label>
      <label className="grid gap-2 text-sm">
        {labels.bio}
        <textarea
          name="bio"
          defaultValue={card?.bio}
          className="min-h-32 border border-border bg-background p-3"
        />
      </label>
      <label className="grid gap-2 text-sm">
        {labels.topics}
        <input
          name="topics"
          defaultValue={card?.topics.join(", ")}
          className="border border-border bg-background p-3"
        />
      </label>
      <button disabled={saving} className="bg-primary px-4 py-3 text-white">
        {saving ? labels.saving : labels.save}
      </button>
      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
