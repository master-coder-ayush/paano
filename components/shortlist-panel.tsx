"use client";
import { useState } from "react";
import type { CreatorCard } from "@/lib/creator-marketplace";
import { Toast } from "@/components/toast";
export function ShortlistPanel({
  campaignId,
  token,
  initial,
  labels,
}: {
  campaignId: string;
  token: string;
  initial: Array<{ creator: CreatorCard }>;
  labels: Record<string, string>;
}) {
  const [items, setItems] = useState(initial);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");
  async function remove(creatorId: string) {
    try {
      const r = await fetch(
        `/api/brand/campaigns/${campaignId}/shortlist?creatorId=${creatorId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } },
      );
      if (!r.ok) throw new Error();
      setItems((x) => x.filter((i) => i.creator.id !== creatorId));
      setTone("success");
      setMessage(labels.removed);
    } catch {
      setTone("error");
      setMessage(labels.error);
    }
  }
  return (
    <section className="mt-6 border border-border bg-surface p-5">
      <h2 className="text-xl font-semibold">{labels.title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-primary/70">{labels.empty}</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-primary/65">
                <th className="p-2">Creator</th>
                <th className="p-2">Price</th>
                <th className="p-2">Topics</th>
                <th className="p-2">Audience</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map(({ creator }) => (
                <tr key={creator.id} className="border-b border-border/70">
                  <td className="p-2 font-medium">
                    {creator.name}
                    <div className="text-xs text-primary/60">
                      {creator.country}
                    </div>
                  </td>
                  <td className="p-2">
                    {creator.currency} {creator.price.toLocaleString()}
                  </td>
                  <td className="p-2">{creator.topics.join(", ")}</td>
                  <td className="p-2">
                    {creator.followerCount.toLocaleString()}
                  </td>
                  <td className="p-2 text-right">
                    <button
                      className="underline"
                      onClick={() => remove(creator.id)}
                    >
                      {labels.remove}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {message && (
        <Toast message={message} tone={tone} onClose={() => setMessage("")} />
      )}
    </section>
  );
}
