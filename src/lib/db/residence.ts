import type { ResidenceState } from "@/lib/domain/residence-types";
import { DEFAULT_USER_ID } from "@/lib/domain/residence-types";
import type { AnchorPacket } from "@/lib/domain/types";
import { getDb } from "./client";

interface ResidenceRow {
  user_id: string;
  target_id: string;
  last_location: string;
  a_calendar: string;
  b_calendar: string;
  inventory_json: string;
  updated_at: string;
}

function rowToState(row: ResidenceRow): ResidenceState {
  return {
    userId: row.user_id,
    targetId: row.target_id,
    lastLocation: row.last_location,
    aCalendar: row.a_calendar,
    bCalendar: row.b_calendar,
    inventory: JSON.parse(row.inventory_json) as string[],
    updatedAt: row.updated_at,
  };
}

export function createDefaultResidence(
  targetId: string,
  anchor: AnchorPacket,
): ResidenceState {
  const lowConfidence = anchor.regions.find((r) => r.confidence < 0.5);
  return {
    userId: DEFAULT_USER_ID,
    targetId,
    lastLocation: lowConfidence?.label ?? anchor.regions[0]?.label ?? "Unknown",
    aCalendar: anchor.tObserved,
    bCalendar: new Date().toISOString(),
    inventory: ["Viewer's field log", "Anchor coordinates"],
    updatedAt: new Date().toISOString(),
  };
}

export function getResidenceState(
  targetId: string,
  userId: string = DEFAULT_USER_ID,
): ResidenceState | undefined {
  const database = getDb();
  const row = database
    .prepare(
      `SELECT user_id, target_id, last_location, a_calendar, b_calendar, inventory_json, updated_at
       FROM residence_state WHERE user_id = ? AND target_id = ?`,
    )
    .get(userId, targetId) as ResidenceRow | undefined;

  return row ? rowToState(row) : undefined;
}

export function upsertResidenceState(state: ResidenceState): ResidenceState {
  const database = getDb();
  const updatedAt = new Date().toISOString();
  const inventoryJson = JSON.stringify(state.inventory);

  database
    .prepare(
      `INSERT INTO residence_state (user_id, target_id, last_location, a_calendar, b_calendar, inventory_json, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, target_id) DO UPDATE SET
         last_location = excluded.last_location,
         a_calendar = excluded.a_calendar,
         b_calendar = excluded.b_calendar,
         inventory_json = excluded.inventory_json,
         updated_at = excluded.updated_at`,
    )
    .run(
      state.userId,
      state.targetId,
      state.lastLocation,
      state.aCalendar,
      state.bCalendar,
      inventoryJson,
      updatedAt,
    );

  return { ...state, updatedAt };
}

export function getOrCreateResidence(
  targetId: string,
  anchor: AnchorPacket,
  userId: string = DEFAULT_USER_ID,
): ResidenceState {
  const existing = getResidenceState(targetId, userId);
  if (existing) {
    return existing;
  }
  const created = createDefaultResidence(targetId, anchor);
  return upsertResidenceState(created);
}
