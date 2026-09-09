"use client";
import { useState } from "react";
export function CollaborationActions({
  id,
  token,
  role,
  status,
  labels,
}: {
  id: string;
  token: string;
  role: "brand" | "creator";
  status: string;
  labels: Record<string, string>;
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function send(method: "POST" | "PATCH", body: object) {
    setBusy(true);
    const r = await fetch(`/api/collaborations/${id}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    setBusy(false);
    setMessage(r.ok ? labels.saved : labels.error);
    if (r.ok) location.reload();
  }
  return (
    <div className="mt-6 grid gap-4 border-t border-border pt-5">
      {role === "creator" &&
        ["accepted", "draft", "revision_requested"].includes(status) && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send("POST", { body: new FormData(e.currentTarget).get("body") });
            }}
            className="grid gap-2"
          >
            <label className="text-sm font-semibold">
              {labels.submitDraft}
            </label>
            <textarea
              name="body"
              required
              placeholder={labels.draftPlaceholder}
              className="min-h-28 border border-border bg-background p-3"
            />
            <button
              disabled={busy}
              className="w-fit bg-primary px-4 py-2 text-sm text-white"
            >
              {labels.submitDraft}
            </button>
          </form>
        )}
      {role === "brand" && status === "draft" && (
        <div className="flex flex-wrap gap-2">
          <button
            disabled={busy}
            onClick={() => send("PATCH", { status: "approved" })}
            className="bg-primary px-4 py-2 text-sm text-white"
          >
            {labels.approve}
          </button>
          <button
            disabled={busy}
            onClick={() =>
              send("PATCH", {
                status: "revision_requested",
                note: "Please revise the draft.",
              })
            }
            className="border border-border px-4 py-2 text-sm"
          >
            {labels.requestChanges}
          </button>
        </div>
      )}
      {role === "creator" && status === "approved" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send("PATCH", {
              status: "published",
              publishedPostUrl: new FormData(e.currentTarget).get("url"),
            });
          }}
          className="flex flex-wrap gap-2"
        >
          <input
            name="url"
            type="url"
            required
            placeholder={labels.publishedUrl}
            className="min-w-64 flex-1 border border-border bg-background p-3"
          />
          <button
            disabled={busy}
            className="bg-primary px-4 py-2 text-sm text-white"
          >
            {labels.submitPublished}
          </button>
        </form>
      )}
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
