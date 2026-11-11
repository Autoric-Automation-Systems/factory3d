"use client";

import { useEffect, useState } from "react";
import type { DisciplineId, Station } from "@/lib/types";
import { DISCIPLINES } from "@/lib/types";

type Tab = { id: string; label: string };

export default function StationPanel({
  station,
  stations,
  percents,
  moduleName,
  percent,
  seenBlocks,
  bestScore,
  favorite,
  isFree,
  onClose,
  onSeen,
  onQuiz,
  onFavorite,
  onOpenStation,
}: {
  station: Station;
  stations: Station[];
  percents: Record<string, number>;
  moduleName: string;
  percent: number;
  seenBlocks: string[];
  bestScore: number;
  favorite: boolean;
  isFree: boolean;
  onClose: () => void;
  onSeen: (blockId: string) => void;
  onQuiz: (score: number) => void;
  onFavorite: () => void;
  onOpenStation: (stationId: string) => void;
}) {
  const tabs: Tab[] = [
    ...station.blocks.map((block) => ({ id: block.id, label: block.title })),
    { id: "seguranca", label: "Segurança" },
    { id: "falhas", label: "Falhas comuns" },
    { id: "quiz", label: "Quiz" },
  ];
  const [active, setActive] = useState<string>(station.blocks[0]?.id ?? "quiz");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);
  const [discipline, setDiscipline] = useState<DisciplineId | null>(null);
  const [readScale, setReadScale] = useState(1);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem("f3d-read-scale"));
    if (stored >= 1 && stored <= 1.5) setReadScale(stored);
  }, []);

  const changeReadScale = (step: number) => {
    setReadScale((current) => {
      const next = Math.min(1.5, Math.max(1, Math.round((current + step) * 100) / 100));
      window.localStorage.setItem("f3d-read-scale", String(next));
      return next;
    });
  };

  const related = discipline
    ? stations.filter((item) => item.disciplines.includes(discipline))
    : [];

  const block = station.blocks.find((b) => b.id === active);
  const isSeen = (id: string) => seenBlocks.includes(id);

  const score = Math.round(
    (station.quiz.filter((q) => answers[q.id] === q.answer).length / station.quiz.length) * 100,
  );

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={station.name}>
      <div
        className="sheet-inner"
        style={{ "--read-scale": readScale } as React.CSSProperties}
      >
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="small muted">{moduleName}</div>
            <h2 style={{ fontSize: 22, marginTop: 4 }}>{station.name}</h2>
            <p className="small" style={{ marginBottom: 8 }}>
              {station.role}
            </p>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <div className="read-scale" title="Tamanho do texto">
              <button
                type="button"
                className="icon-btn icon-btn-sm"
                onClick={() => changeReadScale(-0.15)}
                disabled={readScale <= 1}
                aria-label="Diminuir texto"
              >
                A−
              </button>
              <button
                type="button"
                className="icon-btn icon-btn-sm"
                onClick={() => changeReadScale(0.15)}
                disabled={readScale >= 1.5}
                aria-label="Aumentar texto"
              >
                A+
              </button>
            </div>
            <button
              className="icon-btn"
              onClick={onFavorite}
              title={favorite ? "Remover dos favoritos" : "Favoritar"}
              aria-label="Favoritar"
            >
              {favorite ? "★" : "☆"}
            </button>
            <button className="icon-btn" onClick={onClose} aria-label="Fechar">
              ✕
            </button>
          </div>
        </div>

        <div className="pill-list" style={{ marginBottom: 12 }}>
          {station.disciplines.map((d) => (
            <button
              key={d}
              type="button"
              className="badge badge-btn"
              data-active={discipline === d}
              aria-pressed={discipline === d}
              title={`Ver as estações de ${DISCIPLINES[d]}`}
              onClick={() => setDiscipline(discipline === d ? null : d)}
            >
              {DISCIPLINES[d]}
            </button>
          ))}
          <span className="badge">{station.minutes} min</span>
          <span className={`badge ${percent === 100 ? "badge-ok" : "badge-accent"}`}>
            {percent}% concluído
          </span>
        </div>

        <div className="bar" style={{ marginBottom: 16 }}>
          <span style={{ width: `${percent}%` }} />
        </div>

        {discipline ? (
          <div className="block">
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div className="eyebrow">Matéria</div>
                <h4 style={{ margin: 0 }}>{DISCIPLINES[discipline]}</h4>
              </div>
              <span className="badge">
                {related.length} {related.length === 1 ? "estação" : "estações"}
              </span>
            </div>

            <div className="list">
              {related.map((item) => {
                const itemPercent = percents[item.id] ?? 0;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="list-item disc-item"
                    onClick={() => onOpenStation(item.id)}
                  >
                    <span className="num" data-done={itemPercent === 100}>
                      {itemPercent === 100 ? "✓" : stations.indexOf(item) + 1}
                    </span>
                    <span style={{ flex: 1 }}>
                      <strong>{item.name}</strong>
                      <span className="small muted" style={{ display: "block" }}>
                        {item.role}
                      </span>
                    </span>
                    <span className="small muted">{itemPercent}%</span>
                  </button>
                );
              })}
            </div>

            <p className="small muted" style={{ margin: "12px 0 0" }}>
              Matéria presente em {related.length} de {stations.length} estações deste mapa.
              Clique em uma estação para abrir o conteúdo dela.
            </p>
          </div>
        ) : (
          <>
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className="tab"
              data-active={active === tab.id}
              data-seen={isSeen(tab.id) || (tab.id === "quiz" && bestScore >= 70)}
              onClick={() => setActive(tab.id)}
            >
              {isSeen(tab.id) ? "✓ " : ""}
              {tab.label}
            </button>
          ))}
        </div>

        {block && (
          <div className="block">
            <h4>{block.title}</h4>
            {block.paragraphs?.map((text) => (
              <p key={text.slice(0, 24)} className="small" style={{ color: "#b9c7d2" }}>
                {text}
              </p>
            ))}
            {block.bullets && (
              <ul>
                {block.bullets.map((item) => (
                  <li key={item} className="small">
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {block.steps && (
              <ol>
                {block.steps.map((item) => (
                  <li key={item} className="small">
                    {item}
                  </li>
                ))}
              </ol>
            )}

            {block.id === "funcionamento" && station.videoUrl && (
              <video
                className="station-video"
                src={station.videoUrl}
                controls
                playsInline
                preload="metadata"
              />
            )}
            {block.id === "funcionamento" && (
              <p className="small" style={{ margin: "10px 0 0", color: "#8fa3b0" }}>
                🎬 {station.videoNote ?? "Demonstração animada em 3D: observe a máquina ao lado enquanto lê o passo a passo."}
              </p>
            )}

            <div className="row" style={{ marginTop: 12, justifyContent: "space-between" }}>
              <span className="small muted">
                Leu o bloco? Marque o visto para contar no seu progresso.
              </span>
              <button
                className={`btn btn-sm ${isSeen(block.id) ? "" : "btn-primary"}`}
                onClick={() => onSeen(block.id)}
                disabled={isSeen(block.id)}
              >
                {isSeen(block.id) ? "Visto ✓" : "Marcar como visto"}
              </button>
            </div>
          </div>
        )}

        {active === "seguranca" && (
          <div className="block">
            <h4>Segurança e boas práticas</h4>
            <ul>
              {station.safety.map((item) => (
                <li key={item} className="small">
                  {item}
                </li>
              ))}
            </ul>
            <SeenRow
              seen={isSeen("seguranca")}
              onSeen={() => onSeen("seguranca")}
              label="Leu as regras de segurança? Marque o visto."
            />
          </div>
        )}

        {active === "falhas" && (
          <div>
            <div className="stack" style={{ gap: 10 }}>
              {station.faults.map((fault) => (
                <div className="block" key={fault.symptom} style={{ marginBottom: 0 }}>
                  <h4 style={{ color: "#ffd166" }}>{fault.symptom}</h4>
                  <div className="small" style={{ color: "#b9c7d2" }}>
                    <strong>Causa provável:</strong> {fault.cause}
                  </div>
                  <div className="small" style={{ color: "#b9c7d2", marginTop: 4 }}>
                    <strong>O que verificar:</strong> {fault.check}
                  </div>
                </div>
              ))}
            </div>
            <SeenRow
              seen={isSeen("falhas")}
              onSeen={() => onSeen("falhas")}
              label="Revisou as falhas comuns? Marque o visto."
            />
          </div>
        )}

        {active === "quiz" && (
          <div>
            <p className="small">
              {station.quiz.length} questões. Acertar 70% ou mais conclui a estação e libera
              o troféu Ouro do módulo.
            </p>
            {station.quiz.map((question, index) => (
              <div className="block" key={question.id}>
                <h4>
                  {index + 1}. {question.prompt}
                </h4>
                {question.options.map((option, optionIndex) => {
                  const selected = answers[question.id] === optionIndex;
                  const state = checked
                    ? optionIndex === question.answer
                      ? "correct"
                      : selected
                        ? "wrong"
                        : undefined
                    : selected
                      ? "selected"
                      : undefined;
                  return (
                    <button
                      key={option}
                      className="quiz-option"
                      data-state={state}
                      aria-pressed={selected}
                      onClick={() => {
                        if (checked) return;
                        setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
                      }}
                    >
                      <span className="mono small">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
                {checked && (
                  <p className="small" style={{ margin: "6px 0 0", color: "#9fd8b7" }}>
                    {question.explain}
                  </p>
                )}
              </div>
            ))}

            {!checked ? (
              <button
                className="btn btn-primary btn-block"
                disabled={Object.keys(answers).length < station.quiz.length}
                onClick={() => {
                  setChecked(true);
                  onQuiz(score);
                }}
              >
                Corrigir ({Object.keys(answers).length}/{station.quiz.length} respondidas)
              </button>
            ) : (
              <div className="stack">
                <div className="card card-tight">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <strong>
                      Resultado: {score}% ({station.quiz.filter((q) => answers[q.id] === q.answer).length}/
                      {station.quiz.length})
                    </strong>
                    <span className={`badge ${score >= 70 ? "badge-ok" : ""}`}>
                      {score >= 70 ? "aprovado" : "tente novamente"}
                    </span>
                  </div>
                </div>
                <button
                  className="btn"
                  onClick={() => {
                    setAnswers({});
                    setChecked(false);
                  }}
                >
                  Refazer quiz
                </button>
              </div>
            )}
            {bestScore > 0 && (
              <p className="small" style={{ marginTop: 10 }}>
                Melhor resultado até agora: {bestScore}%
              </p>
            )}
          </div>
        )}
          </>
        )}

        {isFree && (
          <div className="ad" style={{ marginTop: 22 }}>
            <div>
              <div className="label">Anúncio · plano gratuito</div>
              <span className="small muted">
                Parceiros industriais aparecem aqui. Plano individual remove os anúncios.
              </span>
            </div>
            <a className="btn btn-sm" href="/precos">
              Ver planos
            </a>
          </div>
        )}

        <p className="small" style={{ marginTop: 22, color: "#6f828f" }}>
          {station.specs.map((spec) => `${spec.label}: ${spec.value}`).join(" · ")}
        </p>
      </div>
    </div>
  );
}

function SeenRow({
  seen,
  onSeen,
  label,
}: {
  seen: boolean;
  onSeen: () => void;
  label: string;
}) {
  return (
    <div className="row" style={{ marginTop: 14, justifyContent: "space-between" }}>
      <span className="small muted">{label}</span>
      <button
        className={`btn btn-sm ${seen ? "" : "btn-primary"}`}
        onClick={onSeen}
        disabled={seen}
      >
        {seen ? "Visto ✓" : "Marcar como visto"}
      </button>
    </div>
  );
}
