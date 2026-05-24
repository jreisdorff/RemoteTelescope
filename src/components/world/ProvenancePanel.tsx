import type { MergedRegion, QualiaPacket } from "@/lib/domain/types";

const SOURCE_LABELS: Record<MergedRegion["source"], string> = {
  catoptric: "Catoptric",
  rv: "Remote viewing",
  inferred: "Inferred",
};

const SOURCE_COLORS: Record<MergedRegion["source"], string> = {
  catoptric: "bg-emerald-900/50 text-emerald-300",
  rv: "bg-violet-900/50 text-violet-300",
  inferred: "bg-amber-900/50 text-amber-300",
};

const STATUS_COLORS: Record<QualiaPacket["status"], string> = {
  provisional: "text-amber-300",
  canon: "text-emerald-300",
  struck: "text-red-400 line-through",
};

interface ProvenancePanelProps {
  regions: MergedRegion[];
  atmosphereHint: string;
  tEmission: string;
  qualiaPackets?: QualiaPacket[];
}

export function ProvenancePanel({
  regions,
  atmosphereHint,
  tEmission,
  qualiaPackets = [],
}: ProvenancePanelProps) {
  return (
    <aside className="space-y-4 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)]">
          Provenance
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{atmosphereHint}</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Emission epoch: {tEmission.replace("T", " ").slice(0, 19)} UTC
        </p>
      </div>
      <ul className="space-y-2">
        {regions.map((region) => (
          <li
            key={region.regionId}
            className="rounded border border-[var(--border)] px-3 py-2 text-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <span>{region.label}</span>
              <span
                className={`rounded px-2 py-0.5 text-xs ${SOURCE_COLORS[region.source]}`}
              >
                {SOURCE_LABELS[region.source]}
              </span>
            </div>
            {region.qualia.length > 0 && (
              <ul className="mt-2 space-y-1 border-t border-[var(--border)] pt-2 text-xs text-[var(--muted)]">
                {region.qualia.map((q, i) => (
                  <li key={i}>
                    <span className="text-violet-300">{q.kind}</span>: {q.value}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {qualiaPackets.length > 0 && (
        <div className="border-t border-[var(--border)] pt-3">
          <p className="text-xs uppercase tracking-widest text-[var(--muted)]">Sessions</p>
          <ul className="mt-2 space-y-1 text-xs font-mono">
            {qualiaPackets.map((p) => (
              <li key={p.sessionId} className={STATUS_COLORS[p.status]}>
                {p.sessionId} · {p.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
