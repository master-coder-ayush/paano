"use client";
import { useEffect, useState } from "react";
export function Toast({
  message,
  tone,
  onClose,
}: {
  message: string;
  tone: "success" | "error";
  onClose?: () => void;
}) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const id = window.setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 3500);
    return () => window.clearTimeout(id);
  }, [onClose]);
  if (!visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-50 border px-4 py-3 text-sm shadow-lg ${tone === "success" ? "border-green-700 bg-green-50 text-green-900" : "border-red-700 bg-red-50 text-red-900"}`}
    >
      <span>{message}</span>
      <button
        className="ml-4 font-bold"
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
