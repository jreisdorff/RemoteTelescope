import type { Target } from "@/lib/domain/types";

export const SEED_TARGETS: Target[] = [
  {
    id: "jupiter",
    name: "Jupiter",
    distanceLy: 0.000063,
    lightLagSeconds: 35 * 60,
    description:
      "Banded gas giant. Catoptric archive resolves equatorial structure; polar detail remains below diffraction limit at station range.",
  },
  {
    id: "k2-fictional",
    name: "K2-Fictional b",
    distanceLy: 124,
    lightLagSeconds: 124 * 365.25 * 24 * 60 * 60,
    description:
      "Hycean candidate 124 light-years distant. Bulk atmosphere measured; polar oceans and surface life remain inferred only.",
  },
];

export function getSeedTargets(): Target[] {
  return SEED_TARGETS;
}

export function getSeedTarget(id: string): Target | undefined {
  return SEED_TARGETS.find((target) => target.id === id);
}
