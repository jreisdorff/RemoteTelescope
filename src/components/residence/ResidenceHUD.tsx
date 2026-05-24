"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ResidenceState } from "@/lib/domain/residence-types";
import { formatEmissionTime } from "@/lib/format";

interface ResidenceHUDProps {
  targetId: string;
  targetName: string;
  initialState: ResidenceState;
  locationOptions: string[];
}

export function ResidenceHUD({
  targetId,
  targetName,
  initialState,
  locationOptions,
}: ResidenceHUDProps) {
  const router = useRouter();
  const [lastLocation, setLastLocation] = useState(initialState.lastLocation);
  const [aCalendar, setACalendar] = useState(initialState.aCalendar);
  const [bCalendar, setBCalendar] = useState(initialState.bCalendar);
  const [inventoryText, setInventoryText] = useState(initialState.inventory.join("\n"));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/residence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetId,
        lastLocation,
        aCalendar,
        bCalendar,
        inventory: inventoryText.split("\n").map((s) => s.trim()).filter(Boolean),
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok || !data.ok) {
      setMessage(data.error ?? "Failed to save");
      return;
    }

    setMessage("Residence state saved.");
    router.refresh();
  }

  function syncBPresent() {
    setBCalendar(new Date().toISOString());
  }

  return (
    <aside className="space-y-4 rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-emerald-400">L3 · Shared residence</p>
        <h2 className="mt-1 text-lg font-semibold">Living on {targetName}</h2>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Dual residency: biological time on Station A, experiential present on B.
        </p>
      </div>

      <label className="block text-sm">
        <span className="text-[var(--muted)]">Last location (B)</span>
        <select
          className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] p-2"
          value={lastLocation}
          onChange={(e) => setLastLocation(e.target.value)}
        >
          {locationOptions.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[var(--muted)]">A calendar (station observation)</span>
          <input
            className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] p-2 text-xs"
            value={aCalendar}
            onChange={(e) => setACalendar(e.target.value)}
          />
          <span className="mt-1 block text-xs text-[var(--muted)]">
            {formatEmissionTime(aCalendar)}
          </span>
        </label>
        <label className="block text-sm">
          <span className="text-[var(--muted)]">B calendar (claimed present)</span>
          <input
            className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] p-2 text-xs"
            value={bCalendar}
            onChange={(e) => setBCalendar(e.target.value)}
          />
          <button
            type="button"
            onClick={syncBPresent}
            className="mt-1 text-xs text-[var(--accent)] underline"
          >
            Sync to now (present-tense)
          </button>
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-[var(--muted)]">Inventory (one item per line)</span>
        <textarea
          className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--background)] p-2 text-sm"
          rows={4}
          value={inventoryText}
          onChange={(e) => setInventoryText(e.target.value)}
        />
      </label>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full rounded bg-emerald-800 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save residence state"}
      </button>

      {message && <p className="text-xs text-[var(--muted)]">{message}</p>}
    </aside>
  );
}
