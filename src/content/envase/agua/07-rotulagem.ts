import type { Station } from "@/lib/types";

export const rotulagem: Station = {
  id: "agua-07-rotulagem",
  name: "Rotulagem e codificação",
  role: "Identifica o produto, aplica a data de validade e o lote",
  disciplines: ["mecanica", "automacao", "eletronica", "qualidade"],
  minutes: 6,
  machine: "labeler",
  position: [9, -7],
  specs: [
    { label: "Rotuladora", value: "Rotativa com cola fria, 8.000 garrafas/h" },
    { label: "Codificador", value: "Jato de tinta contínuo (CIJ)" },
    { label: "Informação impressa", value: "Lote, data de fabricação e validade" },
    { label: "Controle", value: "Visão com rejeito de rótulo desalinhado" },
  ],
  blocks: [
    {
      id: "processo",
      title: "Rastreabilidade começa aqui",
      paragraphs: [
        "O rótulo é o contrato visual com o consumidor: marca, volume, composição e origem. A codificação é o que permite rastrear um lote até o lote de tampas e de água usados naquele turno.",
        "Se houver um recall, é o código impresso que diz quais garrafas precisam ser recolhidas.",
      ],
      bullets: [
        "Entrada: garrafa selada",
        "Saída: garrafa rotulada e codificada",
        "Parâmetro crítico: legibilidade do código e alinhamento do rótulo",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "A garrafa gira na estação de colagem enquanto a pinça retira o rótulo da pilha.",
        "A cola é aplicada no rótulo ou na garrafa, conforme o sistema.",
        "O rótulo é pressionado por escovas e roletes, alinhando-se à garrafa.",
        "A garrafa segue para o codificador, que imprime lote e validade por jato de tinta.",
        "Um sensor de visão valida presença, alinhamento e legibilidade; o rejeito é automático.",
      ],
    },
    {
      id: "componentes",
      title: "Componentes",
      bullets: [
        "Berço de rótulos com ajuste de largura.",
        "Cabeçote de cola com bico dosador e bomba.",
        "Pinça de transferência e escovas de acabamento.",
        "Cabeça de impressão CIJ, com solvente e tinta.",
        "Encoder de linha para sincronizar impressão com velocidade.",
        "Sistema de visão e rejeito por sopro.",
      ],
    },
    {
      id: "operacao",
      title: "Operação",
      steps: [
        "Coloque o rótulo correto e confira o código de material com a ordem de produção.",
        "Ajuste o berço, a pinça e as escovas para o diâmetro da garrafa.",
        "Faça o teste de colagem em 10 garrafas e confira alinhamento.",
        "Configure a mensagem do codificador (lote e validade) e faça o teste de legibilidade.",
        "Valide o rejeito provocando uma falha proposital no início do turno.",
      ],
    },
  ],
  safety: [
    "Solvente do codificador é inflamável e volátil: mantenha ventilação e longe de fontes de ignição.",
    "Contato com a pele: lave imediatamente e consulte a FISPQ.",
    "Nunca limpe a cabeça de impressão com a máquina em produção.",
  ],
  faults: [
    {
      symptom: "Rótulo saindo torto",
      cause: "Pinça desalinhada ou escova com pressão desigual",
      check: "Ajuste o berço e a simetria das escovas; confira o diâmetro da garrafa",
    },
    {
      symptom: "Código ilegível ou falhado",
      cause: "Bico entupido, carga insuficiente ou encoder fora de sincronia",
      check: "Faça o flush do bico, verifique o nível de tinta e o sinal do encoder",
    },
    {
      symptom: "Rótulo descolando após 24 h",
      cause: "Cola vencida ou superfície úmida",
      check: "Confira validade da cola e o secador de garrafa antes da rotulagem",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Para que serve o código impresso na garrafa?",
      options: [
        "Apenas estética",
        "Rastrear lote e validade, permitindo recall preciso",
        "Aumentar a resistência da garrafa",
        "Substituir o rótulo",
      ],
      answer: 1,
      explain: "Lote e validade são a base da rastreabilidade e do recall.",
    },
    {
      id: "q2",
      prompt: "O codificador CIJ precisa do sinal do encoder para",
      options: [
        "sincronizar a impressão com a velocidade da linha",
        "aquecer a tinta",
        "controlar o torque da tampa",
        "medir o volume",
      ],
      answer: 0,
      explain: "Sem encoder, a impressão fica esticada ou comprimida conforme a linha acelera.",
    },
    {
      id: "q3",
      prompt: "Como validar o sistema de rejeito no início do turno?",
      options: [
        "Confiar no histórico do turno anterior",
        "Provocar uma falha proposital e confirmar que a garrafa é rejeitada",
        "Desligar o sensor",
        "Aumentar a velocidade da esteira",
      ],
      answer: 1,
      explain: "Teste funcional do rejeito é a única forma de garantir que o controle está ativo.",
    },
  ],
  videoNote:
    "Animação esquemática: berço liberando rótulo, cola aplicada, escovas alinhando e cabeça CIJ imprimindo lote e validade.",
};
