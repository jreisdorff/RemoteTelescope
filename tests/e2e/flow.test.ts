import { describe, expect, it } from "vitest";
import { applyFeedback } from "@/lib/domain/feedback";
import { mergeAnchorWithQualia } from "@/lib/domain/merge";
import { JUPITER_VOYAGER_OBSERVATION } from "@/lib/seed/jupiter-observation";
import { getJupiterAnchor } from "@/lib/seed/jupiter-anchor";
import type { QualiaPacket } from "@/lib/domain/types";

describe("M2 flow integration", () => {
  it("merge then feedback promotes ring qualia to canon", () => {
    const anchor = getJupiterAnchor();
    const packet: QualiaPacket = {
      anchorRef: "jupiter",
      sessionId: "rv-flow-test",
      status: "provisional",
      createdAt: new Date().toISOString(),
      qualia: [
        { regionId: "polar", kind: "narrative", value: "a flattened ring around the planet" },
      ],
    };

    const merged = mergeAnchorWithQualia(anchor, [packet]);
    const polar = merged.regions.find((r) => r.regionId === "polar");
    expect(polar?.source).toBe("rv");

    const updated = applyFeedback(packet, JUPITER_VOYAGER_OBSERVATION);
    expect(updated.status).toBe("canon");

    const remerged = mergeAnchorWithQualia(anchor, [updated]);
    expect(remerged.regions.find((r) => r.regionId === "polar")?.source).toBe("rv");
  });
});
