import type { AnchorPacket } from "@/lib/domain/types";

function observationTimes(): { tEmission: string; tObserved: string } {
  const tObserved = new Date();
  const lightLagMs = 124 * 365.25 * 24 * 60 * 60 * 1000;
  const tEmission = new Date(tObserved.getTime() - lightLagMs);
  return {
    tEmission: tEmission.toISOString(),
    tObserved: tObserved.toISOString(),
  };
}

export function getK2FictionalAnchor(): AnchorPacket {
  const { tEmission, tObserved } = observationTimes();

  return {
    targetId: "k2-fictional",
    tEmission,
    tObserved,
    baseColor: "#2a6f8f",
    atmosphereHint: "Hycean envelope; water vapor and dimethyl sulfide hints",
    regions: [
      { regionId: "dayside", label: "Dayside terminator", confidence: 0.61 },
      { regionId: "nightside", label: "Nightside thermal glow", confidence: 0.55 },
      { regionId: "north-polar", label: "North polar ocean", confidence: 0.22 },
      { regionId: "south-polar", label: "South polar ocean", confidence: 0.19 },
      { regionId: "subsurface", label: "Subsurface biosphere", confidence: 0.08 },
    ],
  };
}
