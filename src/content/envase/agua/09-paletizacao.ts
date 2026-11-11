import type { Station } from "@/lib/types";

export const paletizacao: Station = {
  id: "agua-09-paletizacao",
  name: "Paletização",
  role: "Empilha os fardos no palete no padrão definido pela receita",
  disciplines: ["automacao", "pneumatica", "eletrica", "seguranca"],
  minutes: 6,
  machine: "palletizer",
  position: [21, -7],
  specs: [
    { label: "Paletizador", value: "Robô cartesiano 4 eixos, garra pneumática" },
    { label: "Palete", value: "PBR 1.000 × 1.200 mm" },
    { label: "Padrão", value: "12 fardos por camada, 5 camadas" },
    { label: "Capacidade", value: "40 paletes/h" },
  ],
  blocks: [
    {
      id: "processo",
      title: "Formando o palete",
      paragraphs: [
        "O fardo chega fechado da empacotadora e precisa virar carga unitária. A paletização distribui os fardos em camadas que se travam entre si, para que o conjunto resista ao transporte.",
        "O padrão de empilhamento não é estético: ele define a estabilidade. Um padrão errado concentra peso e faz o palete tombar na curva da empilhadeira.",
      ],
      bullets: [
        "Entrada: fardos fechados vindos do empacotamento",
        "Saída: palete montado, ainda sem filme de contenção",
        "Parâmetro crítico: alinhamento das camadas e altura final",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "O palete vazio é posicionado no elevador por transportador de roletes.",
        "O robô cartesiano recolhe o fardo com garra ou ventosa.",
        "O eixo X, o eixo Y e o eixo Z levam o fardo até a posição da camada.",
        "A garra abre e o fardo é solto conforme o padrão programado na receita.",
        "Ao completar as camadas, o palete desce e sai para a envolvida.",
      ],
    },
    {
      id: "componentes",
      title: "Componentes",
      bullets: [
        "Pórtico com colunas, trilhos e eixos X, Y e Z.",
        "Garra pneumática ou ventosa com sensor de presença de fardo.",
        "Servomotores e inversores dos eixos.",
        "Barreiras ópticas e cortina de luz na célula robotizada.",
        "CLP com receita de padrão por produto e contador de camadas.",
      ],
    },
    {
      id: "operacao",
      title: "Operação",
      steps: [
        "Selecione a receita de padrão de palete para o produto em produção.",
        "Confira o posicionamento do palete vazio no elevador.",
        "Teste o sensoriamento da garra com um fardo antes de liberar automático.",
        "Monitore o alinhamento das camadas nas primeiras cinco paletes.",
        "Registre paletes completos por hora e paradas da célula.",
      ],
    },
  ],
  safety: [
    "Área robotizada é zona de risco: respeite as barreiras ópticas e nunca contorne a proteção.",
    "Qualquer acesso à célula exige parar, bloquear a energia (LOTO) e aguardar liberação formal.",
    "Empilhadeira circula junto ao paletizador: use colete refletivo e mantenha a faixa de pedestre livre.",
  ],
  faults: [
    {
      symptom: "Robô parando no meio do ciclo",
      cause: "Sensor de presença desalinhado ou falha de vácuo",
      check: "Limpe os sensores e meça o vácuo da ventosa",
    },
    {
      symptom: "Camada desalinhada",
      cause: "Receita de padrão errada ou encoder de eixo fora de referência",
      check: "Confirme a receita no CLP e refaça a referência dos eixos",
    },
    {
      symptom: "Garra soltando o fardo no ar",
      cause: "Pressão pneumática baixa ou ventosa desgastada",
      check: "Verifique a pressão de linha e troque a ventosa",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Por que o padrão de empilhamento importa?",
      options: [
        "Só para o palete ficar mais bonito",
        "Porque distribui o peso e trava as camadas, dando estabilidade",
        "Para gastar menos filme",
        "Para acelerar o robô",
      ],
      answer: 1,
      explain: "O padrão distribui peso e travamento entre camadas; erro leva a tombamento.",
    },
    {
      id: "q2",
      prompt: "O que verificar quando o robô para no meio do ciclo?",
      options: [
        "A cor do fardo",
        "Sensores de presença e vácuo da garra",
        "A temperatura do túnel",
        "O rótulo da garrafa",
      ],
      answer: 1,
      explain: "Falha de sensor ou de vácuo é a causa mais comum de parada no ciclo.",
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
    "Animação esquemática: palete vazio subindo, robô cartesiano recolhendo fardos e montando as camadas.",
};
