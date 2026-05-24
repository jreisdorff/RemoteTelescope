import type { AnchorPacket, QualiaPacket, ExperienceInstance } from "./types";

const CONFIDENCE_THRESHOLD = 0.5;

export function mergeAnchorWithQualia(
  anchor: AnchorPacket,
  qualiaPackets: QualiaPacket[],
): ExperienceInstance {
  const activeQualia = qualiaPackets.filter((packet) => packet.status !== "struck");

  const qualiaByRegion = new Map<string, QualiaPacket["qualia"]>();
  for (const packet of activeQualia) {
    for (const field of packet.qualia) {
      const existing = qualiaByRegion.get(field.regionId) ?? [];
      existing.push(field);
      qualiaByRegion.set(field.regionId, existing);
    }
  }

  const hasAppliedQualia = anchor.regions.some(
    (region) =>
      region.confidence < CONFIDENCE_THRESHOLD &&
      (qualiaByRegion.get(region.regionId)?.length ?? 0) > 0,
  );

  const regions = anchor.regions.map((region) => {
    const regionQualia = qualiaByRegion.get(region.regionId) ?? [];
    const canApplyQualia =
      region.confidence < CONFIDENCE_THRESHOLD && regionQualia.length > 0;

    if (canApplyQualia) {
      return {
        regionId: region.regionId,
        label: region.label,
        confidence: region.confidence,
        source: "rv" as const,
        qualia: regionQualia,
      };
    }

    if (region.confidence >= CONFIDENCE_THRESHOLD) {
      return {
        regionId: region.regionId,
        label: region.label,
        confidence: region.confidence,
        source: "catoptric" as const,
        qualia: [],
      };
    }

    return {
      regionId: region.regionId,
      label: region.label,
      confidence: region.confidence,
      source: "inferred" as const,
      qualia: [],
    };
  });

  return {
    targetId: anchor.targetId,
    layers: hasAppliedQualia ? ["L0", "L1", "L2"] : ["L0", "L1"],
    baseColor: anchor.baseColor,
    atmosphereHint: anchor.atmosphereHint,
    regions,
  };
}
