import type { LearningModule, Station } from "./types";
import type { StationProgress } from "./store";

export type Trophy = "none" | "bronze" | "prata" | "ouro";

export const TROPHY_LABEL: Record<Trophy, string> = {
  none: "Sem troféu",
  bronze: "Bronze",
  prata: "Prata",
  ouro: "Ouro",
};

export type ProgressMap = Record<string, StationProgress>;

/**
 * 10% por abrir a estação, até 70% pelos blocos de conteúdo e 20% pelo quiz.
 */
export function stationPercent(station: Station, progress?: StationProgress): number {
  if (!progress?.visited) return 0;
  const total = station.blocks.length;
  const seen = station.blocks.filter((b) => progress.seenBlocks.includes(b.id)).length;
  const blockRatio = total === 0 ? 1 : seen / total;
  return Math.round(10 + 70 * blockRatio + (progress.quizPassed ? 20 : 0));
}

export type ModuleStats = {
  percent: number;
  stations: { station: Station; percent: number; progress?: StationProgress }[];
  visited: number;
  explored: number;
  dominated: number;
  total: number;
  trophy: Trophy;
};

export function moduleStats(mod: LearningModule, progress: ProgressMap): ModuleStats {
  const rows = mod.stations.map((station) => {
    const p = progress[station.id];
    return { station, progress: p, percent: stationPercent(station, p) };
  });
  const total = rows.length;
  const sum = rows.reduce((acc, r) => acc + r.percent, 0);
  const visited = rows.filter((r) => r.percent > 0).length;
  const explored = rows.filter((r) => r.percent >= 80).length;
  const dominated = rows.filter((r) => r.percent === 100).length;
  const percent = total === 0 ? 0 : Math.round(sum / total);

  let trophy: Trophy = "none";
  if (total > 0 && visited === total) trophy = "bronze";
  if (total > 0 && explored === total) trophy = "prata";
  if (total > 0 && dominated === total) trophy = "ouro";

  return { percent, stations: rows, visited, explored, dominated, total, trophy };
}

export function overallPercent(
  modules: LearningModule[],
  progress: ProgressMap,
): number {
  const rates = modules.flatMap((m) =>
    m.stations.map((s) => stationPercent(s, progress[s.id])),
  );
  if (rates.length === 0) return 0;
  return Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
}
