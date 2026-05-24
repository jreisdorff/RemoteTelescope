import { NextResponse } from "next/server";
import { z } from "zod";
import { applyFeedback } from "@/lib/domain/feedback";
import { getQualiaPacketId, recordFeedbackEvent } from "@/lib/db/feedback-events";
import { getQualiaBySession, listQualiaByTarget, updateQualiaStatus } from "@/lib/db/qualia";
import { getObservationForTarget } from "@/lib/seed/jupiter-observation";

const postBodySchema = z.object({
  targetId: z.string().min(1),
  observationKey: z.string().optional(),
  sessionId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = postBodySchema.parse(await request.json());
    const observation = getObservationForTarget(body.targetId, body.observationKey);

    if (!observation) {
      return NextResponse.json(
        { ok: false, error: "No observation fixture for this target" },
        { status: 400 },
      );
    }

    const packets = body.sessionId
      ? [getQualiaBySession(body.sessionId)].filter(Boolean)
      : listQualiaByTarget(body.targetId).filter((p) => p.status === "provisional");

    if (packets.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No provisional qualia packets to evaluate" },
        { status: 404 },
      );
    }

    const results = packets.map((packet) => {
      const updated = applyFeedback(packet!, observation);
      updateQualiaStatus(updated.sessionId, updated.status);
      const packetId = getQualiaPacketId(updated.sessionId);
      if (packetId && (updated.status === "canon" || updated.status === "struck")) {
        recordFeedbackEvent(
          packetId,
          body.targetId,
          updated.status === "canon" ? "confirmed" : "refuted",
          observation.key,
        );
      }
      return {
        sessionId: updated.sessionId,
        status: updated.status,
      };
    });

    return NextResponse.json({
      ok: true,
      observation: observation.label,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
