import Link from "next/link";
import type { Target } from "@/lib/domain/types";
import { formatDistance, formatLightLag } from "@/lib/format";

interface TargetCatalogProps {
  targets: Target[];
  unlockedTargetIds: string[];
}

export function TargetCatalog({ targets, unlockedTargetIds }: TargetCatalogProps) {
  return (
    <ul className="space-y-4">
      {targets.map((target) => {
        const residenceUnlocked = unlockedTargetIds.includes(target.id);

        return (
          <li
            key={target.id}
            className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{target.name}</h2>
                  {residenceUnlocked && (
                    <span className="rounded bg-emerald-900/50 px-2 py-0.5 text-xs text-emerald-300">
                      Residence available
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{target.description}</p>
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div>
                    <dt className="text-[var(--muted)]">Distance</dt>
                    <dd>{formatDistance(target.distanceLy)}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--muted)]">Light lag</dt>
                    <dd>{formatLightLag(target.lightLagSeconds)}</dd>
                  </div>
                </dl>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={`/world/${target.id}`}
                  className="rounded-md bg-[var(--accent)] px-4 py-2 text-center text-sm font-medium text-[var(--background)] no-underline hover:opacity-90"
                >
                  Open reconstruction →
                </Link>
                {residenceUnlocked ? (
                  <Link
                    href={`/residence/${target.id}`}
                    className="rounded-md border border-emerald-700/50 bg-emerald-950/40 px-4 py-2 text-center text-sm text-emerald-300 no-underline hover:bg-emerald-950/60"
                  >
                    Enter residence →
                  </Link>
                ) : (
                  <span className="rounded-md border border-[var(--border)] px-4 py-2 text-center text-xs text-[var(--muted)]">
                    Residence locked
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
