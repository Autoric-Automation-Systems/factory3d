import type { Station } from "@/lib/types";

export const capsulagem: Station = {
  id: "agua-06-capsulagem",
  name: "Capsulagem",
  role: "Aplica, rosqueia e sela a tampa garantindo integridade e lacre",
  disciplines: ["mecanica", "pneumatica", "eletrica", "qualidade"],
  minutes: 6,
  machine: "capper",
  position: [11, -7],
  specs: [
    { label: "Tipo", value: "Rosqueadeira rotativa com 6 cabeçotes" },
    { label: "Torque de aplicação", value: "1,2–1,8 N·m" },
    { label: "Tampas", value: "Plástico 30/25 mm com anel de inviolabilidade" },
    { label: "Controle", value: "Sensor de tampa e rejeito automático" },
  ],
  blocks: [
    {
      id: "processo",
      title: "Por que esta etapa existe",
      paragraphs: [
        "A tampa é a barreira física entre a água tratada e o ambiente. Um torque baixo demais permite vazamento e perda de lacre; alto demais deforma a tampa e trinca a boca da garrafa.",
        "Depois da capsulagem, a garrafa está selada: qualquer abertura a partir daqui compromete a integridade do produto.",
      ],
      bullets: [
        "Entrada: garrafa cheia e tampa no alimentador",
        "Saída: garrafa selada com anel de inviolabilidade intacto",
        "Parâmetro crítico: torque e altura da tampa",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "As tampas descem pelo alimentador centrífugo e são orientadas por trilhos.",
        "A tampa é posicionada sobre a boca da garrafa na estrela de transferência.",
        "O cabeçote desce com mola e a garra aplica o torque programado.",
        "As garras giram e as estrias da tampa se acomodam na boca.",
        "Um sensor confere presença e altura da tampa; garrafa sem tampa é rejeitada.",
      ],
    },
    {
      id: "componentes",
      title: "Componentes",
      bullets: [
        "Alimentador centrífugo com disco seletor.",
        "Trilho de orientação e chicanas.",
        "Cabeçotes com garra, mola e ajuste de torque.",
        "Estrela de transferência e guias.",
        "Sensor de tampa e sistema de rejeito com sopro de ar.",
        "Contador de tampas e detector de dupla alimentação.",
      ],
    },
    {
      id: "operacao",
      title: "Ajuste",
      steps: [
        "Coloque o modelo correto de tampa no alimentador.",
        "Ajuste a altura do cabeçote com o gabarito do modelo.",
        "Ajuste o torque e valide com torquímetro em 5 garrafas por cabeçote.",
        "Verifique o anel de inviolabilidade: deve ficar preso à garrafa após abrir.",
        "Ajuste o sensor de tampa para rejeitar garrafa inclinada ou sem tampa.",
      ],
    },
  ],
  safety: [
    "Cabeçotes com mola sob compressão: alivie antes de desmontar.",
    "Alimentador centrífugo gira rápido e pode lançar tampas: use proteção ocular.",
    "Ar comprimido do rejeito não deve ser apontado para a pele.",
  ],
  faults: [
    {
      symptom: "Vazamento na garrafa com tampa aplicada",
      cause: "Torque abaixo do especificado ou tampa fora de esquadro",
      check: "Meça o torque com torquímetro e inspecione o trilho de orientação",
    },
    {
      symptom: "Garrafa amassada na boca",
      cause: "Torque alto demais ou cabeçote desalinhado",
      check: "Reduza o torque e confira centralização com o gabarito",
    },
    {
      symptom: "Muitas tampas em pé no trilho",
      cause: "Disco seletor desgastado ou velocidade do alimentador alta",
      check: "Ajuste a rotação do alimentador e inspecione o seletor",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "O que acontece com torque acima do especificado?",
      options: [
        "Melhora a vedação",
        "Deforma a tampa e pode trincar a boca da garrafa",
        "Aumenta a produção",
        "Reduz o consumo de tampas",
      ],
      answer: 1,
      explain: "Excesso de torque deforma a tampa e pode danificar mecanicamente a boca da garrafa.",
    },
    {
      id: "q2",
      prompt: "Qual instrumento confirma o torque de aplicação?",
      options: ["Paquímetro", "Torquímetro", "Multímetro", "Manômetro"],
      answer: 1,
      explain: "O torquímetro mede o esforço de abertura da tampa, que é o parâmetro de aceitação.",
    },
    {
      id: "q3",
      prompt: "Para que serve o anel de inviolabilidade?",
      options: [
        "Decorar a garrafa",
        "Evidenciar que a garrafa foi aberta após o envase",
        "Aumentar a pressão interna",
        "Facilitar a rotulagem",
      ],
      answer: 1,
      explain: "O anel se rompe na primeira abertura, funcionando como evidência de integridade.",
    },
  ],
  videoNote:
    "Animação esquemática: alimentador orientando tampas, cabeçote descendo, garras girando e garrafa selada saindo pela estrela.",
};
