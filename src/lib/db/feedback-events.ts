import { getDb } from "./client";

export function recordFeedbackEvent(
  qualiaPacketId: number,
  targetId: string,
  result: "confirmed" | "refuted",
  observationKey: string,
): void {
  const database = getDb();
  database
    .prepare(
      `INSERT INTO feedback_events (qualia_packet_id, target_id, result, observation_key, created_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(qualiaPacketId, targetId, result, observationKey, new Date().toISOString());
}

export function getQualiaPacketId(sessionId: string): number | undefined {
  const database = getDb();
  const row = database
    .prepare(`SELECT id FROM qualia_packets WHERE session_id = ?`)
    .get(sessionId) as { id: number } | undefined;
  return row?.id;
}
