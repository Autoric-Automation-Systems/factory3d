import type { Station } from "@/lib/types";

export const envolvimento: Station = {
  id: "agua-10-envolvimento",
  name: "Envolvimento do palete",
  role: "Aplica filme stretch e fecha a carga para o transporte",
  disciplines: ["mecanica", "automacao", "operacao", "qualidade"],
  minutes: 5,
  machine: "wrapper",
  position: [27, -7],
  specs: [
    { label: "Envolvedora", value: "Anel rotativo com pré-estiramento 250%" },
    { label: "Filme", value: "Stretch PEBD, 23 µm, 500 mm" },
    { label: "Sobreposição", value: "50% por volta" },
    { label: "Capacidade", value: "45 paletes/h" },
  ],
  blocks: [
    {
      id: "processo",
      title: "Fechando a carga",
      paragraphs: [
        "O palete montado ainda é uma pilha de fardos. O filme stretch aplicado sob tensão amarra as camadas ao palete e impede que a carga se abra na movimentação.",
        "Envolver é a última etapa antes da expedição. Palete mal envolvido tomba na empilhadeira e vira avaria, não só perda de produto.",
      ],
      bullets: [
        "Entrada: palete completo vindo da paletização",
        "Saída: carga unitária pronta para expedição",
        "Parâmetro crítico: pré-estiramento, sobreposição e número de voltas",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "O palete entra na plataforma e é centralizado por guias.",
        "O anel rotativo gira ao redor da carga segurando o rolo de stretch.",
        "O carro sobe e desce aplicando o filme com sobreposição de 50%.",
        "O filme é cortado e soldado ao final do ciclo.",
        "O palete é pesado e liberado para a expedição.",
      ],
    },
    {
      id: "componentes",
      title: "Componentes",
      bullets: [
        "Anel rotativo com acionamento por motorredutor.",
        "Carro de filme com pré-estiramento por roletes.",
        "Sensor de altura da carga.",
        "Pinça de corte e solda do filme.",
        "CLP com receita de voltas por produto.",
      ],
    },
    {
      id: "operacao",
      title: "Operação",
      steps: [
        "Selecione a receita de envolvimento para o padrão de palete em produção.",
        "Confira o alinhamento do palete na plataforma antes de iniciar.",
        "Verifique a altura do sensor para não envolver ar acima da carga.",
        "Faça o primeiro palete e teste a estabilidade empurrando levemente as laterais.",
        "Registre o consumo de filme por palete.",
      ],
    },
  ],
  safety: [
    "Anel rotativo em movimento: mantenha distância da zona de giro durante o ciclo.",
    "A pinça de corte é quente e afiada: só intervenha com o ciclo parado e energia bloqueada.",
    "Empilhadeira na expedição: use colete refletivo e respeite a faixa de pedestre.",
  ],
  faults: [
    {
      symptom: "Palete tombando no transporte",
      cause: "Sobreposição insuficiente ou número de voltas menor que a receita",
      check: "Revise a receita e conte as voltas no ciclo",
    },
    {
      symptom: "Filme rasgando durante o ciclo",
      cause: "Pré-estiramento acima do limite ou rolo com defeito",
      check: "Reduza o pré-estiramento e troque o rolo",
    },
    {
      symptom: "Filme sobrando no topo da carga",
      cause: "Sensor de altura desregulado",
      check: "Calibre o sensor de altura com um palete de referência",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "Qual é a função do filme stretch?",
      options: [
        "Enfeitar o palete",
        "Amarra as camadas ao palete e estabiliza a carga",
        "Resfriar o produto",
        "Substituir o palete",
      ],
      answer: 1,
      explain: "O stretch sob tensão mantém fardos e palete como uma carga única.",
    },
    {
      id: "q2",
      prompt: "Sobreposição de filme menor que a receita provoca",
      options: [
        "economia sem efeito",
        "palete instável, com risco de tombamento",
        "aumento da capacidade",
        "melhora na aparência",
      ],
      answer: 1,
      explain: "Menos sobreposição significa menos ancoragem entre camadas.",
    },
    {
      id: "q3",
      prompt: "O que verificar se o filme rasga durante o ciclo?",
      options: [
        "A cor do palete",
        "Pré-estiramento e condição do rolo",
        "A temperatura do túnel",
        "O padrão de camadas",
      ],
      answer: 1,
      explain: "Excesso de pré-estiramento ou rolo defeituoso são as causas típicas.",
    },
  ],
  videoNote:
    "Animação esquemática: anel girando, carro de filme subindo e descendo e palete saindo envolvido.",
};
