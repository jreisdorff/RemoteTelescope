import { describe, expect, it } from "vitest";
import { applyFeedback, evaluateQualiaAgainstObservation } from "@/lib/domain/feedback";
import { JUPITER_VOYAGER_OBSERVATION } from "@/lib/seed/jupiter-observation";
import type { QualiaPacket } from "@/lib/domain/types";

const basePacket: QualiaPacket = {
  anchorRef: "jupiter",
  sessionId: "rv-test",
  status: "provisional",
  createdAt: "2026-05-24T13:00:00.000Z",
  qualia: [],
};

describe("feedback", () => {
  it("promotes ring claims to canon", () => {
    const packet: QualiaPacket = {
      ...basePacket,
      qualia: [{ regionId: "polar", kind: "narrative", value: "a flattened ring of some kind" }],
    };
    expect(evaluateQualiaAgainstObservation(packet, JUPITER_VOYAGER_OBSERVATION)).toBe("canon");
  });

  it("strikes refuted claims", () => {
    const packet: QualiaPacket = {
      ...basePacket,
      qualia: [{ regionId: "polar", kind: "terrain", value: "solid mountain peaks" }],
    };
    expect(evaluateQualiaAgainstObservation(packet, JUPITER_VOYAGER_OBSERVATION)).toBe("struck");
  });

  it("leaves unmatched claims provisional", () => {
    const packet: QualiaPacket = {
      ...basePacket,
      qualia: [{ regionId: "north", kind: "weather", value: "quiet haze" }],
    };
    expect(evaluateQualiaAgainstObservation(packet, JUPITER_VOYAGER_OBSERVATION)).toBe("provisional");
  });

  it("refute takes precedence over confirm in same packet", () => {
    const packet: QualiaPacket = {
      ...basePacket,
      qualia: [
        { regionId: "polar", kind: "narrative", value: "rings visible" },
        { regionId: "polar", kind: "terrain", value: "solid mountain peaks" },
      ],
    };
    expect(applyFeedback(packet, JUPITER_VOYAGER_OBSERVATION).status).toBe("struck");
  });
});
