import { NextResponse } from "next/server";
import { z } from "zod";
import { qualiaFieldSchema } from "@/lib/domain/schemas";
import { insertQualiaPacket } from "@/lib/db/qualia";
import type { QualiaPacket } from "@/lib/domain/types";

const postBodySchema = z.object({
  anchorRef: z.string().min(1),
  qualia: z.array(qualiaFieldSchema).min(1),
  narrative: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = postBodySchema.parse(await request.json());
    const sessionId = `rv-${crypto.randomUUID().slice(0, 8)}`;
    const createdAt = new Date().toISOString();

    const qualia = [...body.qualia];
    if (body.narrative?.trim()) {
      qualia.push({
        regionId: qualia[0]?.regionId ?? "general",
        kind: "narrative",
        value: body.narrative.trim(),
      });
    }

    const packet: QualiaPacket = {
      anchorRef: body.anchorRef,
      sessionId,
      qualia,
      status: "provisional",
      createdAt,
    };

    insertQualiaPacket(packet);

    return NextResponse.json({ ok: true, sessionId, packet });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
