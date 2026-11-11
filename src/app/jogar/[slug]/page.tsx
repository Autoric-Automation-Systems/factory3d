import { notFound } from "next/navigation";
import GameShell from "@/components/game/GameShell";
import { requireUser } from "@/lib/session";
import { getModule } from "@/content/catalog";

export const dynamic = "force-dynamic";

export default async function JogarPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  const { slug } = await params;
  const { e } = await searchParams;
  const user = await requireUser();
  const mod = getModule(slug);
  if (!mod || mod.status !== "playable") notFound();

  const startStationId = mod.stations.some((s) => s.id === e) ? e : undefined;

  return (
    <GameShell
      module={mod}
      plan={user.plan}
      initialProgress={user.progress}
      initialFavorites={user.favorites}
      startStationId={startStationId}
      userName={user.name}
    />
  );
}
