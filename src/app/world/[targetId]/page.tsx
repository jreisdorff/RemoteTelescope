import Link from "next/link";
import { notFound } from "next/navigation";
import { PlanetScene } from "@/components/world/PlanetScene";
import { ProvenancePanel } from "@/components/world/ProvenancePanel";
import { LightLagClock } from "@/components/observatory/LightLagClock";
import { mergeAnchorWithQualia } from "@/lib/domain/merge";
import { formatLightLag } from "@/lib/format";
import { getAnchorForTarget } from "@/lib/seed";
import { getSeedTarget } from "@/lib/seed/targets";

interface WorldPageProps {
  params: Promise<{ targetId: string }>;
}

export default async function WorldPage({ params }: WorldPageProps) {
  const { targetId } = await params;
  const target = getSeedTarget(targetId);
  const anchor = getAnchorForTarget(targetId);

  if (!target || !anchor) {
    notFound();
  }

  const experience = mergeAnchorWithQualia(anchor, []);

  return (
    <div className="space-y-6">
      <header>
        <Link href="/observatory" className="text-sm text-[var(--muted)]">
          ← Observatory
        </Link>
        <h1 className="mt-2 text-3xl font-semibold">{target.name}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Reconstruction (L1) · optics-only · lag {formatLightLag(target.lightLagSeconds)}
        </p>
      </header>

      <LightLagClock targetName={target.name} lightLagSeconds={target.lightLagSeconds} />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <PlanetScene baseColor={experience.baseColor} atmosphereHint={experience.atmosphereHint} />
        <ProvenancePanel
          regions={experience.regions}
          atmosphereHint={experience.atmosphereHint}
          tEmission={anchor.tEmission}
        />
      </div>

      <p className="text-sm text-[var(--muted)]">
        Remote viewing sessions unlock in Milestone 2.{" "}
        <span className="opacity-60">Begin viewing → (coming soon)</span>
      </p>
    </div>
  );
}
