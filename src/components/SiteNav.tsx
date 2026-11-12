"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/app/actions";

export type NavUser = { name: string; image?: string | null } | null;

type Props = {
  user: NavUser;
  percent: number;
  firstModule: string;
};

export default function SiteNav({ user, percent, firstModule }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  const initials = user ? user.name.trim().slice(0, 2).toUpperCase() : "";
  const avatar = user ? (
    user.image ? (
      <img
        src={user.image}
        alt=""
        className="header-avatar"
        referrerPolicy="no-referrer"
      />
    ) : (
      <span className="header-avatar header-avatar-fallback">{initials}</span>
    )
  ) : null;

  return (
    <>
      <nav className="nav">
        {user ? (
          <>
            <Link href="/hub">Início</Link>
            <Link href={`/modulos/${firstModule}`}>Estações</Link>
            <Link href="/favoritos">Favoritos</Link>
            <Link href="/conquistas">Conquistas</Link>
            <Link href="/precos">Planos</Link>
            <span className="badge badge-accent" title="Progresso geral">
              {percent}%
            </span>
            <Link href="/perfil" className="header-user" title={`Perfil de ${user.name}`}>
              {avatar}
            </Link>
            <form action={logout}>
              <button className="btn btn-ghost btn-sm" type="submit">
                Sair
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/#como-funciona">Como funciona</Link>
            <Link href="/precos">Planos</Link>
            <Link href="/entrar" className="btn btn-primary btn-sm">
              Entrar
            </Link>
          </>
        )}
      </nav>

      {user ? (
        <Link href="/perfil" className="nav-compact" aria-label={`Perfil de ${user.name}`}>
          {avatar}
        </Link>
      ) : (
        <Link href="/entrar" className="btn btn-primary btn-sm nav-compact">
          Entrar
        </Link>
      )}

      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="menu-principal"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        data-open={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {open && (
        <div
          className="mobile-nav-backdrop"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <div id="menu-principal" className="mobile-nav" data-open={open}>
        {user ? (
          <>
            <div className="mobile-nav-head">
              <Link href="/perfil" className="mobile-nav-user">
                {avatar}
                <span>
                  <strong>{user.name}</strong>
                  <span className="small muted">{percent}% do treinamento</span>
                </span>
              </Link>
            </div>
            <Link href="/hub">Início</Link>
            <Link href={`/modulos/${firstModule}`}>Estações</Link>
            <Link href="/favoritos">Favoritos</Link>
            <Link href="/conquistas">Conquistas</Link>
            <Link href="/precos">Planos</Link>
            <Link href="/perfil">Perfil</Link>
            <form action={logout}>
              <button className="mobile-nav-exit" type="submit">
                Sair da conta
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/#como-funciona">Como funciona</Link>
            <Link href="/precos">Planos</Link>
            <Link href="/entrar" className="btn btn-primary btn-block">
              Entrar
            </Link>
          </>
        )}
      </div>
    </>
  );
}
