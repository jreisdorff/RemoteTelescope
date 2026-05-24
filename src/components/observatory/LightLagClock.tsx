"use client";

import { useEffect, useState } from "react";
import { formatLightLag } from "@/lib/format";

interface LightLagClockProps {
  targetName: string;
  lightLagSeconds: number;
}

export function LightLagClock({ targetName, lightLagSeconds }: LightLagClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const emissionTime =
    now != null
      ? new Date(now.getTime() - lightLagSeconds * 1000)
      : null;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-4">
      <p className="text-xs uppercase tracking-widest text-[var(--muted)]">Light-cone clock</p>
      <p className="mt-2 text-lg">
        You see <span className="font-semibold text-[var(--accent)]">{targetName}</span> as it was{" "}
        <span className="font-semibold">{formatLightLag(lightLagSeconds)}</span> ago.
      </p>
      {emissionTime && (
        <p className="mt-1 text-sm text-[var(--muted)]">
          Emission epoch (approx.): {emissionTime.toISOString().replace("T", " ").slice(0, 19)} UTC
        </p>
      )}
    </div>
  );
}
