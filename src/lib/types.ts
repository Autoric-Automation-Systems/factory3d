export type DisciplineId =
  | "automacao"
  | "eletrica"
  | "eletronica"
  | "mecanica"
  | "pneumatica"
  | "hidraulica"
  | "operacao"
  | "seguranca"
  | "qualidade";

export type ContentBlock = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explain: string;
};

export type MachineKind =
  | "well"
  | "filters"
  | "osmosis"
  | "uv"
  | "filler"
  | "capper"
  | "labeler"
  | "shrink"
  | "palletizer"
  | "wrapper";

/**
 * Conteúdo de matéria: um recorte técnico da estação dentro de uma disciplina.
 * `level` é a complexidade (1 fundamento, 2 operação, 3 diagnóstico) e define a
 * ordem de leitura — a primeira matéria lida é sempre a mais simples.
 */
export type MateriaTopic = {
  id: string;
  discipline: DisciplineId;
  level: 1 | 2 | 3;
  title: string;
  summary: string;
  bullets: string[];
};

export type Station = {
  id: string;
  name: string;
  role: string;
  disciplines: DisciplineId[];
  minutes: number;
  machine: MachineKind;
  position: [number, number];
  specs: { label: string; value: string }[];
  blocks: ContentBlock[];
  materias: MateriaTopic[];
  safety: string[];
  faults: { symptom: string; cause: string; check: string }[];
  quiz: QuizQuestion[];
  videoNote?: string;
  videoUrl?: string;
};

export type LearningModule = {
  id: string;
  slug: string;
  name: string;
  lineId: string;
  summary: string;
  status: "playable" | "soon";
  goals?: string[];
  stations: Station[];
};

export type ProductionLine = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  modules: LearningModule[];
};

export const DISCIPLINES: Record<DisciplineId, string> = {
  automacao: "Automação",
  eletrica: "Elétrica",
  eletronica: "Eletrônica",
  mecanica: "Mecânica",
  pneumatica: "Pneumática",
  hidraulica: "Hidráulica",
  operacao: "Operação",
  seguranca: "Segurança",
  qualidade: "Qualidade",
};
