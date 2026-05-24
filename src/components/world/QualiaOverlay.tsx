import type { MergedRegion, QualiaPacket } from "@/lib/domain/types";

interface QualiaOverlayProps {
  regions: MergedRegion[];
  packets: QualiaPacket[];
}

export function QualiaOverlay({ regions, packets }: QualiaOverlayProps) {
  const rvRegions = regions.filter((r) => r.source === "rv" && r.qualia.length > 0);

  if (rvRegions.length === 0 && packets.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-3 left-3 right-3 z-10 max-h-36 overflow-y-auto rounded-lg border border-violet-800/60 bg-black/75 p-3 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">
        Remote viewing overlay
      </p>
      <ul className="mt-2 space-y-1 text-xs">
        {packets.map((packet) => (
          <li key={packet.sessionId} className="text-[var(--muted)]">
            <span className="font-mono text-violet-300">{packet.sessionId}</span>
            <span className="ml-2 rounded bg-violet-900/60 px-1.5 py-0.5 text-violet-200">
              {packet.status}
            </span>
          </li>
        ))}
        {rvRegions.map((region) =>
          region.qualia.map((q, i) => (
            <li key={`${region.regionId}-${i}`}>
              <span className="text-violet-300">{region.label}</span>: {q.value}
            </li>
          )),
        )}
      </ul>
    </div>
  );
}
