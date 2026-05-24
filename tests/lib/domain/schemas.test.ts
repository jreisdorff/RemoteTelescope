import { describe, expect, it } from "vitest";
import {
  anchorPacketSchema,
  experienceInstanceSchema,
  qualiaPacketSchema,
  targetSchema,
} from "@/lib/domain/schemas";

describe("domain schemas", () => {
  it("parses Target", () => {
    const result = targetSchema.parse({
      id: "jupiter",
      name: "Jupiter",
      distanceLy: 0.000063,
      lightLagSeconds: 2700,
      description: "Gas giant",
    });
    expect(result.id).toBe("jupiter");
  });

  it("parses AnchorPacket", () => {
    const result = anchorPacketSchema.parse({
      targetId: "jupiter",
      tEmission: "2026-05-24T12:00:00.000Z",
      tObserved: "2026-05-24T12:45:00.000Z",
      baseColor: "#c88b5a",
      atmosphereHint: "banded hydrogen-helium",
      regions: [{ regionId: "equator", label: "Equatorial bands", confidence: 0.9 }],
    });
    expect(result.regions).toHaveLength(1);
  });

  it("parses QualiaPacket", () => {
    const result = qualiaPacketSchema.parse({
      anchorRef: "jupiter",
      sessionId: "rv-001",
      qualia: [{ regionId: "polar", kind: "weather", value: "orange turbulence" }],
      status: "provisional",
      createdAt: "2026-05-24T13:00:00.000Z",
    });
    expect(result.status).toBe("provisional");
  });

  it("parses ExperienceInstance", () => {
    const result = experienceInstanceSchema.parse({
      targetId: "jupiter",
      layers: ["L0", "L1"],
      baseColor: "#c88b5a",
      atmosphereHint: "banded",
      regions: [
        {
          regionId: "equator",
          label: "Equatorial bands",
          confidence: 0.9,
          source: "catoptric",
          qualia: [],
        },
      ],
    });
    expect(result.layers).toEqual(["L0", "L1"]);
  });
});
