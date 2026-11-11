import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import AdSlot from "@/components/AdSlot";
import { requireUser, storageWarning } from "@/lib/session";
import { moduleStats, TROPHY_LABEL } from "@/lib/progress";
import { lines, playableModules } from "@/content/catalog";

export const dynamic = "force-dynamic";

export default async function HubPage() {
  const user = await requireUser();
  const mainModule = playableModules[0];
  const stats = moduleStats(mainModule, user.progress);
  const warning = storageWarning();

  const lastVisited = Object.entries(user.progress)
    .filter(([, p]) => p.visitedAt)
    .sort((a, b) => (a[1].visitedAt! < b[1].visitedAt! ? 1 : -1))[0];

  const continueHref = lastVisited
    ? `/jogar/${mainModule.slug}?e=${lastVisited[0]}`
    : `/jogar/${mainModule.slug}`;

  const soon = lines
    .flatMap((l) => l.modules)
    .filter((m) => m.status === "soon")
    .slice(0, 6);

  return (
    <>
      <SiteHeader />
      <main className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 6 }}>
              Olá, {user.name.split(" ")[0]}
            </div>
            <h1 style={{ fontSize: 30 }}>Bem-vindo de volta à fábrica</h1>
          </div>
          <span className={`badge ${user.plan === "free" ? "" : "badge-ok"}`}>
            Plano {user.plan === "free" ? "gratuito" : "individual"}
          </span>
        </div>

        {warning && (
          <div
            className="card"
            style={{ marginTop: 16, borderColor: "rgba(255,107,107,0.45)" }}
          >
            <strong style={{ color: "var(--danger)" }}>Atenção</strong>
            <p className="small" style={{ margin: "4px 0 0" }}>
              {warning}
            </p>
          </div>
        )}

        <div className="grid grid-3" style={{ marginTop: 20 }}>
          <div className="card" style={{ gridColumn: "span 2" }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <span className="badge badge-accent">Linha de envase</span>
                <h2 style={{ fontSize: 22, marginTop: 10 }}>{mainModule.name}</h2>
                <p className="small" style={{ maxWidth: 520 }}>
                  {mainModule.summary}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="big-number">{stats.percent}%</div>
                <div className="small muted">concluído</div>
              </div>
            </div>

            <div className="bar" style={{ margin: "10px 0 16px" }}>
              <span style={{ width: `${stats.percent}%` }} />
            </div>

            <div className="row" style={{ justifyContent: "space-between" }}>
              <span className="small">
                {stats.visited}/{stats.total} estações abertas · {stats.explored} com
                conteúdo completo · {stats.dominated} com quiz aprovado
              </span>
              <div className="row">
                <Link href={`/modulos/${mainModule.slug}`} className="btn btn-sm">
                  Ver estações
                </Link>
                <Link href={continueHref} className="btn btn-primary btn-sm">
                  {lastVisited ? "Continuar de onde parei" : "Entrar na fábrica"}
                </Link>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>Trofeu do módulo</strong>
              <span className="trophy">
                {stats.trophy === "none" ? "—" : stats.trophy === "ouro" ? "🏆" : "🏅"}
              </span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, margin: "6px 0" }}>
              {TROPHY_LABEL[stats.trophy]}
            </div>
            <p className="small">
              Bronze: todas as estações abertas. Prata: todo o conteúdo lido. Ouro: quiz
              aprovado em todas.
            </p>
            <Link href="/conquistas" className="btn btn-sm btn-block">
              Ver conquistas
            </Link>
          </div>
        </div>

        <div className="grid grid-4" style={{ marginTop: 16 }}>
          {[
            ["Estações navegáveis", `${mainModule.stations.length}`],
            ["Favoritos", `${user.favorites.length}`],
            ["Tempo estimado", `${mainModule.stations.reduce((a, s) => a + s.minutes, 0)} min`],
            ["Matérias", "9"],
          ].map(([label, value]) => (
            <div className="card card-tight" key={label}>
              <div className="big-number" style={{ fontSize: 26 }}>
                {value}
              </div>
              <div className="small muted">{label}</div>
            </div>
          ))}
        </div>

        {user.plan === "free" && (
          <div style={{ marginTop: 16 }}>
            <AdSlot />
          </div>
        )}

        <h2 style={{ fontSize: 20, marginTop: 34 }}>Próximas linhas</h2>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {soon.map((mod) => (
            <div className="card card-tight" key={mod.id}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>{mod.name}</strong>
                <span className="badge">em breve</span>
              </div>
              <p className="small" style={{ margin: "8px 0 0" }}>
                {mod.summary}
              </p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
