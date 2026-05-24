import type { AnchorPacket } from "@/lib/domain/types";

function observationTimes(): { tEmission: string; tObserved: string } {
  const tObserved = new Date();
  const tEmission = new Date(tObserved.getTime() - 35 * 60 * 1000);
  return {
    tEmission: tEmission.toISOString(),
    tObserved: tObserved.toISOString(),
  };
}

export function getJupiterAnchor(): AnchorPacket {
  const { tEmission, tObserved } = observationTimes();

  return {
    targetId: "jupiter",
    tEmission,
    tObserved,
    baseColor: "#c88b5a",
    atmosphereHint: "Banded ammonia clouds; hydrogen-helium envelope",
    regions: [
      { regionId: "equator", label: "Equatorial bands", confidence: 0.92 },
      { regionId: "north", label: "Northern temperate zone", confidence: 0.78 },
      { regionId: "south", label: "Southern temperate zone", confidence: 0.76 },
      { regionId: "polar", label: "Polar aurora and ring hints", confidence: 0.28 },
      { regionId: "io", label: "Io flux tube (unresolved)", confidence: 0.15 },
    ],
  };
}
