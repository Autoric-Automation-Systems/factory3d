"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { DisciplineId, Station } from "@/lib/types";
import { LEVEL_LABEL, stationMaterias } from "@/lib/materias";

type Tab = {
  id: string;
  label: string;
  kind: "block" | "materia" | "review";
};

export default function StationPanel({
  station,
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
}: {
  station: Station;
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
}) {
  const groups = stationMaterias(station);
  const tabs: Tab[] = [
    ...station.blocks.map((block) => ({
      id: block.id,
      label: block.title,
      kind: "block" as const,
    })),
    ...groups.map((group) => ({
      id: `materia:${group.discipline}`,
      label: group.label,
      kind: "materia" as const,
    })),
    { id: "seguranca", label: "Segurança", kind: "review" },
    { id: "falhas", label: "Falhas comuns", kind: "review" },
    { id: "quiz", label: "Quiz", kind: "review" },
  ];

  const [active, setActive] = useState<string>(station.blocks[0]?.id ?? "quiz");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);
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

  const block = station.blocks.find((b) => b.id === active);
  const materiaId = active.startsWith("materia:")
    ? (active.slice("materia:".length) as DisciplineId)
    : null;
  const group = groups.find((item) => item.discipline === materiaId) ?? null;
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
        <header className="sheet-bar">
          <div className="sheet-bar-id">
            <span className="sheet-bar-eyebrow">{moduleName}</span>
            <strong className="sheet-bar-title">{station.name}</strong>
          </div>

          <div className="sheet-bar-actions">
            <div className="read-scale" role="group" aria-label="Tamanho do texto">
              <span className="read-scale-label">Texto</span>
              <button
                type="button"
                className="scale-btn"
                onClick={() => changeReadScale(-0.15)}
                disabled={readScale <= 1}
                aria-label="Diminuir texto"
              >
                A−
              </button>
              <span className="read-scale-value">{Math.round(readScale * 100)}%</span>
              <button
                type="button"
                className="scale-btn"
                onClick={() => changeReadScale(0.15)}
                disabled={readScale >= 1.5}
                aria-label="Aumentar texto"
              >
                A+
              </button>
            </div>

            <button
              className="bar-btn"
              onClick={onFavorite}
              aria-pressed={favorite}
              title={favorite ? "Remover dos favoritos" : "Favoritar estação"}
            >
              <span aria-hidden="true">{favorite ? "★" : "☆"}</span>
              <span className="bar-btn-label">{favorite ? "Favorita" : "Favoritar"}</span>
            </button>

            <button
              className="bar-btn bar-btn-close"
              onClick={onClose}
              title="Fechar estação (Esc)"
            >
              <span aria-hidden="true">✕</span>
              <span className="bar-btn-label">Fechar</span>
            </button>
          </div>
        </header>

        <div className="sheet-body">
          <p className="small" style={{ marginBottom: 10 }}>
            {station.role}
          </p>

          <div className="pill-list" style={{ marginBottom: 12 }}>
            <span className="badge">{station.minutes} min</span>
            <span className={`badge ${percent === 100 ? "badge-ok" : "badge-accent"}`}>
              {percent}% concluído
            </span>
          </div>

          <div className="bar" style={{ marginBottom: 16 }}>
            <span style={{ width: `${percent}%` }} />
          </div>

          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className="tab"
                data-kind={tab.kind}
                data-active={active === tab.id}
                data-seen={
                  isSeen(tab.id) || (tab.id === "quiz" && bestScore >= 70)
                }
                onClick={() => setActive(tab.id)}
              >
                {tab.kind === "materia" && <span className="tab-dot" aria-hidden="true" />}
                {isSeen(tab.id) ? "✓ " : ""}
                {tab.label}
                {tab.kind === "materia" && (
                  <span className="tab-count">{groupCount(groups, tab.id)}</span>
                )}
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
                  🎬{" "}
                  {station.videoNote ??
                    "Demonstração animada em 3D: observe a máquina ao lado enquanto lê o passo a passo."}
                </p>
              )}

              <SeenRow
                seen={isSeen(block.id)}
                onSeen={() => onSeen(block.id)}
                label="Leu o bloco? Marque o visto para contar no seu progresso."
              />
            </div>
          )}

          {group && (
            <div className="materia-group">
              <div className="materia-intro">
                <div>
                  <div className="eyebrow">Matéria desta estação</div>
                  <h3 style={{ fontSize: 18, margin: "4px 0 2px" }}>{group.label}</h3>
                  <p className="small" style={{ margin: 0 }}>
                    {group.topics.length} tópicos sobre os componentes de{" "}
                    {station.name.toLowerCase()}, do fundamento ao diagnóstico.
                  </p>
                </div>
                <Link className="btn btn-sm" href={`/materias?materia=${group.discipline}`}>
                  Ver em todas as estações
                </Link>
              </div>

              {group.topics.map((topic, index) => (
                <div className="block materia" key={topic.id}>
                  <div className="materia-head">
                    <span className="level-chip" data-level={topic.level}>
                      Nível {topic.level} · {LEVEL_LABEL[topic.level]}
                    </span>
                    <span className="small muted">
                      {index + 1} de {group.topics.length}
                    </span>
                  </div>
                  <h4>{topic.title}</h4>
                  <p className="small" style={{ color: "#b9c7d2" }}>
                    {topic.summary}
                  </p>
                  <ul>
                    {topic.bullets.map((item) => (
                      <li key={item} className="small">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <SeenRow
                    seen={isSeen(topic.id)}
                    onSeen={() => onSeen(topic.id)}
                    label="Estudou este tópico?"
                  />
                </div>
              ))}
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
                {station.quiz.length} questões. Acertar 70% ou mais conclui a estação e libera o
                troféu Ouro do módulo.
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
                        Resultado: {score}% (
                        {station.quiz.filter((q) => answers[q.id] === q.answer).length}/
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
    </div>
  );
}

function groupCount(
  groups: { discipline: DisciplineId; topics: unknown[] }[],
  tabId: string,
) {
  const discipline = tabId.slice("materia:".length);
  return groups.find((group) => group.discipline === discipline)?.topics.length ?? 0;
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
