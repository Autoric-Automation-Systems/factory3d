import type { Station } from "@/lib/types";

export const osmose: Station = {
  id: "agua-03-osmose",
  name: "Osmose reversa",
  role: "Retira sais dissolvidos e reduz a condutividade a níveis de água mineral",
  disciplines: ["hidraulica", "eletrica", "automacao", "qualidade"],
  minutes: 7,
  machine: "osmosis",
  position: [-10, -7],
  specs: [
    { label: "Membranas", value: "6 × 4040 poliamida composta" },
    { label: "Pressão de operação", value: "10–14 bar" },
    { label: "Recuperação", value: "70–75%" },
    { label: "Condutividade do permeado", value: "< 20 µS/cm" },
  ],
  blocks: [
    {
      id: "processo",
      title: "Papel no tratamento",
      paragraphs: [
        "A osmose reversa (OR) empurra a água contra uma membrana semipermeável. A membrana deixa passar a água e retém a maior parte dos sais dissolvidos.",
        "O resultado se divide em dois fluxos: permeado, que segue para o envase, e concentrado, que leva os sais embora. A relação entre eles define a recuperação do sistema.",
      ],
      bullets: [
        "Entrada: água filtrada a baixa salinidade",
        "Saída: permeado (produto) e concentrado (descarte)",
        "Recuperação = permeado ÷ alimentação × 100",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "Uma bomba de alta pressão eleva a água a 10–14 bar, acima da pressão osmótica.",
        "A água atravessa a membrana em espiral; sais e moléculas grandes são arrastados pelo concentrado.",
        "O permeado sai pelo centro do enrolamento e segue para o tanque de água tratada.",
        "Uma válvula de agulha controla a vazão de concentrado e, com isso, a recuperação.",
        "Sensores de condutividade na alimentação e no permeado permitem calcular a rejeição de sais.",
      ],
    },
    {
      id: "componentes",
      title: "Componentes",
      bullets: [
        "Bomba de alta pressão em inox, normalmente com inversor de frequência.",
        "Vasos de pressão (pressure vessels) com membranas 4040 ou 8040.",
        "Pré-filtro de cartucho de 5 µm como proteção final das membranas.",
        "Válvulas de alívio, válvula de agulha do concentrado e manômetros.",
        "Transmissores de condutividade e vazômetros de permeado e concentrado.",
        "Painel com intertravamento: sem pressão mínima, a bomba não parte.",
      ],
    },
    {
      id: "operacao",
      title: "Operação e controle",
      steps: [
        "Abra a válvula de concentrado antes de partir a bomba.",
        "Parta a bomba e suba a pressão lentamente até a faixa de trabalho.",
        "Ajuste a recuperação; recuperação alta demais incrusta a membrana.",
        "Registre condutividade, vazões e pressão diferencial entre alimentação e concentrado.",
        "Ao parar, faça o flush com permeado para retirar sais concentrados das membranas.",
      ],
    },
  ],
  safety: [
    "Pressão de 14 bar: nunca abra conexões com o sistema pressurizado.",
    "O concentrado é descartado conforme a outorga; não desvie para o dreno pluvial.",
    "Produtos de limpeza química de membrana exigem EPI e neutralização antes do descarte.",
  ],
  faults: [
    {
      symptom: "Condutividade do permeado subiu de 15 para 60 µS/cm",
      cause: "Membrana danificada, o-ring folgado ou aumento de temperatura",
      check: "Compare a rejeição por vaso e faça teste de integridade com corante",
    },
    {
      symptom: "Queda de vazão com pressão mantida",
      cause: "Incrustação ou fouling orgânico na superfície da membrana",
      check: "Avalie a pressão diferencial e o histórico de pré-tratamento",
    },
    {
      symptom: "Bomba de alta pressão desarma",
      cause: "Pré-filtro saturado, válvula de sucção fechada ou falha do inversor",
      check: "Leia o código de falha no inversor e a pressão na sucção",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "O que significa recuperação de 75%?",
      options: [
        "75% dos sais são retidos",
        "75% da água de alimentação sai como permeado",
        "75% da bomba está carregada",
        "75% do concentrado é reaproveitado",
      ],
      answer: 1,
      explain:
        "Recuperação é a fração da alimentação que vira produto. O restante sai como concentrado.",
    },
    {
      id: "q2",
      prompt: "Por que a válvula de concentrado deve estar aberta na partida?",
      options: [
        "Para lavar o tanque",
        "Para evitar sobrepressão e fluxo nulo sobre a membrana",
        "Para aumentar a temperatura",
        "Para dosar cloro",
      ],
      answer: 1,
      explain:
        "Sem fluxo de concentrado, a pressão sobe e os sais se concentram sobre a membrana, causando incrustação e dano.",
    },
    {
      id: "q3",
      prompt: "Qual par de leituras permite calcular a rejeição de sais?",
      options: [
        "Nível do poço e vazão",
        "Condutividade da alimentação e do permeado",
        "Temperatura e pH",
        "Pressão e corrente do motor",
      ],
      answer: 1,
      explain:
        "Rejeição = (1 − condutividade do permeado ÷ condutividade da alimentação) × 100.",
    },
  ],
  videoNote:
    "Animação esquemática: bomba de alta pressão, vasos com membranas em espiral, permeado ao centro e concentrado ao dreno.",
};
