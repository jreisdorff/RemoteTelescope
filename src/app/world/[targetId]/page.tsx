import Link from "next/link";
import { notFound } from "next/navigation";
import { PlanetScene } from "@/components/world/PlanetScene";
import { ProvenancePanel } from "@/components/world/ProvenancePanel";
import { QualiaOverlay } from "@/components/world/QualiaOverlay";
import { LightLagClock } from "@/components/observatory/LightLagClock";
import { DEFAULT_USER_ID } from "@/lib/domain/residence-types";
import { mergeAnchorWithQualia } from "@/lib/domain/merge";
import { canUnlockResidence } from "@/lib/domain/unlock";
import { listQualiaByTarget } from "@/lib/db/qualia";
import { formatLightLag } from "@/lib/format";
import { getAnchorForTarget } from "@/lib/seed";
import { getSeedTarget } from "@/lib/seed/targets";

interface WorldPageProps {
  params: Promise<{ targetId: string }>;
  searchParams: Promise<{ session?: string }>;
}

export default async function WorldPage({ params, searchParams }: WorldPageProps) {
  const { targetId } = await params;
  const { session: newSessionId } = await searchParams;
  const target = getSeedTarget(targetId);
  const anchor = getAnchorForTarget(targetId);

  if (!target || !anchor) {
    notFound();
  }

  const qualiaPackets = listQualiaByTarget(targetId);
  const experience = mergeAnchorWithQualia(anchor, qualiaPackets);
  const hasRv = experience.layers.includes("L2");
  const layerLabel = hasRv ? "L1+L2 merged" : "optics-only";
  const residenceUnlocked = canUnlockResidence(DEFAULT_USER_ID, targetId, qualiaPackets);

  return (
    <div className="space-y-6">
      <header>
        <Link href="/observatory" className="text-sm text-[var(--muted)]">
          ← Observatory
        </Link>
        <h1 className="mt-2 text-3xl font-semibold">{target.name}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Reconstruction ({layerLabel}) · lag {formatLightLag(target.lightLagSeconds)}
        </p>
      </header>

      {newSessionId && (
        <p className="rounded-lg border border-violet-800/50 bg-violet-950/40 px-4 py-2 text-sm">
          Session <span className="font-mono text-violet-300">{newSessionId}</span> saved as{" "}
          <span className="text-amber-300">provisional</span>. Run FEEDBACK in the{" "}
          <Link href="/archive">Archive</Link> when new mirror data arrives.
        </p>
      )}

      <LightLagClock targetName={target.name} lightLagSeconds={target.lightLagSeconds} />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="relative">
          <PlanetScene
            baseColor={experience.baseColor}
            atmosphereHint={experience.atmosphereHint}
            hasRvOverlay={hasRv}
          />
          <QualiaOverlay regions={experience.regions} packets={qualiaPackets} />
        </div>
        <ProvenancePanel
          regions={experience.regions}
          atmosphereHint={experience.atmosphereHint}
          tEmission={anchor.tEmission}
          qualiaPackets={qualiaPackets}
        />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href={`/view/${targetId}`}
          className="rounded-md bg-violet-700 px-4 py-2 font-medium text-white no-underline hover:bg-violet-600"
        >
          Begin viewing session →
        </Link>
        <Link href="/archive" className="rounded-md border border-[var(--border)] px-4 py-2 no-underline">
          Archive →
        </Link>
        {residenceUnlocked ? (
          <Link
            href={`/residence/${targetId}`}
            className="rounded-md border border-emerald-700/50 bg-emerald-950/40 px-4 py-2 text-emerald-300 no-underline"
          >
            Enter residence →
          </Link>
        ) : (
          <span className="rounded-md border border-[var(--border)] px-4 py-2 text-[var(--muted)]">
            Residence locked (needs canon FEEDBACK)
          </span>
        )}
      </div>
    </div>
  );
}
