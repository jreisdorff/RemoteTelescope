import { ArchiveTable } from "@/components/archive/ArchiveTable";
import { FeedbackTrigger } from "@/components/archive/FeedbackTrigger";
import { listAllQualia } from "@/lib/db/qualia";
import { JUPITER_VOYAGER_OBSERVATION } from "@/lib/seed/jupiter-observation";

export default function ArchivePage() {
  const packets = listAllQualia();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-widest text-[var(--muted)]">FEEDBACK ledger</p>
        <h1 className="mt-2 text-3xl font-semibold">Archive</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          All remote viewing packets and their verification status. Disconfirmation is recorded,
          not hidden.
        </p>
      </header>

      <FeedbackTrigger
        targetId="jupiter"
        observationKey={JUPITER_VOYAGER_OBSERVATION.key}
        label={JUPITER_VOYAGER_OBSERVATION.label}
      />

      <ArchiveTable packets={packets} />
    </div>
  );
}

export const dynamic = "force-dynamic";
