"use client";
export function ResultsExport({
  token,
  query,
  label,
}: {
  token: string;
  query: string;
  label: string;
}) {
  async function download() {
    const response = await fetch(`/api/brand/results/export?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "paano-results.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button
      onClick={download}
      className="border border-border bg-surface px-4 py-2 text-sm font-semibold"
    >
      {label}
    </button>
  );
}
