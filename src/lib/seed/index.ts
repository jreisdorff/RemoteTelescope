import type { AnchorPacket } from "@/lib/domain/types";
import { getJupiterAnchor } from "./jupiter-anchor";
import { getK2FictionalAnchor } from "./k2fictional-anchor";

const ANCHOR_BUILDERS: Record<string, () => AnchorPacket> = {
  jupiter: getJupiterAnchor,
  "k2-fictional": getK2FictionalAnchor,
};

export function getAnchorForTarget(targetId: string): AnchorPacket | undefined {
  const builder = ANCHOR_BUILDERS[targetId];
  return builder?.();
}

export function getAllAnchors(): AnchorPacket[] {
  return Object.values(ANCHOR_BUILDERS).map((builder) => builder());
}
