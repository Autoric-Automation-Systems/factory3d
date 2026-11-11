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
