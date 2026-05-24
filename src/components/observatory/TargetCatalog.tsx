import Link from "next/link";
import type { Target } from "@/lib/domain/types";
import { formatDistance, formatLightLag } from "@/lib/format";

interface TargetCatalogProps {
  targets: Target[];
}

export function TargetCatalog({ targets }: TargetCatalogProps) {
  return (
    <ul className="space-y-4">
      {targets.map((target) => (
        <li
          key={target.id}
          className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{target.name}</h2>
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
            <Link
              href={`/world/${target.id}`}
              className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] no-underline hover:opacity-90"
            >
              Open reconstruction →
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
