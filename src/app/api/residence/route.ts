import { NextResponse } from "next/server";
import { z } from "zod";
import { DEFAULT_USER_ID } from "@/lib/domain/residence-types";
import { canUnlockResidence } from "@/lib/domain/unlock";
import { getOrCreateResidence, upsertResidenceState } from "@/lib/db/residence";
import { listQualiaByTarget } from "@/lib/db/qualia";
import { getAnchorForTarget } from "@/lib/seed";

const postBodySchema = z.object({
  targetId: z.string().min(1),
  lastLocation: z.string().min(1),
  aCalendar: z.string().min(1),
  bCalendar: z.string().min(1),
  inventory: z.array(z.string()),
});

export async function POST(request: Request) {
  try {
    const body = postBodySchema.parse(await request.json());
    const packets = listQualiaByTarget(body.targetId);

    if (!canUnlockResidence(DEFAULT_USER_ID, body.targetId, packets)) {
      return NextResponse.json(
        { ok: false, error: "Residence locked: requires canon qualia" },
        { status: 403 },
      );
    }

    const anchor = getAnchorForTarget(body.targetId);
    if (!anchor) {
      return NextResponse.json({ ok: false, error: "Unknown target" }, { status: 404 });
    }

    const state = upsertResidenceState({
      userId: DEFAULT_USER_ID,
      targetId: body.targetId,
      lastLocation: body.lastLocation,
      aCalendar: body.aCalendar,
      bCalendar: body.bCalendar,
      inventory: body.inventory,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, state });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetId = searchParams.get("targetId");

  if (!targetId) {
    return NextResponse.json({ ok: false, error: "targetId required" }, { status: 400 });
  }

  const packets = listQualiaByTarget(targetId);
  if (!canUnlockResidence(DEFAULT_USER_ID, targetId, packets)) {
    return NextResponse.json({ ok: false, locked: true }, { status: 403 });
  }

  const anchor = getAnchorForTarget(targetId);
  if (!anchor) {
    return NextResponse.json({ ok: false, error: "Unknown target" }, { status: 404 });
  }

  const state = getOrCreateResidence(targetId, anchor);
  return NextResponse.json({ ok: true, state });
}
