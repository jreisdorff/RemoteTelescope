import type { QualiaPacket } from "./types";

export function countCanonQualia(packets: QualiaPacket[]): number {
  return packets.filter((p) => p.status === "canon").length;
}

export function canUnlockResidence(
  _userId: string,
  targetId: string,
  packets: QualiaPacket[],
): boolean {
  const forTarget = packets.filter((p) => p.anchorRef === targetId);
  return countCanonQualia(forTarget) >= 1;
}

export function getUnlockedTargetIds(
  _userId: string,
  allPackets: QualiaPacket[],
  targetIds: string[],
): string[] {
  return targetIds.filter((id) => canUnlockResidence(_userId, id, allPackets));
}
