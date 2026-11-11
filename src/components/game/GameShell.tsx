"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LearningModule, Station } from "@/lib/types";
import { DISCIPLINES } from "@/lib/types";
import { moduleStats, stationPercent, TROPHY_LABEL, type ProgressMap, type Trophy } from "@/lib/progress";
import type { StationProgress } from "@/lib/store";
import type { TouchVector } from "./Player";
import type { PlayerPos } from "./GameCanvas";
import Joystick from "./Joystick";
import Minimap from "./Minimap";
import StationPanel from "./StationPanel";
import ControlsHints from "./ControlsHints";
import HelpContent from "./HelpContent";

const GameCanvas = dynamic(() => import("./GameCanvas"), {
  ssr: false,
  loading: () => <div className="loading">Carregando a fábrica…</div>,
});

const RANK: Record<Trophy, number> = { none: 0, bronze: 1, prata: 2, ouro: 3 };

export default function GameShell({
  module,
  plan,
  initialProgress,
  initialFavorites,
  startStationId,
  userName,
}: {
  module: LearningModule;
  plan: "free" | "pro";
  initialProgress: ProgressMap;
  initialFavorites: string[];
  startStationId?: string;
  userName: string;
}) {
  const [progress, setProgress] = useState<ProgressMap>(initialProgress);
  const [favorites, setFavorites] = useState<string[]>(initialFavorites);
  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const moveRef = useRef<TouchVector>({ x: 0, y: 0 });
  const lookRef = useRef<TouchVector>({ x: 0, y: 0 });
  const posRef = useRef<PlayerPos>({ x: 0, z: 4.5, yaw: 0 });
  const [isTouch, setIsTouch] = useState(false);

  const stations = module.stations;
  const stats = useMemo(() => moduleStats(module, progress), [module, progress]);
  const percents = useMemo(
    () =>
      Object.fromEntries(
        stations.map((station) => [station.id, stationPercent(station, progress[station.id])]),
      ) as Record<string, number>,
    [stations, progress],
  );

  const startStation = stations.find((s) => s.id === startStationId);
  const spawn = useMemo<[number, number]>(() => {
    if (!startStation) return [0, 4.5];
    return [startStation.position[0], startStation.position[1] + 4.4];
  }, [startStation]);

  const nearby = stations.find((s) => s.id === nearbyId) ?? null;
  const openStation = stations.find((s) => s.id === openId) ?? null;
  const paused = Boolean(openStation) || menuOpen;

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!startStation) return;
    setOpenId(startStation.id);
    void sendProgress(startStation.id, "visit");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previousTrophy = useRef<Trophy>(stats.trophy);
  useEffect(() => {
    if (RANK[stats.trophy] > RANK[previousTrophy.current]) {
      setToast(
        stats.trophy === "ouro"
          ? "🏆 Troféu Ouro! Todas as estações com quiz aprovado."
          : `🏅 Troféu ${TROPHY_LABEL[stats.trophy]} conquistado neste módulo.`,
      );
    }
    previousTrophy.current = stats.trophy;
  }, [stats.trophy]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(timer);
  }, [toast]);

  const sendProgress = useCallback(
    async (
      stationId: string,
      action: "visit" | "blocks" | "quiz",
      extra?: { blockIds?: string[]; score?: number },
    ) => {
      try {
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stationId, action, ...extra }),
        });
        if (!response.ok) return;
        const data = (await response.json()) as { progress: ProgressMap };
        setProgress(data.progress);
      } catch {
        /* sem rede: mantém o estado otimista */
      }
    },
    [],
  );

  const openStationById = useCallback(
    (station: Station) => {
      setOpenId(station.id);
      setProgress((prev) => {
        const current = prev[station.id] ?? emptyStationProgress();
        if (current.visited) return prev;
        return {
          ...prev,
          [station.id]: { ...current, visited: true, visitedAt: new Date().toISOString() },
        };
      });
      void sendProgress(station.id, "visit");
    },
    [sendProgress],
  );

  const handleInteract = useCallback(() => {
    if (openId) return;
    if (nearbyId) {
      const station = stations.find((s) => s.id === nearbyId);
      if (station) openStationById(station);
    }
  }, [nearbyId, openId, openStationById, stations]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (helpOpen) setHelpOpen(false);
        else if (openId) setOpenId(null);
        else setMenuOpen((value) => !value);
      }
      if (event.key === "Tab") {
        event.preventDefault();
        setMenuOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, helpOpen]);

  const markSeen = (station: Station, blockId: string) => {
    setProgress((prev) => {
      const current = prev[station.id] ?? emptyStationProgress();
      if (current.seenBlocks.includes(blockId)) return prev;
      return {
        ...prev,
        [station.id]: {
          ...current,
          visited: true,
          visitedAt: current.visitedAt ?? new Date().toISOString(),
          seenBlocks: [...current.seenBlocks, blockId],
        },
      };
    });
    void sendProgress(station.id, "blocks", { blockIds: [blockId] });
  };

  const saveQuiz = (station: Station, score: number) => {
    setProgress((prev) => {
      const current = prev[station.id] ?? emptyStationProgress();
      const best = Math.max(current.bestScore, score);
      return {
        ...prev,
        [station.id]: {
          ...current,
          visited: true,
          bestScore: best,
          quizPassed: current.quizPassed || best >= 70,
        },
      };
    });
    void sendProgress(station.id, "quiz", { score });
    if (score >= 70) setToast(`✅ ${station.name}: estação concluída.`);
  };

  const toggleFavorite = async (stationId: string) => {
    setFavorites((prev) =>
      prev.includes(stationId) ? prev.filter((id) => id !== stationId) : [...prev, stationId],
    );
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stationId }),
      });
      if (response.ok) {
        const data = (await response.json()) as { favorites: string[] };
        setFavorites(data.favorites);
      }
    } catch {
      /* mantém estado otimista */
    }
  };

  return (
    <div className="game-root">
      <GameCanvas
        stations={stations}
        percents={percents}
        nearbyId={nearbyId}
        paused={paused}
        spawn={spawn}
        moveRef={moveRef}
        lookRef={lookRef}
        posRef={posRef}
        onNearby={setNearbyId}
        onInteract={handleInteract}
      />

      <div className="crosshair" style={{ opacity: nearby ? 1 : 0.4 }} />

      <div className="hud">
        <div className="hud-top">
          <div className="hud-card">
            <div className="row" style={{ gap: 10 }}>
              <span className="badge badge-accent">{module.name}</span>
              <strong style={{ fontSize: 14 }}>{stats.percent}%</strong>
              <span className="small muted">
                {stats.visited}/{stats.total} estações
              </span>
              <span className="small">
                {stats.trophy === "none" ? "" : stats.trophy === "ouro" ? "🏆" : "🏅"}
              </span>
            </div>
            <div className="bar" style={{ marginTop: 8, width: "min(220px, 42vw)" }}>
              <span style={{ width: `${stats.percent}%` }} />
            </div>
          </div>

          <div className="hud-actions">
            <button
              className="icon-btn"
              onClick={() => setMenuOpen(true)}
              title="Menu"
              aria-label="Menu"
            >
              ☰
            </button>
            <Link className="icon-btn" href="/hub" title="Sair da fábrica" aria-label="Sair">
              ⏎
            </Link>
          </div>
        </div>

        <div>
          {nearby && !paused && (
            <div className="prompt" onClick={handleInteract}>
              <span className="key">{isTouch ? "TOCAR" : "E"}</span>
              <span>
                Examinar <strong>{nearby.name}</strong>
              </span>
              <span className="small muted">{percents[nearby.id] ?? 0}%</span>
            </div>
          )}
        </div>
      </div>

      <Minimap stations={stations} percents={percents} posRef={posRef} />

      {isTouch && <Joystick moveRef={moveRef} />}
      <ControlsHints isTouch={isTouch} />

      {openStation && (
        <StationPanel
          key={openStation.id}
          station={openStation}
          stations={stations}
          percents={percents}
          moduleName={`${module.name} · ${userName}`}
          percent={percents[openStation.id] ?? 0}
          seenBlocks={progress[openStation.id]?.seenBlocks ?? []}
          bestScore={progress[openStation.id]?.bestScore ?? 0}
          favorite={favorites.includes(openStation.id)}
          isFree={plan === "free"}
          onClose={() => setOpenId(null)}
          onSeen={(blockId) => markSeen(openStation, blockId)}
          onQuiz={(score) => saveQuiz(openStation, score)}
          onFavorite={() => toggleFavorite(openStation.id)}
          onOpenStation={(stationId) => {
            const target = stations.find((item) => item.id === stationId);
            if (target) openStationById(target);
          }}
        />
      )}

      {menuOpen && (
        <div className="sheet" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="sheet-inner">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 22 }}>Menu</h2>
              <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Fechar">
                ✕
              </button>
            </div>

            <div className="card card-tight" style={{ marginBottom: 16 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong>{module.name}</strong>
                  <div className="small muted">
                    {stats.percent}% · {TROPHY_LABEL[stats.trophy]} · {stats.dominated}/
                    {stats.total} com quiz
                  </div>
                </div>
                <Link className="btn btn-sm" href="/modulos/agua">
                  Ver módulo
                </Link>
              </div>
            </div>

            <h3 style={{ fontSize: 15 }}>Estações</h3>
            <div className="list">
              {stations.map((station, index) => {
                const percent = percents[station.id] ?? 0;
                return (
                  <button
                    key={station.id}
                    className="list-item"
                    style={{ textAlign: "left", cursor: "pointer", width: "100%" }}
                    onClick={() => {
                      setMenuOpen(false);
                      openStationById(station);
                    }}
                  >
                    <span className="num" data-done={percent === 100}>
                      {percent === 100 ? "✓" : index + 1}
                    </span>
                    <span style={{ flex: 1 }}>
                      <strong>{station.name}</strong>
                      <span className="small muted" style={{ display: "block" }}>
                        {station.disciplines.map((d) => DISCIPLINES[d]).join(" · ")}
                      </span>
                    </span>
                    <span className="small muted">{percent}%</span>
                  </button>
                );
              })}
            </div>

            <h3 style={{ fontSize: 15, marginTop: 22 }}>Atalhos</h3>
            <div className="row">
              <Link className="btn btn-sm" href="/hub">
                Início
              </Link>
              <Link className="btn btn-sm" href="/favoritos">
                Favoritos ({favorites.length})
              </Link>
              <Link className="btn btn-sm" href="/conquistas">
                Conquistas
              </Link>
              <button className="btn btn-sm" type="button" onClick={() => setHelpOpen(true)}>
                Ajuda
              </button>
              {plan === "free" && (
                <Link className="btn btn-sm btn-primary" href="/precos">
                  Remover anúncios
                </Link>
              )}
            </div>

            <p className="small" style={{ marginTop: 24 }}>
              Controles: {isTouch ? "joystick para andar, arraste para olhar" : "WASD ou setas para andar, mouse para olhar, Shift para correr"}, Esc abre
              e fecha este menu.
            </p>
          </div>
        </div>
      )}

      {helpOpen && (
        <div className="sheet" role="dialog" aria-modal="true" aria-label="Ajuda">
          <div className="sheet-inner">
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="icon-btn" onClick={() => setHelpOpen(false)} aria-label="Fechar">
                ✕
              </button>
            </div>
            <HelpContent isTouch={isTouch} />
          </div>
        </div>
      )}

      {toast && <div className="success-flash">{toast}</div>}
    </div>
  );
}

function emptyStationProgress(): StationProgress {
  return { visited: false, seenBlocks: [], quizPassed: false, bestScore: 0, visitedAt: null };
}
