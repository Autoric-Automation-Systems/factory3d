import Link from "next/link";
import { logout } from "@/app/actions";
import ShellPage from "@/components/shell/ShellPage";
import { requireUser } from "@/lib/session";
import { overallPercent, moduleStats, TROPHY_LABEL } from "@/lib/progress";
import { playableModules } from "@/content/catalog";

export const dynamic = "force-dynamic";

const PLAN_LABEL: Record<string, string> = {
  free: "Gratuito",
  pro: "Individual",
  escola: "Escola",
};

export default async function PerfilPage() {
  const user = await requireUser();
  const percent = overallPercent(playableModules, user.progress);

  return (
    <ShellPage user={user}>
      <div className="stage-scroll">
        <div style={{ maxWidth: 720 }}>
          <div className="card">
            <div className="row" style={{ gap: 18, alignItems: "center", flexWrap: "nowrap" }}>
              {user.image ? (
                <img
                  className="perfil-avatar"
                  src={user.image}
                  alt={`Foto de ${user.name}`}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="perfil-avatar perfil-avatar-fallback">
                  {user.name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontSize: 22, margin: 0 }}>{user.name}</h1>
                <p className="small muted" style={{ margin: "4px 0 0" }}>
                  {user.email}
                </p>
                <p className="small muted" style={{ margin: "2px 0 0" }}>
                  Plano {PLAN_LABEL[user.plan] ?? user.plan} · desde{" "}
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>

            {!user.image && (
              <p className="small" style={{ marginTop: 14, marginBottom: 0 }}>
                Sem foto na conta Google. Entre novamente com Google para atualizar a
                imagem, ou continue usando as iniciais.
              </p>
            )}
          </div>

          <div className="card" style={{ marginTop: 14 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>Progresso geral</strong>
              <span className="badge badge-accent">{percent}%</span>
            </div>
            <div className="bar" style={{ marginTop: 10 }}>
              <span style={{ width: `${percent}%` }} />
            </div>
            <div className="stack" style={{ gap: 10, marginTop: 16 }}>
              {playableModules.map((mod) => {
                const stats = moduleStats(mod, user.progress);
                return (
                  <div key={mod.slug} className="row" style={{ justifyContent: "space-between" }}>
                    <span className="small">{mod.name}</span>
                    <span className="small muted">
                      {stats.percent}% · {stats.dominated}/{stats.total} dominadas ·{" "}
                      {TROPHY_LABEL[stats.trophy]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="row" style={{ marginTop: 16, gap: 10, flexWrap: "wrap" }}>
            <Link href="/hub" className="btn btn-primary">
              Continuar treinando
            </Link>
            <Link href="/precos" className="btn">
              Ver planos
            </Link>
            <form action={logout}>
              <button className="btn btn-ghost" type="submit">
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>
    </ShellPage>
  );
}
