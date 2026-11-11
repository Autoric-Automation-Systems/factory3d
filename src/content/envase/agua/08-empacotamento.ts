import type { Station } from "@/lib/types";

export const empacotamento: Station = {
  id: "agua-08-empacotamento",
  name: "Empacotamento",
  role: "Agrupa as garrafas em fardos e protege com filme shrink",
  disciplines: ["mecanica", "pneumatica", "automacao", "operacao"],
  minutes: 5,
  machine: "shrink",
  position: [15, -7],
  specs: [
    { label: "Formador de fardos", value: "Guias ajustáveis para 6, 8 ou 12 garrafas" },
    { label: "Filme", value: "Shrink PEBD, 45 µm de espessura" },
    { label: "Túnel", value: "3,0 × 1,2 m, 160–190 °C" },
    { label: "Capacidade", value: "2.400 fardos/h" },
  ],
  blocks: [
    {
      id: "processo",
      title: "Do gargalo solto ao fardo",
      paragraphs: [
        "A garrafa sai da rotulagem solta. Empacotar é dividir o fluxo em grupos estáveis e envolvê-los com filme que encolhe com calor, formando o fardo que o varejo recebe.",
        "O filme protege contra poeira, umidade e riscos, e mantém as garrafas unidas durante o transporte até o palete.",
      ],
      bullets: [
        "Entrada: garrafas rotuladas e codificadas",
        "Saída: fardos fechados e resfriados",
        "Parâmetro crítico: temperatura e tempo de residência no túnel",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "As garrafas entram em colunas por guias e são contadas por sensor fotoelétrico.",
        "Um separador pneumático isola o grupo com o número de garrafas da receita.",
        "O filme é aplicado por cima e por baixo enquanto o fardo avança para o túnel.",
        "No túnel, o ar quente encolhe o filme e veda o fardo nas laterais.",
        "O fardo sai para a esteira de resfriamento e segue para a paletização.",
      ],
    },
    {
      id: "componentes",
      title: "Componentes",
      bullets: [
        "Formador de fardos com guias laterais ajustáveis.",
        "Conjunto de solda e corte do filme com resistência.",
        "Túnel de calor com resistências, ventiladores e sensor de temperatura.",
        "Transportador de roletes ou esteira modular entre formador e túnel.",
        "CLP com receita de fardo por produto e contagem de filme.",
      ],
    },
    {
      id: "operacao",
      title: "Operação",
      steps: [
        "Selecione a receita do fardo (6, 8 ou 12 garrafas) no painel.",
        "Ajuste as guias do formador para o diâmetro da garrafa em produção.",
        "Confirme a temperatura do túnel e aguarde estabilizar antes de liberar.",
        "Faça três fardos de teste e verifique vedação e estabilidade.",
        "Anote o consumo de filme por hora para detectar desperdício.",
      ],
    },
  ],
  safety: [
    "Túnel de calor opera acima de 150 °C: use luvas térmicas e nunca abra a cortina com a linha energizada.",
    "A lâmina de corte do filme é afiada: mantenha a proteção fechada e use ferramenta, não a mão, para retirar filme preso.",
    "Bloqueie e etiquete a energia (LOTO) antes de ajustar guias, resistências ou correias.",
  ],
  faults: [
    {
      symptom: "Fardo saindo frouxo",
      cause: "Temperatura baixa do túnel ou filme com gramatura errada",
      check: "Meça a temperatura e confirme a especificação do filme no rolo",
    },
    {
      symptom: "Filme queimando ou furando",
      cause: "Temperatura alta ou excesso de tempo de residência",
      check: "Reduza a temperatura em passos de 5 °C e reavalie a velocidade da esteira",
    },
    {
      symptom: "Contagem errada de garrafas por fardo",
      cause: "Sensor fotoelétrico desalinhado ou sujo de retrátil",
      check: "Limpe o sensor e teste com um fardo de contagem conhecida",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Qual é a função do filme shrink no empacotamento?",
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
      prompt: "O que acontece se a temperatura do túnel ficar baixa?",
      options: [
        "O filme encolhe demais",
        "O fardo sai frouxo, sem vedação",
        "A produção acelera",
        "O filme fica mais resistente",
      ],
      answer: 1,
      explain: "Sem calor suficiente o filme não encolhe por completo e o fardo fica frouxo.",
    },
    {
      id: "q3",
      prompt: "Antes de ajustar as guias do formador, o operador deve",
      options: [
        "ajustar com a linha em movimento para ganhar tempo",
        "parar a linha, bloquear a energia e aguardar liberação",
        "apenas sinalizar com a mão",
        "reduzir a velocidade da esteira",
      ],
      answer: 1,
      explain: "Ajuste em zona de movimento exige parada, bloqueio e liberação formal.",
    },
  ],
  videoNote:
    "Animação esquemática: guias formando o fardo, filme aplicado, túnel encolhendo e fardo saindo resfriado.",
};
