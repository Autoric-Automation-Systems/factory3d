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
  ],
  materias: [
    {
      id: "hidraulica-1",
      discipline: "hidraulica",
      level: 1,
      title: "Nível estático e nível dinâmico",
      summary: "Duas medidas do mesmo poço, com significados diferentes.",
      bullets: [
        "Nível estático: altura da água com a bomba desligada, em repouso.",
        "Nível dinâmico: altura da água com a bomba em operação, sempre mais baixa.",
        "A diferença entre os dois é o rebaixamento; se ela cresce, o poço está sendo exigido demais.",
      ],
    },
    {
      id: "hidraulica-2",
      discipline: "hidraulica",
      level: 2,
      title: "Bomba submersível",
      summary: "Motor e rotor trabalham dentro da água e são resfriados por ela.",
      bullets: [
        "Precisa ficar abaixo do nível dinâmico para não aspirar ar.",
        "Sem fluxo de água passando pelo motor, ele superaquece em poucos minutos.",
        "Cabo e vedação do cabeçote são a entrada de água mais comum para o motor queimar.",
      ],
    },
    {
      id: "hidraulica-3",
      discipline: "hidraulica",
      level: 2,
      title: "Válvula de retenção e golpe de aríete",
      summary: "Fecha quando o fluxo tenta voltar, protegendo bomba e tubulação.",
      bullets: [
        "Sem ela, a coluna de água volta e bate na bomba no desligamento.",
        "O golpe de aríete aparece como pancada na tubulação e pico de pressão.",
        "Retenção emperrada aberta causa retorno constante e a bomba gira ao contrário.",
      ],
    },
    {
      id: "hidraulica-4",
      discipline: "hidraulica",
      level: 3,
      title: "Cavitação e curva da bomba",
      summary: "Ruído de pedras e pressão oscilando indicam que a bomba está cavitando.",
      bullets: [
        "Compare vazão e pressão com a curva do fabricante: o ponto real de trabalho conta.",
        "Rebaixamento maior que o previsto reduz o NPSH disponível e inicia a cavitação.",
        "Cavitação crônica destrói rotor e camisa em semanas, não em meses.",
      ],
    },
    {
      id: "eletrica-1",
      discipline: "eletrica",
      level: 1,
      title: "Painel de comando do poço",
      summary: "Concentra a proteção e o acionamento do motor submersível.",
      bullets: [
        "Disjuntor motor, contator e relé de sobrecarga são o núcleo do painel.",
        "O ajuste do relé segue a corrente nominal da placa do motor.",
        "Etiqueta de identificação e diagrama na porta não são opcionais.",
      ],
    },
    {
      id: "eletrica-2",
      discipline: "eletrica",
      level: 2,
      title: "Falta de fase e sequência",
      summary: "Motor trifásico não parte ou vibra quando uma fase falta.",
      bullets: [
        "Meça tensão entre as três fases na entrada do painel, não só fase-neutro.",
        "Relé de sequência de fase evita que o motor gire ao contrário.",
        "Fase ausente queima o enrolamento em segundos: o painel deve desarmar antes.",
      ],
    },
    {
      id: "eletrica-3",
      discipline: "eletrica",
      level: 2,
      title: "Transmissor de pressão 4–20 mA",
      summary: "Converte a pressão da linha em sinal para o CLP ou o inversor.",
      bullets: [
        "4 mA é o zero vivo; 20 mA é o fundo de escala.",
        "Leitura em 0 mA indica laço rompido ou alimentação ausente.",
        "É esse sinal que permite manter pressão constante com inversor de frequência.",
      ],
    },
    {
      id: "eletrica-4",
      discipline: "eletrica",
      level: 3,
      title: "Partida direta, soft starter ou inversor",
      summary: "Três formas de partir o mesmo motor, com custos diferentes.",
      bullets: [
        "Partida direta: barata, corrente de partida alta e golpe hidráulico.",
        "Soft starter: sobe a tensão aos poucos e reduz o impacto mecânico.",
        "Inversor: controla a rotação e mantém pressão constante, ao custo de harmônicos.",
      ],
    },
    {
      id: "operacao-1",
      discipline: "operacao",
      level: 1,
      title: "Outorga e hidrômetro",
      summary: "Captar água é atividade regulada, com volume e horário autorizados.",
      bullets: [
        "O hidrômetro é o instrumento de prova do volume captado.",
        "A leitura diária alimenta o balanço hídrico da fábrica.",
        "Captar acima do outorgado sujeita a empresa a autuação e paralisação.",
      ],
    },
    {
      id: "operacao-2",
      discipline: "operacao",
      level: 2,
      title: "Sequência de partida",
      summary: "Abrir caminho antes de ligar evita sobrepressão e cavitação.",
      bullets: [
        "Abra o registro de saída e confirme a retenção assentada.",
        "Ligue a bomba e observe a pressão estabilizar perto de 2,5 bar.",
        "Confirme vazão no hidrômetro e ausência de ruído de cavitação.",
      ],
    },
    {
      id: "operacao-3",
      discipline: "operacao",
      level: 2,
      title: "Parada segura",
      summary: "Desligar antes de fechar o registro protege a tubulação.",
      bullets: [
        "Fechar o registro com a bomba ligada gera sobrepressão na linha.",
        "Desligue primeiro, espere a retenção fechar e depois feche o registro.",
        "Anote pressão e vazão na parada para comparar com o próximo turno.",
      ],
    },
    {
      id: "operacao-4",
      discipline: "operacao",
      level: 3,
      title: "Registro de turno e tendência",
      summary: "O que se anota hoje é o que permite diagnosticar a falha de amanhã.",
      bullets: [
        "Pressão, vazão, corrente e nível dinâmico são as quatro leituras base.",
        "Queda lenta de vazão com corrente estável sugere entupimento, não desgaste.",
        "Corrente subindo com vazão estável indica desgaste mecânico ou areia no rotor.",
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
