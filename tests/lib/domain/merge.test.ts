import { describe, expect, it } from "vitest";
import { mergeAnchorWithQualia } from "@/lib/domain/merge";
import type { AnchorPacket, QualiaPacket } from "@/lib/domain/types";

const anchor: AnchorPacket = {
  targetId: "test",
  tEmission: "2026-05-24T12:00:00.000Z",
  tObserved: "2026-05-24T12:45:00.000Z",
  baseColor: "#336699",
  atmosphereHint: "hazy",
  regions: [
    { regionId: "equator", label: "Equator", confidence: 0.9 },
    { regionId: "polar", label: "Polar hood", confidence: 0.3 },
  ],
};

describe("mergeAnchorWithQualia", () => {
  it("returns optics-only regions when no qualia", () => {
    const result = mergeAnchorWithQualia(anchor, []);
    const equator = result.regions.find((r) => r.regionId === "equator");
    const polar = result.regions.find((r) => r.regionId === "polar");
    expect(equator?.source).toBe("catoptric");
    expect(polar?.source).toBe("inferred");
    expect(result.layers).toEqual(["L0", "L1"]);
  });

  it("applies qualia only where confidence < 0.5", () => {
    const qualia: QualiaPacket[] = [
      {
        anchorRef: "test",
        sessionId: "rv-1",
        status: "provisional",
        createdAt: "2026-05-24T13:00:00.000Z",
        qualia: [
          { regionId: "polar", kind: "weather", value: "orange storms" },
          { regionId: "equator", kind: "color", value: "crimson" },
        ],
      },
    ];

    const result = mergeAnchorWithQualia(anchor, qualia);
    const polar = result.regions.find((r) => r.regionId === "polar");
    const equator = result.regions.find((r) => r.regionId === "equator");

    expect(polar?.source).toBe("rv");
    expect(polar?.qualia).toHaveLength(1);
    expect(equator?.source).toBe("catoptric");
    expect(equator?.qualia).toHaveLength(0);
    expect(result.layers).toContain("L2");
  });

  it("rejects struck qualia", () => {
    const qualia: QualiaPacket[] = [
      {
        anchorRef: "test",
        sessionId: "rv-struck",
        status: "struck",
        createdAt: "2026-05-24T13:00:00.000Z",
        qualia: [{ regionId: "polar", kind: "weather", value: "ignored" }],
      },
    ];

    const result = mergeAnchorWithQualia(anchor, qualia);
    const polar = result.regions.find((r) => r.regionId === "polar");
    expect(polar?.source).toBe("inferred");
    expect(polar?.qualia).toHaveLength(0);
  });

  it("applies canon qualia on low-confidence regions", () => {
    const qualia: QualiaPacket[] = [
      {
        anchorRef: "test",
        sessionId: "rv-canon",
        status: "canon",
        createdAt: "2026-05-24T13:00:00.000Z",
        qualia: [{ regionId: "polar", kind: "narrative", value: "volcanic plumes" }],
      },
    ];

    const result = mergeAnchorWithQualia(anchor, qualia);
    const polar = result.regions.find((r) => r.regionId === "polar");
    expect(polar?.source).toBe("rv");
    expect(polar?.qualia[0]?.value).toBe("volcanic plumes");
  });
});
