import type { MergedRegion } from "@/lib/domain/types";

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

interface ProvenancePanelProps {
  regions: MergedRegion[];
  atmosphereHint: string;
  tEmission: string;
}

export function ProvenancePanel({
  regions,
  atmosphereHint,
  tEmission,
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
            className="flex items-center justify-between gap-2 rounded border border-[var(--border)] px-3 py-2 text-sm"
          >
            <span>{region.label}</span>
            <span
              className={`rounded px-2 py-0.5 text-xs ${SOURCE_COLORS[region.source]}`}
            >
              {SOURCE_LABELS[region.source]}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
