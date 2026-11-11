"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { logout } from "@/app/actions";
import BrandMark from "@/components/brand/BrandMark";
import BrandName from "@/components/brand/BrandName";

export type ShellMap = {
  slug: string;
  name: string;
  line: string;
  lineId: string;
  summary: string;
  status: "playable" | "soon";
  stations: number;
  percent: number;
};

const S = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function IconMap() {
  return (
    <svg width={20} height={20} {...S} aria-hidden="true">
      <path d="M9 4 3.5 6.4v13.2L9 17.2l6 2.4 5.5-2.4V4L15 6.4 9 4Z" />
      <path d="M9 4v13.2M15 6.4v13.2" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width={20} height={20} {...S} aria-hidden="true">
      <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.8l5.9-.8L12 3.6Z" />
    </svg>
  );
}

function IconTrophy() {
  return (
    <svg width={20} height={20} {...S} aria-hidden="true">
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" />
      <path d="M12 13v4M9 20h6" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg width={20} height={20} {...S} aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3 10h18M7 15h4" />
    </svg>
  );
}

function IconExit() {
  return (
    <svg width={20} height={20} {...S} aria-hidden="true">
      <path d="M15 4h3.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H15" />
      <path d="M11 8l-4 4 4 4M7 12h9" />
    </svg>
  );
}

export default function GameFrame({
  brand,
  userName,
  plan,
  percent,
  maps,
  children,
  defaultMapsOpen = false,
}: {
  userName: string;
  plan: "free" | "pro";
  percent: number;
  maps: ShellMap[];
  brand: { logo: string | null; logoName: string | null };
  children?: React.ReactNode;
  defaultMapsOpen?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [mapsOpen, setMapsOpen] = useState(defaultMapsOpen);

  useEffect(() => {
    setOpen(window.localStorage.getItem("f3d-rail") === "open");
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "m" || event.key === "M") setMapsOpen((v) => !v);
      if (event.key === "Escape") setMapsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleRail = () => {
    setOpen((value) => {
      window.localStorage.setItem("f3d-rail", value ? "closed" : "open");
      return !value;
    });
  };

  const openMaps = () => {
    setMapsOpen((value) => !value);
    if (!open) toggleRail();
  };

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className={`shell${open ? " is-open" : ""}`}>
      <aside className="rail" aria-label="Menu do jogador">
        <button
          type="button"
          className="rail-brand"
          onClick={toggleRail}
          aria-expanded={open}
          title={open ? "Recolher menu" : "Abrir menu"}
        >
          <BrandMark src={brand.logo} />
          <span className="rail-label">
            <BrandName src={brand.logoName} />
          </span>
          <span className="rail-chevron" aria-hidden="true">
            ›
          </span>
        </button>

        <nav className="rail-nav">
          <button
            type="button"
            className="rail-item"
            data-active={mapsOpen}
            onClick={openMaps}
            title="Mapas (M)"
          >
            <IconMap />
            <span className="rail-label">Mapas</span>
            <span className="rail-kbd" aria-hidden="true">
              M
            </span>
          </button>
          <Link className="rail-item" href="/favoritos" title="Favoritos">
            <IconStar />
            <span className="rail-label">Favoritos</span>
          </Link>
          <Link className="rail-item" href="/conquistas" title="Conquistas">
            <IconTrophy />
            <span className="rail-label">Conquistas</span>
          </Link>
          <Link className="rail-item" href="/precos" title="Planos">
            <IconCard />
            <span className="rail-label">Planos</span>
          </Link>
        </nav>

        <div className="rail-foot">
          <div className="rail-user">
            <span className="rail-avatar">{initials || "F3"}</span>
            <span className="rail-label">
              <strong>{userName}</strong>
              <span className="small muted">
                {plan === "free" ? "Plano gratuito" : "Plano individual"} · {percent}%
              </span>
            </span>
          </div>
          <form action={logout}>
            <button className="rail-item" type="submit" title="Sair">
              <IconExit />
              <span className="rail-label">Sair</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="stage">
        {children}

        {mapsOpen && (
          <div className="drawer-layer" onClick={() => setMapsOpen(false)}>
            <section
              className="map-drawer"
              aria-label="Mapas"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="map-drawer-head">
                <div>
                  <div className="eyebrow">Fábrica 3D</div>
                  <h2 style={{ fontSize: 24 }}>Mapas</h2>
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setMapsOpen(false)}
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </header>

              <p className="small" style={{ marginBottom: 18 }}>
                Cada mapa é uma linha de produção navegável em primeira pessoa. Escolha um
                e entre na fábrica.
              </p>

              <div className="map-list">
                {maps.map((item) =>
                  item.status === "playable" ? (
                    <Link key={item.slug} href={`/jogar/${item.slug}`} className="map-card">
                      <div className="map-thumb" data-line={item.lineId}>
                        <span className="map-thumb-mark">▶</span>
                      </div>
                      <div className="map-card-body">
                        <span className="eyebrow">{item.line}</span>
                        <strong style={{ fontSize: 17 }}>{item.name}</strong>
                        <p className="small" style={{ margin: "6px 0 10px" }}>
                          {item.summary}
                        </p>
                        <div className="bar">
                          <span style={{ width: `${item.percent}%` }} />
                        </div>
                        <div className="map-card-foot">
                          <span className="small muted">{item.stations} estações</span>
                          <span className="badge badge-accent">{item.percent}%</span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div key={item.slug} className="map-card is-locked">
                      <div className="map-thumb" data-line={item.lineId} aria-hidden="true" />
                      <div className="map-card-body">
                        <span className="eyebrow">{item.line}</span>
                        <strong style={{ fontSize: 17 }}>{item.name}</strong>
                        <p className="small" style={{ margin: "6px 0 10px" }}>
                          {item.summary}
                        </p>
                        <div className="map-card-foot">
                          <span className="small muted">em produção</span>
                          <span className="badge">em breve</span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
