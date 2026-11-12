import type { Station } from "@/lib/types";

export const filtracao: Station = {
  id: "agua-02-filtracao",
  name: "Filtração (areia e carvão)",
  role: "Remove sólidos suspensos, turbidez, cloro e compostos orgânicos",
  disciplines: ["hidraulica", "mecanica", "operacao", "qualidade"],
  minutes: 6,
  machine: "filters",
  position: [-21, -7],
  specs: [
    { label: "Filtro de areia", value: "Ø 900 mm, leito 1,2 m, antracito + areia" },
    { label: "Filtro de carvão", value: "Carvão ativado granular vegetal" },
    { label: "Vazão de serviço", value: "6 m³/h (10 m/h de taxa)" },
    { label: "Retrolavagem", value: "Automática por diferencial de pressão" },
  ],
  blocks: [
    {
      id: "processo",
      title: "Papel no tratamento",
      paragraphs: [
        "A filtração é uma barreira física e adsortiva. O filtro de areia retém partículas em suspensão; o filtro de carvão ativado adsorve cloro, odores e compostos orgânicos que dariam gosto à água.",
        "Sem esta etapa, a osmose reversa entope em poucos dias e o produto final sai com gosto e odor perceptíveis.",
      ],
      bullets: [
        "Entrada: água bruta pressurizada",
        "Saída: água clarificada e sem cloro residual",
        "Parâmetro de controle: turbidez < 1 NTU na saída",
      ],
    },
    {
      id: "funcionamento",
      title: "Como funciona",
      steps: [
        "A água entra pelo topo do filtro e desce pelo leito filtrante.",
        "As partículas ficam presas entre os grãos; a sujeira acumulada aumenta a perda de carga.",
        "Quando o diferencial de pressão atinge o limite, a válvula automática inverte o fluxo: é a retrolavagem.",
        "A retrolavagem expande o leito e arrasta a sujeira para o dreno.",
        "Depois vem o enxágue rápido para reassentar o leito antes de voltar ao serviço.",
      ],
    },
  ],
  materias: [
    {
      id: "hidraulica-1",
      discipline: "hidraulica",
      level: 1,
      title: "Perda de carga e taxa de filtração",
      summary: "A diferença entre os dois manômetros é o que diz quando lavar.",
      bullets: [
        "A taxa de filtração é a vazão dividida pela área do filtro (10 m/h é comum).",
        "Taxa alta demais empurra a sujeira para dentro do leito em vez de retê-la na superfície.",
        "Perda de carga alta é sinal de leito saturado; perda de carga perto de zero pode ser caminho preferencial.",
      ],
    },
    {
      id: "hidraulica-2",
      discipline: "hidraulica",
      level: 2,
      title: "Retrolavagem",
      summary: "Fluxo invertido que expande o leito e arrasta a sujeira para o dreno.",
      bullets: [
        "A vazão de retrolavagem precisa expandir o leito em 20% a 30%, nem mais nem menos.",
        "Água de dreno deve sair turva e clarear no fim da lavagem.",
        "Retrolavar com vazão de serviço apenas mexe o leito e não limpa.",
      ],
    },
    {
      id: "hidraulica-3",
      discipline: "hidraulica",
      level: 2,
      title: "Válvula de cinco vias",
      summary: "Uma única válvula troca serviço, retrolavagem, enxágue e dreno.",
      bullets: [
        "Cada posição liga uma combinação diferente de bocais do vaso.",
        "Travar entre posições deixa o filtro em condição indefinida e a linha despressurizada.",
        "Válvula pneumática com solenoide travado compromete a lavagem automática.",
      ],
    },
    {
      id: "hidraulica-4",
      discipline: "hidraulica",
      level: 3,
      title: "Caminho preferencial no leito",
      summary: "Água passando por um canal dentro do leito sem ser filtrada.",
      bullets: [
        "Aparece como turbidez alta com perda de carga baixa — o oposto do leito saturado.",
        "Causas: leito compactado por ar, carga mal assentada ou bocal quebrado.",
        "Correção: retrolavagem com purga de ar seguida de enxágue lento.",
      ],
    },
    {
      id: "mecanica-1",
      discipline: "mecanica",
      level: 1,
      title: "Vaso de pressão e cesto coletor",
      summary: "O vaso contém o leito; o cesto impede que a carga escape pela saída.",
      bullets: [
        "Bocais superiores distribuem a água de entrada por igual.",
        "O cesto coletor segura areia e antracito durante a retrolavagem.",
        "Cesto furado ou solto joga leito para a linha e entope o que vem depois.",
      ],
    },
    {
      id: "mecanica-2",
      discipline: "mecanica",
      level: 2,
      title: "Bocais e difusores",
      summary: "Pequenas peças que definem a distribuição do fluxo no leito.",
      bullets: [
        "Bocal entupido cria zona morta e reduz a área efetiva de filtração.",
        "Difusor superior quebrado abre cratera na carga de areia.",
        "Inspecione sempre que abrir o vaso: é barato trocar, caro refazer o leito.",
      ],
    },
    {
      id: "mecanica-3",
      discipline: "mecanica",
      level: 2,
      title: "Bomba de retrolavagem",
      summary: "Precisa vencer a coluna de água e a perda de carga do leito expandido.",
      bullets: [
        "Vazão insuficiente deixa o leito sujo mesmo com a válvula correta.",
        "Rotor desgastado reduz vazão sem dar alarme.",
        "Verifique a corrente do motor durante a lavagem, não em vazio.",
      ],
    },
    {
      id: "mecanica-4",
      discipline: "mecanica",
      level: 3,
      title: "Troca da carga filtrante",
      summary: "Areia, antracito e carvão têm vidas úteis diferentes.",
      bullets: [
        "Carvão satura por volume adsorvido, não por tempo: acompanhe o teste sensorial.",
        "Areia e antracito se desgastam por atrito e perdem granulometria.",
        "Ao recarregar, mantenha a ordem das camadas e lave antes de colocar em serviço.",
      ],
    },
    {
      id: "operacao-1",
      discipline: "operacao",
      level: 1,
      title: "Leitura de manômetros no início do turno",
      summary: "Duas agulhas lidas juntas contam a história do leito.",
      bullets: [
        "Registre entrada e saída, não só a saída.",
        "Compare com a leitura do turno anterior para ver tendência.",
        "Anote também a vazão: sem ela a perda de carga não significa nada.",
      ],
    },
    {
      id: "operacao-2",
      discipline: "operacao",
      level: 2,
      title: "Conduzindo a retrolavagem",
      summary: "Sequência: expandir o leito, lavar, enxaguar, liberar.",
      bullets: [
        "Confirme que a linha de dreno está livre antes de começar.",
        "Observe a água de dreno: turva no início, clara no fim.",
        "Enxágue rápido em seguida para reassentar o leito.",
      ],
    },
    {
      id: "operacao-3",
      discipline: "operacao",
      level: 2,
      title: "Liberação após a lavagem",
      summary: "Filtro só volta a serviço com turbidez dentro do limite.",
      bullets: [
        "Meça a turbidez da saída antes de abrir a válvula de serviço.",
        "Os primeiros litros costumam vir com arraste de finos.",
        "Se a turbidez não cair, o enxágue foi curto ou há dano interno.",
      ],
    },
    {
      id: "operacao-4",
      discipline: "operacao",
      level: 3,
      title: "Programar por tempo ou por diferencial",
      summary: "Diferencial protege o leito; tempo protege a rotina.",
      bullets: [
        "Diferencial de 0,7 bar é referência comum para disparar a lavagem.",
        "Lavagem só por tempo pode lavar leito limpo e gastar água à toa.",
        "O ideal é disparar pelo diferencial e manter um limite máximo de horas como segurança.",
      ],
    },
    {
      id: "qualidade-1",
      discipline: "qualidade",
      level: 1,
      title: "Turbidez",
      summary: "Medida da sujeira em suspensão, em NTU.",
      bullets: [
        "A meta na saída do conjunto é abaixo de 1 NTU.",
        "Turbidez alta protege pouco a osmose e aparece no produto final.",
        "Meça sempre depois do enxágue, não durante a lavagem.",
      ],
    },
    {
      id: "qualidade-2",
      discipline: "qualidade",
      level: 2,
      title: "Cloro residual e proteção das membranas",
      summary: "O carvão existe para o cloro não chegar à osmose.",
      bullets: [
        "Cloro livre acima de 0,1 mg/L já ataca poliamida.",
        "Meça cloro na saída do carvão, não na entrada.",
        "Carvão saturado deixa cloro passar sem aviso visual.",
      ],
    },
    {
      id: "qualidade-3",
      discipline: "qualidade",
      level: 2,
      title: "Teste sensorial de bancada",
      summary: "Gosto e odor se percebem antes de qualquer análise instrumentada.",
      bullets: [
        "Padrão: água em copo limpo, temperatura ambiente, sem pistas ao provador.",
        "Registre data, provador e resultado: é evidência de controle.",
        "Odor de terra ou mofo indica carvão no fim da vida útil.",
      ],
    },
    {
      id: "qualidade-4",
      discipline: "qualidade",
      level: 3,
      title: "Vida útil do carvão ativado",
      summary: "Volume tratado, não calendário, define a troca.",
      bullets: [
        "Some o volume filtrado desde a última troca e compare com a capacidade do fornecedor.",
        "Carvão saturado pode devolver compostos adsorvidos à água.",
        "Registre a troca com lote e data: rastreabilidade também vale para insumos.",
      ],
    },
  ],
  safety: [
    "Vasos de pressão: nunca abra a tampa sem aliviar a pressão e confirmar 0 bar no manômetro.",
    "Retrolavagem gera jato de água e arraste de ar: use óculos de proteção.",
    "Carvão ativado saturado pode liberar compostos adsorvidos de volta à água.",
  ],
  faults: [
    {
      symptom: "Perda de carga sobe rápido demais",
      cause: "Água de entrada com turbidez alta ou leito compactado",
      check: "Meça a turbidez na entrada e teste a retrolavagem com vazão de projeto",
    },
    {
      symptom: "Turbidez na saída acima do limite",
      cause: "Leito furado, bocal quebrado ou enxágue insuficiente",
      check: "Inspecione o cesto coletor e o histórico de retrolavagem",
    },
    {
      symptom: "Gosto e odor persistentes no produto",
      cause: "Carvão saturado ou com canal preferencial",
      check: "Compare a data de troca do carvão e faça teste sensorial de bancada",
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: "O que a retrolavagem faz?",
      options: [
        "Aquece a água para desinfecção",
        "Inverte o fluxo para expandir o leito e arrastar a sujeira retida",
        "Adiciona cloro ao processo",
        "Aumenta a pressão para a osmose",
      ],
      answer: 1,
      explain:
        "A retrolavagem inverte o sentido do fluxo. O leito se expande e libera a sujeira acumulada para o dreno.",
    },
    {
      id: "q2",
      prompt: "Qual grandeza indica que o filtro precisa de retrolavagem?",
      options: [
        "Diferencial de pressão entre entrada e saída",
        "Temperatura da água",
        "Condutividade elétrica",
        "Nível do poço",
      ],
      answer: 0,
      explain:
        "O entupimento do leito se manifesta como aumento da perda de carga, lida nos dois manômetros.",
    },
    {
      id: "q3",
      prompt: "Por que o carvão ativado é importante antes da osmose?",
      options: [
        "Porque deixa a água mais alcalina",
        "Porque adsorve cloro, que degradaria as membranas de poliamida",
        "Porque aumenta a vazão da bomba",
        "Porque substitui a desinfecção final",
      ],
      answer: 1,
      explain:
        "O cloro oxida as membranas de poliamida. O carvão protege as membranas e melhora o sabor da água.",
    },
  ],
  videoNote:
    "Animação esquemática: fluxo descendente pelo leito, acúmulo de sujeira, abertura das válvulas e retrolavagem ascendente.",
};
