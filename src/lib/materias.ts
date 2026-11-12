import type { DisciplineId, LearningModule, MateriaTopic, Station } from "./types";
import { DISCIPLINES } from "./types";

export const LEVEL_LABEL: Record<1 | 2 | 3, string> = {
  1: "Fundamento",
  2: "Operação",
  3: "Diagnóstico",
};

export type MateriaGroup = {
  discipline: DisciplineId;
  label: string;
  topics: MateriaTopic[];
};

export type MateriaEntry = {
  module: LearningModule;
  station: Station;
  topic: MateriaTopic;
  /** Posição dentro da matéria daquela estação. */
  index: number;
};

/** Ordem de leitura: sempre do mais simples para o mais avançado. */
export function sortTopics(topics: MateriaTopic[]): MateriaTopic[] {
  return [...topics].sort(
    (a, b) => a.level - b.level || a.title.localeCompare(b.title, "pt-BR"),
  );
}

export function stationMaterias(station: Station): MateriaGroup[] {
  const byDiscipline = new Map<DisciplineId, MateriaTopic[]>();
  for (const topic of station.materias) {
    const list = byDiscipline.get(topic.discipline) ?? [];
    list.push(topic);
    byDiscipline.set(topic.discipline, list);
  }

  return [...byDiscipline.entries()].map(([discipline, topics]) => ({
    discipline,
    label: DISCIPLINES[discipline],
    topics: sortTopics(topics),
  }));
}

/** Uma disciplina, todas as estações: o que a página /materias mostra. */
export function materiaFeed(
  modules: LearningModule[],
  discipline: DisciplineId,
): MateriaEntry[] {
  return modules
    .flatMap((module) => module.stations.map((station) => ({ module, station })))
    .flatMap(({ module, station }) => {
      const topics = sortTopics(
        station.materias.filter((topic) => topic.discipline === discipline),
      );
      return topics.map((topic, index) => ({ module, station, topic, index }));
    })
    .sort((a, b) => a.topic.level - b.topic.level);
}

export type MateriaIndexRow = {
  discipline: DisciplineId;
  label: string;
  topics: number;
  stations: number;
};

export function materiaIndex(modules: LearningModule[]): MateriaIndexRow[] {
  const rows = new Map<DisciplineId, { topics: number; stations: Set<string> }>();
  for (const module of modules) {
    for (const station of module.stations) {
      for (const topic of station.materias) {
        const row = rows.get(topic.discipline) ?? { topics: 0, stations: new Set<string>() };
        row.topics += 1;
        row.stations.add(station.id);
        rows.set(topic.discipline, row);
      }
    }
  }

  return [...rows.entries()]
    .map(([discipline, row]) => ({
      discipline,
      label: DISCIPLINES[discipline],
      topics: row.topics,
      stations: row.stations.size,
    }))
    .sort((a, b) => b.topics - a.topics);
}
