"use client";

import { useMemo, useState } from "react";
import type { QualiaPacket, QualiaStatus } from "@/lib/domain/types";

interface ArchiveTableProps {
  packets: QualiaPacket[];
}

const STATUS_FILTERS: Array<QualiaStatus | "all"> = [
  "all",
  "provisional",
  "canon",
  "struck",
];

export function ArchiveTable({ packets }: ArchiveTableProps) {
  const [filter, setFilter] = useState<QualiaStatus | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return packets;
    return packets.filter((p) => p.status === filter);
  }, [packets, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded px-3 py-1 text-sm capitalize ${
              filter === status
                ? "bg-[var(--accent)] text-[var(--background)]"
                : "border border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No qualia packets match this filter.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--panel)] text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3">Session</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Qualia</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((packet) => (
                <tr key={packet.sessionId} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3 font-mono text-violet-300">{packet.sessionId}</td>
                  <td className="px-4 py-3">{packet.anchorRef}</td>
                  <td className="px-4 py-3 capitalize">{packet.status}</td>
                  <td className="px-4 py-3 max-w-md">
                    <ul className="space-y-0.5 text-xs text-[var(--muted)]">
                      {packet.qualia.map((q, i) => (
                        <li key={i}>
                          {q.regionId} · {q.kind}: {q.value}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">
                    {packet.createdAt.replace("T", " ").slice(0, 19)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
