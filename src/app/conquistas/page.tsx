import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { requireUser } from "@/lib/session";
import { playableModules, lines } from "@/content/catalog";
import { moduleStats, overallPercent, TROPHY_LABEL, type Trophy } from "@/lib/progress";

export const dynamic = "force-dynamic";

const TROPHY_ICON: Record<Trophy, string> = {
  none: "○",
  bronze: "🥉",
  prata: "🥈",
  ouro: "🏆",
};

export default async function ConquistasPage() {
  const user = await requireUser();
  const overall = overallPercent(playableModules, user.progress);
  const totalStations = playableModules.reduce((a, m) => a + m.stations.length, 0);
  const opened = playableModules.reduce(
    (a, m) => a + moduleStats(m, user.progress).visited,
    0,
  );

  return (
    <>
      <SiteHeader />
      <main className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>
        <Link href="/hub" className="small muted">
          ← Início
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>Conquistas</h1>
        <p>
          {opened} de {totalStations} estações abertas · {overall}% do mapa explorado.
        </p>

        <div className="grid grid-3">
          {playableModules.map((mod) => {
            const stats = moduleStats(mod, user.progress);
            return (
              <div className="card" key={mod.id}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div>
                    <span className="badge">{lines.find((l) => l.id === mod.lineId)?.name}</span>
                    <h3 style={{ fontSize: 18, marginTop: 10 }}>{mod.name}</h3>
                  </div>
                  <span className="trophy" title={TROPHY_LABEL[stats.trophy]}>
                    {TROPHY_ICON[stats.trophy]}
                  </span>
                </div>

                <div className="bar" style={{ margin: "8px 0" }}>
                  <span style={{ width: `${stats.percent}%` }} />
                </div>

                <div className="stack" style={{ gap: 6, marginTop: 10 }}>
                  {([
                    ["bronze", "Bronze", "Todas as estações abertas", stats.trophy !== "none"],
                    ["prata", "Prata", "Todo o conteúdo lido", ["prata", "ouro"].includes(stats.trophy)],
                    ["ouro", "Ouro", "Quiz aprovado em todas", stats.trophy === "ouro"],
                  ] as const).map(([key, label, desc, unlocked]) => (
                    <div
                      className="row"
                      key={key}
                      style={{ justifyContent: "space-between", opacity: unlocked ? 1 : 0.45 }}
                    >
                      <span className="small">
                        {TROPHY_ICON[key as Trophy]} <strong>{label}</strong> · {desc}
                      </span>
                      <span className={`badge ${unlocked ? "badge-ok" : ""}`}>
                        {unlocked ? "obtido" : "bloqueado"}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/modulos/${mod.slug}`}
                  className="btn btn-sm btn-block"
                  style={{ marginTop: 14 }}
                >
                  Continuar
                </Link>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ marginTop: 16 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <strong>Trofeu geral</strong>
              <p className="small" style={{ margin: "4px 0 0" }}>
                Conclua todos os módulos com pelo menos Bronze.
              </p>
            </div>
            <span className="badge">
              {playableModules.every((m) => moduleStats(m, user.progress).trophy !== "none")
                ? "concluído"
                : "em andamento"}
            </span>
          </div>
        </div>

        <p className="small" style={{ marginTop: 22 }}>
          Zerar progresso é possível no suporte. O histórico fica salvo na sua conta.
        </p>
      </main>
    </>
  );
}
