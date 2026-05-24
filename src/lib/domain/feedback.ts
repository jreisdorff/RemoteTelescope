import type { QualiaPacket, QualiaStatus } from "./types";

export interface ObservationRule {
  regionId: string;
  keywords: string[];
}

export interface ObservationFixture {
  targetId: string;
  key: string;
  label: string;
  confirms: ObservationRule[];
  refutes: ObservationRule[];
}

function matchesRule(
  value: string,
  rule: ObservationRule,
  regionId: string,
): boolean {
  if (rule.regionId !== regionId) {
    return false;
  }
  const normalized = value.toLowerCase();
  return rule.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
}

export function evaluateQualiaAgainstObservation(
  packet: QualiaPacket,
  observation: ObservationFixture,
): QualiaStatus {
  let hasConfirm = false;
  let hasRefute = false;

  for (const field of packet.qualia) {
    for (const rule of observation.refutes) {
      if (matchesRule(field.value, rule, field.regionId)) {
        hasRefute = true;
      }
    }
    for (const rule of observation.confirms) {
      if (matchesRule(field.value, rule, field.regionId)) {
        hasConfirm = true;
      }
    }
  }

  if (hasRefute) {
    return "struck";
  }
  if (hasConfirm) {
    return "canon";
  }
  return "provisional";
}

export function applyFeedback(
  packet: QualiaPacket,
  observation: ObservationFixture,
): QualiaPacket {
  const status = evaluateQualiaAgainstObservation(packet, observation);
  return { ...packet, status };
}
