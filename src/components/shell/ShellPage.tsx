import GameFrame, { type ShellMap } from "./GameFrame";
import { lines } from "@/content/catalog";
import { moduleStats, overallPercent } from "@/lib/progress";
import { playableModules } from "@/content/catalog";
import type { UserRecord } from "@/lib/store";
import { brandAssets } from "@/lib/brand";

export function shellMaps(user: UserRecord): ShellMap[] {
  return lines.flatMap((line) =>
    line.modules.map((mod) => ({
      slug: mod.slug,
      name: mod.name,
      line: line.name,
      lineId: mod.lineId,
      summary: mod.summary,
      status: mod.status,
      stations: mod.stations.length,
      percent: mod.stations.length ? moduleStats(mod, user.progress).percent : 0,
    })),
  );
}

export default function ShellPage({
  user,
  children,
}: {
  user: UserRecord;
  children?: React.ReactNode;
}) {
  return (
    <GameFrame
      brand={brandAssets()}
      userName={user.name}
      plan={user.plan}
      percent={overallPercent(playableModules, user.progress)}
      maps={shellMaps(user)}
    >
      {children}
    </GameFrame>
  );
}
