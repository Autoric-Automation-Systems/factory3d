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

type NavLink = { href: string; label: string };

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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

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

  const start: NavLink[] = [
    { href: "/hub", label: "Início" },
    { href: `/modulos/${firstModule}`, label: "Estações" },
    { href: "/materias", label: "Matérias" },
  ];
  const study: NavLink[] = [
    { href: "/favoritos", label: "Favoritos" },
    { href: "/conquistas", label: "Conquistas" },
  ];
  const account: NavLink[] = [
    { href: "/precos", label: "Planos" },
    { href: "/perfil", label: "Perfil" },
  ];
  const guest: NavLink[] = [
    { href: "/#como-funciona", label: "Como funciona" },
    { href: "/precos", label: "Planos" },
  ];

  const link = (item: NavLink) => (
    <Link
      key={item.href}
      href={item.href}
      data-active={isActive(item.href)}
      aria-current={isActive(item.href) ? "page" : undefined}
    >
      {item.label}
    </Link>
  );

  return (
    <>
      <nav className="nav">
        {user ? (
          <>
            {start.map(link)}
            {study.map(link)}
            <Link href="/precos" data-active={isActive("/precos")}>
              Planos
            </Link>
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
            {guest.map(link)}
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
            <div className="mobile-nav-group">{start.map(link)}</div>
            <div className="mobile-nav-group">{study.map(link)}</div>
            <div className="mobile-nav-group">
              {account.map(link)}
              <form action={logout}>
                <button className="mobile-nav-exit" type="submit">
                  Sair da conta
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="mobile-nav-group">
            {guest.map(link)}
            <Link href="/entrar" className="btn btn-primary btn-block">
              Entrar
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
