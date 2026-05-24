import type { QualiaPacket, QualiaStatus } from "@/lib/domain/types";
import { qualiaPacketSchema } from "@/lib/domain/schemas";
import { getDb } from "./client";

interface QualiaRow {
  anchor_ref: string;
  session_id: string;
  qualia_json: string;
  status: QualiaStatus;
  created_at: string;
}

function rowToPacket(row: QualiaRow): QualiaPacket {
  const parsed = JSON.parse(row.qualia_json) as Omit<QualiaPacket, "status" | "createdAt">;
  return qualiaPacketSchema.parse({
    ...parsed,
    status: row.status,
    createdAt: row.created_at,
  });
}

export function insertQualiaPacket(packet: QualiaPacket): QualiaPacket {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO qualia_packets (anchor_ref, session_id, qualia_json, status, created_at)
    VALUES (@anchorRef, @sessionId, @qualiaJson, @status, @createdAt)
  `);

  stmt.run({
    anchorRef: packet.anchorRef,
    sessionId: packet.sessionId,
    qualiaJson: JSON.stringify({
      anchorRef: packet.anchorRef,
      sessionId: packet.sessionId,
      qualia: packet.qualia,
    }),
    status: packet.status,
    createdAt: packet.createdAt,
  });

  return packet;
}

export function listQualiaByTarget(targetId: string): QualiaPacket[] {
  const database = getDb();
  const rows = database
    .prepare(
      `SELECT anchor_ref, session_id, qualia_json, status, created_at
       FROM qualia_packets
       WHERE anchor_ref = ?
       ORDER BY created_at DESC`,
    )
    .all(targetId) as QualiaRow[];

  return rows.map(rowToPacket);
}

export function listAllQualia(): QualiaPacket[] {
  const database = getDb();
  const rows = database
    .prepare(
      `SELECT anchor_ref, session_id, qualia_json, status, created_at
       FROM qualia_packets
       ORDER BY created_at DESC`,
    )
    .all() as QualiaRow[];

  return rows.map(rowToPacket);
}

export function updateQualiaStatus(
  sessionId: string,
  status: QualiaStatus,
): QualiaPacket | undefined {
  const database = getDb();
  const existing = database
    .prepare(`SELECT anchor_ref, session_id, qualia_json, status, created_at FROM qualia_packets WHERE session_id = ?`)
    .get(sessionId) as QualiaRow | undefined;

  if (!existing) {
    return undefined;
  }

  database
    .prepare(`UPDATE qualia_packets SET status = ? WHERE session_id = ?`)
    .run(status, sessionId);

  return rowToPacket({ ...existing, status });
}

export function getQualiaBySession(sessionId: string): QualiaPacket | undefined {
  const database = getDb();
  const row = database
    .prepare(
      `SELECT anchor_ref, session_id, qualia_json, status, created_at FROM qualia_packets WHERE session_id = ?`,
    )
    .get(sessionId) as QualiaRow | undefined;

  return row ? rowToPacket(row) : undefined;
}
