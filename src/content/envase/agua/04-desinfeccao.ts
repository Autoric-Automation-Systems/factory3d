import type { Station } from "@/lib/types";

export const desinfeccao: Station = {
  id: "agua-04-desinfeccao",
  name: "Ozonização e UV",
  role: "Garante a barreira microbiológica antes do enchimento",
  disciplines: ["eletronica", "eletrica", "automacao", "qualidade", "seguranca"],
  minutes: 6,
  machine: "uv",
  position: [-3, -7],
  specs: [
    { label: "Gerador de ozônio", value: "10 g/h a partir de oxigênio" },
    { label: "Reator UV", value: "254 nm, 4 lâmpadas de 55 W" },
    { label: "Dose de ozônio", value: "0,4 mg/L, contato de 4 min" },
    { label: "Monitor", value: "Ozônio residual e intensidade UV" },
  ],
  blocks: [
    {
      id: "processo",
      title: "Papel no processo",
      paragraphs: [
        "A desinfecção é a última barreira antes do enchimento. O ozônio oxida a parede celular dos microrganismos; a luz ultravioleta em 254 nm danifica o material genético.",
        "O ozônio tem vantagem de não deixar residual saboroso, mas precisa de tempo de contato. A UV não deixa residual nenhum — é uma barreira de passagem, não de armazenamento.",
      ],
      bullets: [
        "Entrada: permeado filtrado",
        "Saída: água pronta para enchimento",
        "Controle: ozônio residual, intensidade UV e contagem microbiológica",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "O gerador produz ozônio a partir de oxigênio sob descarga elétrica.",
        "O ozônio é injetado por venturi na linha de água.",
        "A água ozonizada percorre um tanque de contato, onde o tempo de residência garante a dose.",
        "Na saída, um destruidor de ozônio protege a linha e o ambiente.",
        "Em paralelo, a água passa pelo reator UV, com lâmpadas monitoradas por sensor de intensidade.",
      ],
    },
    {
      id: "componentes",
      title: "Componentes",
      bullets: [
        "Gerador de ozônio com fonte de alta tensão e célula de descarga.",
        "Injetor venturi e bomba de recirculação.",
        "Tanque de contato com purga e respiro.",
        "Destruidor de ozônio (carvão ou catalítico) no respiro.",
        "Reator UV com lâmpadas, quartzo protetor e sensor de intensidade.",
        "Sensores de ozônio residual dissolvido (ppm).",
      ],
    },
    {
      id: "operacao",
      title: "Operação",
      steps: [
        "Confirme o tempo de contato antes de liberar a linha.",
        "Verifique a vazão de oxigênio e a pressão na célula do gerador.",
        "Registre a intensidade UV diariamente; lâmpada perde eficiência com o tempo.",
        "Limpe o tubo de quartzo conforme o plano de manutenção.",
        "Intertravamento: sem UV ou sem ozônio, a linha de enchimento não deve partir.",
      ],
    },
  ],
  safety: [
    "Ozônio é irritante respiratório: a área precisa de exaustão e detector de vazamento.",
    "A luz UV é nociva aos olhos e à pele; nunca olhe o reator aberto e use proteção.",
    "Alta tensão no gerador: bloqueie e etiquete antes de abrir o painel.",
  ],
  faults: [
    {
      symptom: "Ozônio residual zerado com gerador ligado",
      cause: "Vazamento de ozônio, venturi entupido ou oxigênio insuficiente",
      check: "Verifique pressão de oxigênio, sucção do venturi e teste de estanqueidade",
    },
    {
      symptom: "Sensor UV alarmando intensidade baixa",
      cause: "Lâmpada no fim da vida útil ou quartzo sujo",
      check: "Compare horas de uso da lâmpada e inspecione o tubo de quartzo",
    },
    {
      symptom: "Contagem microbiológica acima do limite na saída",
      cause: "Dose insuficiente, tempo de contato curto ou contaminação a jusante",
      check: "Valide dose × tempo de contato e faça swab nos pontos de enchimento",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Por que o ozônio precisa de tanque de contato?",
      options: [
        "Para resfriar a água",
        "Para garantir tempo de contato e dose suficiente para inativar microrganismos",
        "Para filtrar partículas",
        "Para aumentar a pressão",
      ],
      answer: 1,
      explain: "A eficácia depende de concentração × tempo de contato (CT). Sem contato, não há dose.",
    },
    {
      id: "q2",
      prompt: "Qual é a principal diferença entre UV e ozônio?",
      options: [
        "A UV altera o pH",
        "A UV não deixa residual; o ozônio pode permanecer dissolvido por algum tempo",
        "O ozônio não desinfeta",
        "A UV só funciona com água quente",
      ],
      answer: 1,
      explain:
        "A UV age apenas enquanto a água passa pelo reator. O ozônio tem residual que decai com o tempo.",
    },
    {
      id: "q3",
      prompt: "Por que a linha de enchimento deve ser intertravada com a desinfecção?",
      options: [
        "Para economizar energia",
        "Para impedir envase de água sem barreira microbiológica ativa",
        "Para reduzir o consumo de ozônio",
        "Para acelerar a produção",
      ],
      answer: 1,
      explain:
        "O intertravamento garante que nenhuma garrafa seja enchida com água que não passou pela barreira microbiológica.",
    },
  ],
  videoNote:
    "Animação esquemática: gerador, injetor venturi, tanque de contato com tempo de residência e reator UV com lâmpadas.",
};
