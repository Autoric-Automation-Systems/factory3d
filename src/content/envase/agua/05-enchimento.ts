import type { Station } from "@/lib/types";

export const enchimento: Station = {
  id: "agua-05-enchimento",
  name: "Enchimento",
  role: "Dosa o volume nominal em cada garrafa com precisão e sem contaminação",
  disciplines: ["mecanica", "pneumatica", "automacao", "operacao", "qualidade"],
  minutes: 8,
  machine: "filler",
  position: [-3, -7],
  specs: [
    { label: "Tipo", value: "Rotativa isobárica, 24 bicos" },
    { label: "Capacidade", value: "12.000 garrafas/h" },
    { label: "Volume nominal", value: "500 mL (tolerância legal ±3%)" },
    { label: "Pressão de enchimento", value: "2,5 bar" },
  ],
  blocks: [
    {
      id: "processo",
      title: "O coração da linha",
      paragraphs: [
        "A enchedora recebe garrafas vazias vindas do enxágue, dosa o volume e entrega a garrafa cheia para a capsulagem. É a estação que define o ritmo de toda a linha.",
        "Em água sem gás, o enchimento é por gravidade ou por pressão. Em refrigerante e cerveja, é isobárico: a garrafa é pressurizada com CO₂ antes de receber o líquido, para não perder carbonatação.",
      ],
      bullets: [
        "Entrada: garrafa vazia enxaguada",
        "Saída: garrafa cheia no volume nominal",
        "Parâmetro crítico: nível de enchimento e ausência de espuma",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "A garrafa entra na estrela de transferência e é centralizada sob o bico.",
        "O bico desce e veda a boca da garrafa.",
        "A válvula abre e o líquido desce pelo tubo de enchimento até o nível definido pelo tubo de retorno.",
        "Quando o nível atinge a extremidade inferior do tubo, o ar/ gás não escapa mais e o fluxo para.",
        "O bico sobe, a garrafa sai para a capsulagem e a válvula se prepara para o próximo ciclo.",
      ],
    },
    {
      id: "componentes",
      title: "Componentes",
      bullets: [
        "Carrossel com tanque de nível constante e 24 válvulas de enchimento.",
        "Bicos com mola, vedação de borracha e tubo de retorno de ar.",
        "Estrelas de entrada e saída com guias de nylon.",
        "Servo ou redutor principal com encoder para sincronismo.",
        "Sensores de garrafa presente/ausente e de nível do tanque.",
        "Sistema CIP acoplado ao tanque e às linhas de enchimento.",
      ],
    },
    {
      id: "operacao",
      title: "Ajuste e partida",
      steps: [
        "Confirme a pressão do produto e o nível do tanque antes de partir.",
        "Rode a máquina em vazio e verifique se todos os bicos vedam.",
        "Ajuste a altura do bico conforme o modelo de garrafa e trave o batente.",
        "Faça a primeira volta e pese 5 garrafas de cada bico para conferir volume.",
        "Se houver espuma, reduza a pressão ou ajuste a temperatura do produto.",
      ],
    },
  ],
  safety: [
    "Partes rotativas sem proteção: nunca intervenha com a máquina em movimento.",
    "Vidro quebrado na esteira deve parar a linha imediatamente e ser recolhido com EPI.",
    "Piso molhado é risco de queda: mantenha ralos e contenções funcionando.",
  ],
  faults: [
    {
      symptom: "Volume abaixo do nominal em bicos alternados",
      cause: "Vedação do bico gasta ou tubo de retorno obstruído",
      check: "Faça o teste de peso por bico e inspecione o o-ring",
    },
    {
      symptom: "Espuma transbordando na garrafa",
      cause: "Pressão alta, produto quente ou queda brusca de pressão",
      check: "Ajuste a pressão de enchimento e confira a temperatura",
    },
    {
      symptom: "Garrafa tombando na estrela de saída",
      cause: "Sincronismo ou guia desalinhada",
      check: "Verifique o encoder, a correia e a altura das guias",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Em uma enchedora isobárica, o que acontece antes do líquido entrar?",
      options: [
        "A garrafa é resfriada",
        "A garrafa é pressurizada com CO₂ para equilibrar a pressão",
        "A garrafa é pesada",
        "O rótulo é aplicado",
      ],
      answer: 1,
      explain:
        "O enchimento isobárico equaliza a pressão entre garrafa e tanque, evitando perda de CO₂ e espuma.",
    },
    {
      id: "q2",
      prompt: "O que define o nível de enchimento em uma enchedora por gravidade?",
      options: [
        "O tempo de abertura do bico",
        "A posição do tubo de retorno de ar",
        "A temperatura da água",
        "A velocidade da esteira",
      ],
      answer: 1,
      explain:
        "Quando o líquido cobre a ponta do tubo de retorno, o ar não escapa e o fluxo cessa: o nível fica definido pela geometria.",
    },
    {
      id: "q3",
      prompt: "Volume de 480 mL em garrafa de 500 mL significa, em relação à tolerância de ±3%,",
      options: [
        "Dentro da tolerância",
        "Fora da tolerância (mínimo 485 mL)",
        "Irrelevante para a qualidade",
        "Aceitável se o rótulo indicar",
      ],
      answer: 1,
      explain:
        "3% de 500 mL são 15 mL. O mínimo aceitável é 485 mL; 480 mL está fora da faixa legal.",
    },
  ],
  videoNote:
    "Animação esquemática: carrossel girando, bico descendo, líquido subindo e nível estabilizando no tubo de retorno.",
};
