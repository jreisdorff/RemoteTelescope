import type { ObservationFixture } from "@/lib/domain/feedback";

/** Voyager-era confirmation fixture for Jupiter FEEDBACK demo */
export const JUPITER_VOYAGER_OBSERVATION: ObservationFixture = {
  targetId: "jupiter",
  key: "voyager-1979",
  label: "Voyager 1 flyby (1979) — rings, storms, Io volcanism",
  confirms: [
    { regionId: "polar", keywords: ["ring", "rings", "flattened ring"] },
    { regionId: "io", keywords: ["volcanic", "volcano", "orange", "orange-yellow", "brown"] },
    { regionId: "equator", keywords: ["turbulence", "storm", "band", "banded"] },
  ],
  refutes: [
    { regionId: "polar", keywords: ["solid mountain", "rocky surface", "solid peaks"] },
    { regionId: "equator", keywords: ["ice cap", "frozen ocean"] },
  ],
};

export function getObservationForTarget(
  targetId: string,
  key?: string,
): ObservationFixture | undefined {
  if (targetId !== "jupiter") {
    return undefined;
  }
  if (key && key !== JUPITER_VOYAGER_OBSERVATION.key) {
    return undefined;
  }
  return JUPITER_VOYAGER_OBSERVATION;
}
