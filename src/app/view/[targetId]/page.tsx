import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewingSession } from "@/components/viewing/ViewingSession";
import { getAnchorForTarget } from "@/lib/seed";
import { getSeedTarget } from "@/lib/seed/targets";

interface ViewPageProps {
  params: Promise<{ targetId: string }>;
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { targetId } = await params;
  const target = getSeedTarget(targetId);
  const anchor = getAnchorForTarget(targetId);

  if (!target || !anchor) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header>
        <Link href={`/world/${targetId}`} className="text-sm text-[var(--muted)]">
          ← Reconstruction
        </Link>
        <p className="mt-2 text-xs uppercase tracking-widest text-[var(--muted)]">
          Viewing chamber · L2
        </p>
        <h1 className="mt-1 text-3xl font-semibold">Remote viewing — {target.name}</h1>
      </header>
      <ViewingSession targetId={targetId} targetName={target.name} anchor={anchor} />
    </div>
  );
}
