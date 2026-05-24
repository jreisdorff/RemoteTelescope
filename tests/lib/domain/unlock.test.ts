import { describe, expect, it } from "vitest";
import { canUnlockResidence, countCanonQualia } from "@/lib/domain/unlock";
import type { QualiaPacket } from "@/lib/domain/types";

const packet = (status: QualiaPacket["status"]): QualiaPacket => ({
  anchorRef: "jupiter",
  sessionId: `rv-${status}`,
  status,
  createdAt: "2026-05-24T13:00:00.000Z",
  qualia: [{ regionId: "polar", kind: "narrative", value: "rings" }],
});

describe("unlock", () => {
  it("counts canon qualia", () => {
    expect(countCanonQualia([packet("provisional"), packet("canon")])).toBe(1);
  });

  it("requires at least one canon qualia to unlock", () => {
    expect(canUnlockResidence("default", "jupiter", [packet("provisional")])).toBe(false);
    expect(canUnlockResidence("default", "jupiter", [packet("canon")])).toBe(true);
  });

  it("ignores canon qualia for other targets", () => {
    const other: QualiaPacket = { ...packet("canon"), anchorRef: "k2-fictional" };
    expect(canUnlockResidence("default", "jupiter", [other])).toBe(false);
  });
});
