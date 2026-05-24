import { TargetCatalog } from "@/components/observatory/TargetCatalog";
import { getSeedTargets } from "@/lib/seed/targets";

export default function ObservatoryPage() {
  const targets = getSeedTargets();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Station A · Catoptric archive
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Observatory</h1>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Select a target world. All reconstructions are indexed by emission epoch—what you
          observe is always light from the past.
        </p>
      </header>
      <TargetCatalog targets={targets} />
    </div>
  );
}
