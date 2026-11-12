import type { DisciplineId, LearningModule, ProductionLine, Station } from "@/lib/types";
import { captacao } from "./envase/agua/01-captacao";
import { filtracao } from "./envase/agua/02-filtracao";
import { osmose } from "./envase/agua/03-osmose";
import { desinfeccao } from "./envase/agua/04-desinfeccao";
import { enchimento } from "./envase/agua/05-enchimento";
import { capsulagem } from "./envase/agua/06-capsulagem";
import { rotulagem } from "./envase/agua/07-rotulagem";
import { empacotamento } from "./envase/agua/08-empacotamento";
import { paletizacao } from "./envase/agua/09-paletizacao";
import { envolvimento } from "./envase/agua/10-envolvimento";

/** As disciplinas da estação saem dos tópicos: uma fonte só, sem lista paralela. */
const withDisciplines = (station: Station): Station => {
  const disciplines: DisciplineId[] = [];
  for (const topic of station.materias) {
    if (!disciplines.includes(topic.discipline)) disciplines.push(topic.discipline);
  }
  if (station.safety.length > 0 && !disciplines.includes("seguranca")) {
    disciplines.push("seguranca");
  }
  return { ...station, disciplines };
};

export const agua: LearningModule = {
  id: "envase-agua",
  slug: "agua",
  name: "Água mineral",
  lineId: "envase",
  summary:
    "Da captação no poço artesiano ao palete envolvido: dez estações que explicam o ciclo completo de uma linha de envase de água.",
  status: "playable",
  goals: [
    "Explicar o fluxo do processo do poço à expedição",
    "Reconhecer os equipamentos de cada etapa",
    "Ler os parâmetros de qualidade de cada estação",
    "Identificar as falhas mais comuns e o que verificar",
  ],
  stations: [
    captacao,
    filtracao,
    osmose,
    desinfeccao,
    enchimento,
    capsulagem,
    rotulagem,
    empacotamento,
    paletizacao,
    envolvimento,
  ].map(withDisciplines),
};

const soon = (
  slug: string,
  name: string,
  summary: string,
  lineId: string,
): LearningModule => ({
  id: `${lineId}-${slug}`,
  slug,
  name,
  lineId,
  summary,
  status: "soon",
  stations: [],
});

export const lines: ProductionLine[] = [
  {
    id: "envase",
    name: "Envase",
    tagline: "Bebidas e líquidos em geral",
    description:
      "Linhas de envase de líquidos: tratamento de água, xarope, carbonatação, enchimento, rotulagem e paletização.",
    modules: [
      agua,
      soon(
        "refrigerante",
        "Refrigerante",
        "Xarope simples e composto, dosagem, carbonatação e enchimento isobárico.",
        "envase",
      ),
      soon(
        "cerveja",
        "Cerveja",
        "CIP, fermentação, enchimento isobárico e pasteurização em túnel.",
        "envase",
      ),
      soon(
        "molho-de-tomate",
        "Molho de tomate",
        "Preparo, pasteurização flash e enchimento hot-fill.",
        "envase",
      ),
      soon(
        "azeite",
        "Azeite",
        "Filtração, enchimento a frio, capsulagem e rotulagem.",
        "envase",
      ),
    ],
  },
  {
    id: "automotivo",
    name: "Automotivo",
    tagline: "Veículos e componentes",
    description:
      "Estamparia, solda robotizada, pintura, montagem final e testes de qualidade.",
    modules: [
      soon(
        "carro-combustao",
        "Carro a combustão",
        "Estamparia, solda, pintura e montagem final.",
        "automotivo",
      ),
      soon(
        "carro-eletrico",
        "Carro elétrico",
        "Pack de baterias, motor elétrico, inversor e teste de alta tensão.",
        "automotivo",
      ),
      soon("moto", "Moto", "Solda de quadro, pintura e montagem final.", "automotivo"),
      soon(
        "bicicleta",
        "Bicicleta",
        "Corte de tubos, solda de quadro, pintura e montagem.",
        "automotivo",
      ),
    ],
  },
  {
    id: "eletronicos",
    name: "Eletrônicos",
    tagline: "Eletrodomésticos e dispositivos",
    description:
      "Montagem de placas SMT, refusão, inspeção óptica e montagem final.",
    modules: [
      soon(
        "geladeira",
        "Geladeira",
        "Termoformagem, injeção, espuma de isolamento e carga de gás.",
        "eletronicos",
      ),
      soon("tv", "TV", "SMT, backlight, montagem final e teste de imagem.", "eletronicos"),
      soon("pc", "PC", "SMT de placa-mãe, montagem e teste funcional.", "eletronicos"),
      soon(
        "notebook",
        "Notebook",
        "SMT, montagem de tela, gravação de BIOS e teste.",
        "eletronicos",
      ),
    ],
  },
];

export const allModules: LearningModule[] = lines.flatMap((l) => l.modules);

export function getModule(slug: string): LearningModule | undefined {
  return allModules.find((m) => m.slug === slug);
}

export function getLine(id: string): ProductionLine | undefined {
  return lines.find((l) => l.id === id);
}

export function findStation(id: string): { station: Station; module: LearningModule } | undefined {
  for (const mod of allModules) {
    const station = mod.stations.find((s) => s.id === id);
    if (station) return { station, module: mod };
  }
  return undefined;
}

export function moduleOfStation(id: string): LearningModule | undefined {
  return findStation(id)?.module;
}

export const playableModules = allModules.filter((m) => m.status === "playable");

export const totalStations = playableModules.reduce(
  (sum, m) => sum + m.stations.length,
  0,
);
