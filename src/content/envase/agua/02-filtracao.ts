import type { Station } from "@/lib/types";

export const filtracao: Station = {
  id: "agua-02-filtracao",
  name: "Filtração (areia e carvão)",
  role: "Remove sólidos suspensos, turbidez, cloro e compostos orgânicos",
  disciplines: ["hidraulica", "mecanica", "operacao", "qualidade"],
  minutes: 6,
  machine: "filters",
  position: [-21, -7],
  specs: [
    { label: "Filtro de areia", value: "Ø 900 mm, leito 1,2 m, antracito + areia" },
    { label: "Filtro de carvão", value: "Carvão ativado granular vegetal" },
    { label: "Vazão de serviço", value: "6 m³/h (10 m/h de taxa)" },
    { label: "Retrolavagem", value: "Automática por diferencial de pressão" },
  ],
  blocks: [
    {
      id: "processo",
      title: "Papel no tratamento",
      paragraphs: [
        "A filtração é uma barreira física e adsortiva. O filtro de areia retém partículas em suspensão; o filtro de carvão ativado adsorve cloro, odores e compostos orgânicos que dariam gosto à água.",
        "Sem esta etapa, a osmose reversa entope em poucos dias e o produto final sai com gosto e odor perceptíveis.",
      ],
      bullets: [
        "Entrada: água bruta pressurizada",
        "Saída: água clarificada e sem cloro residual",
        "Parâmetro de controle: turbidez < 1 NTU na saída",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "A água entra pelo topo do filtro e desce pelo leito filtrante.",
        "As partículas ficam presas entre os grãos; a sujeira acumulada aumenta a perda de carga.",
        "Quando o diferencial de pressão atinge o limite, a válvula automática inverte o fluxo: é a retrolavagem.",
        "A retrolavagem expande o leito e arrasta a sujeira para o dreno.",
        "Depois vem o enxágue rápido para reassentar o leito antes de voltar ao serviço.",
      ],
    },
    {
      id: "componentes",
      title: "Componentes",
      bullets: [
        "Vasos de pressão com bocal superior, cesto coletor e bocal de dreno.",
        "Válvula automática de 5 vias (ou conjunto de 3 válvulas pneumáticas).",
        "Manômetros de entrada e saída: a diferença é a perda de carga.",
        "Medidor de turbidez na saída do conjunto.",
        "Bomba de retrolavagem ou uso da própria pressão da linha.",
      ],
    },
    {
      id: "operacao",
      title: "Rotina do operador",
      steps: [
        "Registre a perda de carga no início de cada turno.",
        "Programe a retrolavagem por tempo ou por diferencial (0,7 bar é um valor comum).",
        "Durante a retrolavagem, confirme que a água de dreno sai turva e clareia ao final.",
        "Após o enxágue, meça a turbidez e libere o filtro para serviço.",
        "Troque a carga de carvão conforme a vida útil indicada pelo fornecedor.",
      ],
    },
  ],
  safety: [
    "Vasos de pressão: nunca abra a tampa sem aliviar a pressão e confirmar 0 bar no manômetro.",
    "Retrolavagem gera jato de água e arraste de ar: use óculos de proteção.",
    "Carvão ativado saturado pode liberar compostos adsorvidos de volta à água.",
  ],
  faults: [
    {
      symptom: "Perda de carga sobe rápido demais",
      cause: "Água de entrada com turbidez alta ou leito compactado",
      check: "Meça a turbidez na entrada e teste a retrolavagem com vazão de projeto",
    },
    {
      symptom: "Turbidez na saída acima do limite",
      cause: "Leito furado, bocal quebrado ou enxágue insuficiente",
      check: "Inspecione o cesto coletor e o histórico de retrolavagem",
    },
    {
      symptom: "Gosto e odor persistentes no produto",
      cause: "Carvão saturado ou com canal preferencial",
      check: "Compare a data de troca do carvão e faça teste sensorial de bancada",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "O que a retrolavagem faz?",
      options: [
        "Aquece a água para desinfecção",
        "Inverte o fluxo para expandir o leito e arrastar a sujeira retida",
        "Adiciona cloro ao processo",
        "Aumenta a pressão para a osmose",
      ],
      answer: 1,
      explain:
        "A retrolavagem inverte o sentido do fluxo. O leito se expande e libera a sujeira acumulada para o dreno.",
    },
    {
      id: "q2",
      prompt: "Qual grandeza indica que o filtro precisa de retrolavagem?",
      options: [
        "Diferencial de pressão entre entrada e saída",
        "Temperatura da água",
        "Condutividade elétrica",
        "Nível do poço",
      ],
      answer: 0,
      explain:
        "O entupimento do leito se manifesta como aumento da perda de carga, lida nos dois manômetros.",
    },
    {
      id: "q3",
      prompt: "Por que o carvão ativado é importante antes da osmose?",
      options: [
        "Porque deixa a água mais alcalina",
        "Porque adsorve cloro, que degradaria as membranas de poliamida",
        "Porque aumenta a vazão da bomba",
        "Porque substitui a desinfecção final",
      ],
      answer: 1,
      explain:
        "O cloro oxida as membranas de poliamida. O carvão protege as membranas e melhora o sabor da água.",
    },
  ],
  videoNote:
    "Animação esquemática: fluxo descendente pelo leito, acúmulo de sujeira, abertura das válvulas e retrolavagem ascendente.",
};
