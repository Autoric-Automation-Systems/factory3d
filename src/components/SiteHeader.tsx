import Link from "next/link";
import { logout } from "@/app/actions";
import { currentUser } from "@/lib/session";
import { overallPercent } from "@/lib/progress";
import { playableModules } from "@/content/catalog";

const FIRST_MODULE = playableModules[0]?.slug ?? "agua";

export default async function SiteHeader() {
  const user = await currentUser();
  const percent = user ? overallPercent(playableModules, user.progress) : 0;

  return (
    <header className="site-header">
      <div className="container inner">
        <Link href={user ? "/hub" : "/"} className="brand">
          <span className="mark">F3</span>
          <span>Fábrica 3D</span>
        </Link>

        <nav className="nav">
          {user ? (
            <>
              <Link href="/hub">Início</Link>
              <Link href={`/modulos/${FIRST_MODULE}`}>Estações</Link>
              <Link href="/favoritos">Favoritos</Link>
              <Link href="/conquistas">Conquistas</Link>
              <Link href="/precos">Planos</Link>
              <span className="badge badge-accent" title="Progresso geral">
                {percent}%
              </span>
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
      </div>
    </header>
  );
}
