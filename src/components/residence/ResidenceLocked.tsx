import Link from "next/link";

interface ResidenceLockedProps {
  targetName: string;
  targetId: string;
  canonCount: number;
}

export function ResidenceLocked({ targetName, targetId, canonCount }: ResidenceLockedProps) {
  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-lg border border-[var(--border)] bg-[var(--panel)] p-8 text-center">
      <p className="text-xs uppercase tracking-widest text-amber-400">L3 locked</p>
      <h1 className="text-2xl font-semibold">Residence unavailable</h1>
      <p className="text-sm text-[var(--muted)]">
        Shared residence on <span className="text-[var(--foreground)]">{targetName}</span> requires
        at least one <span className="text-emerald-300">canon</span> remote viewing packet verified
        by FEEDBACK. You have {canonCount} canon packet{canonCount === 1 ? "" : "s"}.
      </p>
      <div className="flex flex-wrap justify-center gap-3 text-sm">
        <Link
          href={`/view/${targetId}`}
          className="rounded-md bg-violet-700 px-4 py-2 text-white no-underline"
        >
          Begin viewing →
        </Link>
        <Link
          href="/archive"
          className="rounded-md border border-[var(--border)] px-4 py-2 no-underline"
        >
          Run FEEDBACK →
        </Link>
        <Link
          href={`/world/${targetId}`}
          className="rounded-md border border-[var(--border)] px-4 py-2 no-underline"
        >
          Reconstruction →
        </Link>
      </div>
    </div>
  );
}
