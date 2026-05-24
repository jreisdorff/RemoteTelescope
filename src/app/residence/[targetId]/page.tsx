import Link from "next/link";
import { notFound } from "next/navigation";
import { ResidenceHUD } from "@/components/residence/ResidenceHUD";
import { ResidenceLocked } from "@/components/residence/ResidenceLocked";
import { QualiaOverlay } from "@/components/world/QualiaOverlay";
import { PlanetScene } from "@/components/world/PlanetScene";
import { ProvenancePanel } from "@/components/world/ProvenancePanel";
import { DEFAULT_USER_ID } from "@/lib/domain/residence-types";
import { mergeAnchorWithQualia } from "@/lib/domain/merge";
import { canUnlockResidence, countCanonQualia } from "@/lib/domain/unlock";
import { getOrCreateResidence } from "@/lib/db/residence";
import { listQualiaByTarget } from "@/lib/db/qualia";
import { formatLightLag } from "@/lib/format";
import { getAnchorForTarget } from "@/lib/seed";
import { getSeedTarget } from "@/lib/seed/targets";

interface ResidencePageProps {
  params: Promise<{ targetId: string }>;
}

export default async function ResidencePage({ params }: ResidencePageProps) {
  const { targetId } = await params;
  const target = getSeedTarget(targetId);
  const anchor = getAnchorForTarget(targetId);

  if (!target || !anchor) {
    notFound();
  }

  const qualiaPackets = listQualiaByTarget(targetId);
  const unlocked = canUnlockResidence(DEFAULT_USER_ID, targetId, qualiaPackets);
  const canonCount = countCanonQualia(qualiaPackets);

  if (!unlocked) {
    return (
      <div className="space-y-6">
        <header>
          <Link href="/observatory" className="text-sm text-[var(--muted)]">
            ← Observatory
          </Link>
          <h1 className="mt-2 text-3xl font-semibold">Residence — {target.name}</h1>
        </header>
        <ResidenceLocked targetName={target.name} targetId={targetId} canonCount={canonCount} />
      </div>
    );
  }

  const residence = getOrCreateResidence(targetId, anchor);
  const experience = mergeAnchorWithQualia(anchor, qualiaPackets);
  const locationOptions = experience.regions.map((r) => r.label);

  return (
    <div className="space-y-6">
      <header>
        <Link href={`/world/${targetId}`} className="text-sm text-[var(--muted)]">
          ← Reconstruction
        </Link>
        <p className="mt-2 text-xs uppercase tracking-widest text-emerald-400">
          L3 · Shared residence
        </p>
        <h1 className="mt-1 text-3xl font-semibold">{target.name}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Dual life active · catoptric lag {formatLightLag(target.lightLagSeconds)} ·{" "}
          {canonCount} canon session{canonCount === 1 ? "" : "s"}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px_260px]">
        <div className="relative lg:col-span-1">
          <PlanetScene
            baseColor={experience.baseColor}
            atmosphereHint={experience.atmosphereHint}
            hasRvOverlay={experience.layers.includes("L2")}
          />
          <QualiaOverlay regions={experience.regions} packets={qualiaPackets} />
          <p className="mt-2 text-center text-xs text-[var(--muted)]">
            Present at: <span className="text-emerald-300">{residence.lastLocation}</span>
          </p>
        </div>
        <ProvenancePanel
          regions={experience.regions}
          atmosphereHint={experience.atmosphereHint}
          tEmission={anchor.tEmission}
          qualiaPackets={qualiaPackets}
        />
        <ResidenceHUD
          targetId={targetId}
          targetName={target.name}
          initialState={residence}
          locationOptions={locationOptions}
        />
      </div>
    </div>
  );
}
