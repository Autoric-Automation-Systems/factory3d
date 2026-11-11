import type { Station } from "@/lib/types";

export const paletizacao: Station = {
  id: "agua-08-paletizacao",
  name: "Embalagem e paletização",
  role: "Agrupa, protege e organiza as garrafas para transporte",
  disciplines: ["automacao", "pneumatica", "mecanica", "operacao"],
  minutes: 6,
  machine: "palletizer",
  position: [25, -7],
  specs: [
    { label: "Enfardadeira", value: "Filme shrink, túnel 3 × 1,2 m" },
    { label: "Paletizador", value: "Robô cartesiano 4 eixos" },
    { label: "Palete", value: "PBR 1.000 × 1.200 mm, 12 fardos por camada" },
    { label: "Capacidade", value: "40 paletes/h" },
  ],
  blocks: [
    {
      id: "processo",
      title: "Fechando o ciclo",
      paragraphs: [
        "A garrafa só vira produto vendável quando está agrupada e protegida. O filme shrink mantém o fardo estável e mostra o produto na gôndola.",
        "O paletizador empilha os fardos em padrão definido, e o palete é envolto em stretch para não tombar no transporte.",
      ],
      bullets: [
        "Entrada: garrafas rotuladas e codificadas",
        "Saída: palete pronto para expedição",
        "Parâmetro crítico: estabilidade do palete e integridade do filme",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "As garrafas são divididas em fardos por guias e separadores.",
        "O fardo entra no túnel e é envolvido pelo filme plástico que encolhe com calor.",
        "O robô cartesiano recolhe o fardo com garra ou ventosa.",
        "O fardo é posicionado na camada conforme o padrão programado.",
        "Ao completar as camadas, o palete é envolto em stretch e liberado para a empilhadeira.",
      ],
    },
    {
      id: "componentes",
      title: "Componentes",
      bullets: [
        "Formador de fardos com guias ajustáveis.",
        "Túnel de calor com resistências e ventilação.",
        "Robô cartesiano com eixos X, Y, Z e rotação.",
        "Garra pneumática ou ventosa com sensor de presença.",
        "Envolvedora de palete com sensor de altura.",
        "CLP com receitas de padrão por produto.",
      ],
    },
    {
      id: "operacao",
      title: "Operação",
      steps: [
        "Selecione a receita de padrão de palete para o produto em produção.",
        "Ajuste as guias do formador de fardos para o diâmetro da garrafa.",
        "Confira a temperatura do túnel e o tempo de residência.",
        "Faça o primeiro palete completo e teste a estabilidade empurrando levemente as laterais.",
        "Registre a quantidade de filme consumida por palete.",
      ],
    },
  ],
  safety: [
    "Área robotizada é zona de risco: respeite as barreiras ópticas e nunca contorne a proteção.",
    "Túnel de calor: superfícies acima de 150 °C, use luvas térmicas.",
    "Empilhadeira circula na expedição: use colete refletivo e sinalização de pedestre.",
  ],
  faults: [
    {
      symptom: "Fardo saindo frouxo",
      cause: "Temperatura baixa do túnel ou filme com gramatura errada",
      check: "Meça a temperatura e confirme a especificação do filme",
    },
    {
      symptom: "Robô parando no meio do ciclo",
      cause: "Sensor de presença desalinhado ou falha de vácuo",
      check: "Limpe os sensores e meça o vácuo da ventosa",
    },
    {
      symptom: "Palete tombando no transporte",
      cause: "Padrão de empilhamento incorreto ou stretch mal aplicado",
      check: "Revise a receita e o número de voltas do stretch",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Qual é a função do filme shrink?",
      options: [
        "Deixar o fardo colorido",
        "Agrupar e proteger as garrafas, estabilizando o fardo",
        "Aumentar o volume do produto",
        "Resfriar as garrafas",
      ],
      answer: 1,
      explain: "O filme encolhido mantém o fardo estável e protege contra poeira e avarias.",
    },
    {
      id: "q2",
      prompt: "O que acontece se o padrão de palete estiver errado?",
      options: [
        "Nada relevante",
        "O palete fica instável e pode tombar no transporte",
        "A produção acelera",
        "O filme acaba antes",
      ],
      answer: 1,
      explain: "O padrão distribui peso e travamento entre camadas; erro leva a tombamento.",
    },
    {
      id: "q3",
      prompt: "Antes de entrar na célula do robô, o operador deve",
      options: [
        "entrar rapidamente pelo vão da proteção",
        "parar a célula, bloquear a energia e aguardar liberação",
        "apenas sinalizar com a mão",
        "reduzir a velocidade do robô",
      ],
      answer: 1,
      explain: "Acesso à zona robotizada exige parada, bloqueio e liberação formal.",
    },
  ],
  videoNote:
    "Animação esquemática: formador de fardos, túnel com filme encolhendo, robô cartesiano empilhando e envolvedora aplicando stretch.",
};
