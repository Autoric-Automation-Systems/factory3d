"use client";

const STEPS = [
  {
    title: "Andar pela fábrica",
    text: "No computador use W A S D ou as setas, o mouse para olhar e Shift para correr. No celular, use o joystick e arraste a tela para olhar.",
  },
  {
    title: "Abrir uma estação",
    text: "Chegue perto da máquina, espere o aviso aparecer e pressione E (ou toque no aviso). O painel abre com o conteúdo daquela estação.",
  },
  {
    title: "Ler e marcar o visto",
    text: "Cada aba tem um botão “Marcar como visto”. O visto conta no progresso da estação e é o que libera o troféu.",
  },
  {
    title: "Responder o quiz",
    text: "Escolha uma alternativa por questão e clique em Corrigir. Acertar 70% ou mais conclui a estação.",
  },
  {
    title: "Achar as estações",
    text: "O minimapa mostra sua posição e o estado de cada estação. A tecla M abre o mapa de módulos; dentro do jogo, Esc ou Tab abre o menu.",
  },
];

const LEGEND = [
  { color: "#4c6272", label: "Ainda não visitada" },
  { color: "#ffc53d", label: "Em andamento" },
  { color: "#35d07f", label: "Concluída (100%)" },
];

export default function HelpContent({ isTouch = false }: { isTouch?: boolean }) {
  return (
    <div>
      <div className="eyebrow">Como usar</div>
      <h2 style={{ fontSize: 24, marginTop: 4, marginBottom: 12 }}>Ajuda</h2>
      <p className="small" style={{ marginBottom: 18 }}>
        A fábrica é um ambiente 3D em primeira pessoa. Tudo o que você precisa saber está
        nas estações; o menu lateral só organiza o caminho.
      </p>

      <div className="stack" style={{ gap: 12 }}>
        {STEPS.map((step, index) => (
          <div className="card card-tight" key={step.title}>
            <div className="row" style={{ gap: 10, alignItems: "flex-start", flexWrap: "nowrap" }}>
              <span className="num" style={{ flex: "0 0 26px" }}>
                {index + 1}
              </span>
              <div>
                <strong>{step.title}</strong>
                <p className="small" style={{ margin: "4px 0 0" }}>
                  {step.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 15, marginTop: 22 }}>Legenda das estações</h3>
      <div className="pill-list">
        {LEGEND.map((item) => (
          <span className="badge" key={item.label}>
            <span className="legend-dot" style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>

      <h3 style={{ fontSize: 15, marginTop: 22 }}>Atalhos</h3>
      <div className="list">
        {(isTouch
          ? [
              ["Joystick", "andar"],
              ["Arraste na tela", "olhar em volta"],
              ["Tocar no aviso", "abrir a estação"],
              ["☰", "menu e atalhos"],
            ]
          : [
              ["W A S D / setas", "andar"],
              ["Mouse", "olhar em volta"],
              ["Shift", "correr"],
              ["E", "abrir a estação próxima"],
              ["M", "mapa de módulos"],
              ["Esc ou Tab", "abrir e fechar o menu"],
            ]
        ).map(([key, action]) => (
          <div className="list-item" key={key}>
            <span className="kbd" style={{ flex: "0 0 auto" }}>
              {key}
            </span>
            <span className="small" style={{ flex: 1 }}>
              {action}
            </span>
          </div>
        ))}
      </div>

      <p className="small muted" style={{ marginTop: 22 }}>
        A simulação apoia o treinamento e não substitui a capacitação prática nem autoriza
        operar equipamentos reais.
      </p>
    </div>
  );
}
