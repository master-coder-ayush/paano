"use client";
import { useState } from "react";
export function PixelSetup({
  token,
  spaceId,
  initialKey,
  labels,
}: {
  token: string;
  spaceId: string;
  initialKey: string;
  labels: {
    copy: string;
    copied: string;
    regenerate: string;
    warning: string;
    saved: string;
  };
}) {
  const [key, setKey] = useState(initialKey);
  const [message, setMessage] = useState("");
  const snippet = `<script>\n  window.paano = window.paano || function () {\n    (window.paano.q = window.paano.q || []).push(arguments);\n  };\n</script>\n<script async src="/n.js" data-site="${key}"></script>`;
  async function copy() {
    await navigator.clipboard.writeText(snippet);
    setMessage(labels.copied);
  }
  async function regenerate() {
    if (!window.confirm(labels.warning)) return;
    const res = await fetch("/api/pixel/keys", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ spaceId, regenerate: true }),
    });
    if (res.ok) {
      const body = await res.json();
      setKey(body.key.key);
      setMessage(labels.saved);
    }
  }
  return (
    <div className="grid gap-4">
      <div className="border border-border bg-background p-3 font-mono text-xs break-all">
        {snippet}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={copy}
          className="bg-primary px-4 py-2 text-sm font-semibold text-background"
        >
          {message || labels.copy}
        </button>
        <button
          onClick={regenerate}
          className="border border-border px-4 py-2 text-sm font-semibold"
        >
          {labels.regenerate}
        </button>
      </div>
    </div>
  );
}
