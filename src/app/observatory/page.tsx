import { TargetCatalog } from "@/components/observatory/TargetCatalog";
import { DEFAULT_USER_ID } from "@/lib/domain/residence-types";
import { getUnlockedTargetIds } from "@/lib/domain/unlock";
import { listAllQualia } from "@/lib/db/qualia";
import { getSeedTargets } from "@/lib/seed/targets";

export default function ObservatoryPage() {
  const targets = getSeedTargets();
  const allQualia = listAllQualia();
  const unlockedTargetIds = getUnlockedTargetIds(
    DEFAULT_USER_ID,
    allQualia,
    targets.map((t) => t.id),
  );

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Station A · Catoptric archive
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Observatory</h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Select a target world. All reconstructions are indexed by emission epoch—what you
          observe is always light from the past. Residence unlocks after canon FEEDBACK.
        </p>
      </header>
      <TargetCatalog targets={targets} unlockedTargetIds={unlockedTargetIds} />
    </div>
  );
}

export const dynamic = "force-dynamic";
