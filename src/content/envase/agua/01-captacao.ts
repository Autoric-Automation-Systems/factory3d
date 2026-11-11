import type { Station } from "@/lib/types";

export const captacao: Station = {
  id: "agua-01-captacao",
  name: "Captação de água",
  role: "Retira a água bruta do poço e a envia pressurizada para o tratamento",
  disciplines: ["hidraulica", "eletrica", "operacao", "seguranca"],
  minutes: 5,
  machine: "well",
  position: [-27, -7],
  specs: [
    { label: "Vazão de projeto", value: "8 m³/h" },
    { label: "Bomba submersível", value: "4 cv, 380 V trifásica" },
    { label: "Profundidade do poço", value: "62 m" },
    { label: "Pressão na saída", value: "2,5 bar" },
  ],
  blocks: [
    {
      id: "processo",
      title: "Onde esta estação entra no processo",
      paragraphs: [
        "Toda a linha começa aqui. O poço artesiano atravessa camadas impermeáveis até o aquífero, e a água sobe por uma bomba submersível instalada dentro do poço, abaixo do nível dinâmico.",
        "A água bruta ainda não é potável: ela carrega areia, ferro, manganês e microrganismos. Por isso segue pressurizada para a filtração, nunca para o enchimento.",
      ],
      bullets: [
        "Entrada: água bruta do aquífero",
        "Saída: água bruta pressurizada para o tratamento",
        "Consumo típico: 1,15 L de água bruta por litro envasado (perda no tratamento e no CIP)",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "O nível estático é medido com a bomba desligada; o nível dinâmico é medido com ela em operação.",
        "A bomba submersível é acionada por um painel com proteção contra falta de fase, sobrecarga e operação a seco.",
        "Um pressostato e um transmissor de pressão monitoram a linha de recalque.",
        "Uma válvula de retenção impede o golpe de aríete quando a bomba desliga.",
        "O hidrômetro totaliza o volume captado para controle de outorga e de balanço hídrico.",
      ],
    },
    {
      id: "componentes",
      title: "Componentes que você precisa reconhecer",
      bullets: [
        "Bomba submersível: motor elétrico e rotor dentro da água, resfriados pelo próprio fluido.",
        "Cabeçote do poço: flange, vedação sanitária e passagem do cabo elétrico.",
        "Painel de comando: disjuntor motor, contator, relé de sobrecarga e proteção de sequência de fase.",
        "Válvula de retenção e registro de gaveta: controle de fluxo e manutenção.",
        "Transmissor de pressão 4–20 mA: envia o sinal ao CLP ou ao inversor de frequência.",
      ],
    },
    {
      id: "operacao",
      title: "Partida e parada",
      steps: [
        "Confira o nível do poço e o horário de captação autorizado na outorga.",
        "Abra o registro de saída e verifique se a válvula de retenção está assentada.",
        "Ligue a bomba no painel local e observe a pressão estabilizar em torno de 2,5 bar.",
        "Confirme a vazão no hidrômetro e a ausência de ruído de cavitação.",
        "Na parada, desligue a bomba antes de fechar o registro para evitar sobrepressão.",
      ],
    },
  ],
  safety: [
    "Área do poço é espaço confinado: nunca desça sem permissão de trabalho e vigia.",
    "Serviço no painel elétrico exige bloqueio e etiquetagem (LOTO) e verificação de ausência de tensão.",
    "Cabo submersível danificado é risco de choque elétrico dentro da água.",
  ],
  faults: [
    {
      symptom: "Bomba não parte e o painel indica falta de fase",
      cause: "Elo fusível queimado ou fase ausente na alimentação",
      check: "Meça tensão entre fases na entrada do painel e teste a continuidade dos fusíveis",
    },
    {
      symptom: "Pressão oscilando e ruído de pedras na tubulação",
      cause: "Cavitação por nível dinâmico baixo ou entrada de ar",
      check: "Compare o nível dinâmico com a curva da bomba e verifique a vedação do cabeçote",
    },
    {
      symptom: "Vazão cai com o passar das horas",
      cause: "Entupimento gradual do pré-filtro ou desgaste do rotor",
      check: "Leia a pressão diferencial do pré-filtro e o consumo de corrente do motor",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Por que a água captada não pode ir direto para o enchimento?",
      options: [
        "Porque o poço é profundo demais",
        "Porque a água bruta contém areia, ferro, manganês e microrganismos",
        "Porque a bomba não gera pressão suficiente",
        "Porque a legislação proíbe captação própria",
      ],
      answer: 1,
      explain:
        "A captação entrega água bruta. Potabilidade só é atingida depois de filtração, desinfecção e, no caso de água mineral, dos processos específicos da legislação vigente.",
    },
    {
      id: "q2",
      prompt: "Qual componente evita o retorno de água e o golpe de aríete ao desligar a bomba?",
      options: [
        "O hidrômetro",
        "A válvula de retenção",
        "O transmissor de pressão",
        "O relé de sobrecarga",
      ],
      answer: 1,
      explain:
        "A válvula de retenção fecha quando o fluxo inverte, protegendo a bomba e a tubulação contra o choque de pressão.",
    },
    {
      id: "q3",
      prompt: "Qual leitura indica cavitação?",
      options: [
        "Pressão estável e corrente nominal",
        "Ruído de bombeamento de sólidos com pressão oscilante",
        "Vazão constante no hidrômetro",
        "Temperatura do motor em 40 °C",
      ],
      answer: 1,
      explain:
        "Cavitação gera ruído característico e oscilação de pressão. Se não for corrigida, destrói o rotor em poucas semanas.",
    },
  ],
  videoNote:
    "Animação esquemática: nível estático, nível dinâmico, bomba submersível e fluxo ascendente até o header de tratamento.",
};
