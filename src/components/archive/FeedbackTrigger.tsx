"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface FeedbackTriggerProps {
  targetId: string;
  observationKey: string;
  label: string;
}

export function FeedbackTrigger({ targetId, observationKey, label }: FeedbackTriggerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function runFeedback() {
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId, observationKey }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok || !data.ok) {
      setMessage(data.error ?? "Feedback failed");
      return;
    }

    const summary = data.results
      .map((r: { sessionId: string; status: string }) => `${r.sessionId} → ${r.status}`)
      .join(", ");
    setMessage(`Applied ${data.observation}: ${summary}`);
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
      <p className="text-sm font-medium">Simulate new observation</p>
      <p className="mt-1 text-xs text-[var(--muted)]">{label}</p>
      <button
        type="button"
        onClick={runFeedback}
        disabled={loading}
        className="mt-3 rounded bg-emerald-800 px-3 py-1.5 text-sm text-white disabled:opacity-50"
      >
        {loading ? "Running FEEDBACK…" : "Run FEEDBACK on provisional packets"}
      </button>
      {message && <p className="mt-2 text-xs text-[var(--muted)]">{message}</p>}
    </div>
  );
}
