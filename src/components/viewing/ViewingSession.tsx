"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AnchorPacket } from "@/lib/domain/types";
import type { QualiaField, QualiaKind } from "@/lib/domain/types";
import { QUALIA_KINDS, VIEWING_STEPS } from "@/lib/domain/viewing-prompts";
import { formatEmissionTime } from "@/lib/format";

interface ViewingSessionProps {
  targetId: string;
  targetName: string;
  anchor: AnchorPacket;
}

export function ViewingSession({ targetId, targetName, anchor }: ViewingSessionProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [impressions, setImpressions] = useState("");
  const [narrative, setNarrative] = useState("");
  const [regionId, setRegionId] = useState(anchor.regions[0]?.regionId ?? "");
  const [kind, setKind] = useState<QualiaKind>("weather");
  const [value, setValue] = useState("");
  const [tags, setTags] = useState<QualiaField[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = VIEWING_STEPS[stepIndex];

  function addTag() {
    if (!value.trim() || !regionId) return;
    setTags((prev) => [...prev, { regionId, kind, value: value.trim() }]);
    setValue("");
  }

  function removeTag(index: number) {
    setTags((prev) => prev.filter((_, i) => i !== index));
  }

  async function submitSession() {
    if (tags.length === 0) {
      setError("Add at least one qualia tag before submitting.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const qualia = [...tags];
    if (impressions.trim()) {
      qualia.push({
        regionId: regionId || anchor.regions[0]?.regionId || "general",
        kind: "narrative",
        value: `Impressions: ${impressions.trim()}`,
      });
    }

    const res = await fetch("/api/qualia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anchorRef: targetId,
        qualia,
        narrative: narrative.trim() || undefined,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to save session");
      return;
    }

    router.push(`/world/${targetId}?session=${data.sessionId}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-violet-900/50 bg-violet-950/30 px-4 py-3 text-sm">
        <span className="font-medium text-violet-300">Present-tense report</span>
        <span className="text-[var(--muted)]"> — not yet verified by mirror.</span>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5">
        <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Step {stepIndex + 1} of {VIEWING_STEPS.length} · {step.title}
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">{step.prompt}</p>

        {step.id === "orientation" && (
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-[var(--muted)]">Target</dt>
              <dd className="font-medium">{targetName}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Anchor ref</dt>
              <dd>{targetId}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Emission epoch (anchor)</dt>
              <dd>{formatEmissionTime(anchor.tEmission)}</dd>
            </div>
          </dl>
        )}

        {step.id === "impressions" && (
          <textarea
            className="mt-4 w-full rounded border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
            rows={5}
            placeholder="Yellowish bands, tremendous turbulence…"
            value={impressions}
            onChange={(e) => setImpressions(e.target.value)}
          />
        )}

        {step.id === "qualia" && (
          <div className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-sm">
                <span className="text-[var(--muted)]">Region</span>
                <select
                  className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] p-2"
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                >
                  {anchor.regions.map((r) => (
                    <option key={r.regionId} value={r.regionId}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="text-[var(--muted)]">Kind</span>
                <select
                  className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] p-2"
                  value={kind}
                  onChange={(e) => setKind(e.target.value as QualiaKind)}
                >
                  {QUALIA_KINDS.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm sm:col-span-1">
                <span className="text-[var(--muted)]">Value</span>
                <input
                  className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] p-2"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="flattened ring of some kind"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={addTag}
              className="rounded bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-[var(--background)]"
            >
              Add qualia tag
            </button>
            {tags.length > 0 && (
              <ul className="space-y-1 text-sm">
                {tags.map((tag, i) => (
                  <li
                    key={`${tag.regionId}-${tag.kind}-${i}`}
                    className="flex items-center justify-between rounded border border-[var(--border)] px-3 py-2"
                  >
                    <span>
                      <span className="text-[var(--muted)]">{tag.regionId}</span> · {tag.kind}:{" "}
                      {tag.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTag(i)}
                      className="text-xs text-red-400"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {step.id === "narrative" && (
          <textarea
            className="mt-4 w-full rounded border border-[var(--border)] bg-[var(--background)] p-3 text-sm"
            rows={5}
            placeholder="Volcanic action on the moon—orange-yellow with browns…"
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
          />
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-3">
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={() => setStepIndex((i) => i - 1)}
            className="rounded border border-[var(--border)] px-4 py-2 text-sm"
          >
            Back
          </button>
        )}
        {stepIndex < VIEWING_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStepIndex((i) => i + 1)}
            className="rounded bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)]"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={submitSession}
            disabled={submitting}
            className="rounded bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit viewing session"}
          </button>
        )}
      </div>
    </div>
  );
}
