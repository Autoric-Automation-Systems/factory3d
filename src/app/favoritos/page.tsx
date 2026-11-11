import Link from "next/link";
import ShellPage from "@/components/shell/ShellPage";
import { requireUser } from "@/lib/session";
import { findStation, playableModules } from "@/content/catalog";
import { moduleStats, stationPercent, TROPHY_LABEL } from "@/lib/progress";
import { DISCIPLINES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function FavoritosPage() {
  const user = await requireUser();
  const favorites = user.favorites
    .map((id) => findStation(id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <ShellPage user={user}>
        <div className="stage-scroll">
        <Link href="/hub" className="small muted">
          ← Início
        </Link>
        <h1 style={{ fontSize: 28, marginTop: 8 }}>Favoritos</h1>
        <p>Estações que você marcou para revisar depois.</p>

        {favorites.length === 0 ? (
          <div className="card">
            <p style={{ marginBottom: 12 }}>
              Você ainda não marcou nenhuma estação. Abra uma estação dentro da fábrica e
              toque em “Favoritar”.
            </p>
            <Link href="/jogar/agua" className="btn btn-primary btn-sm">
              Entrar na fábrica
            </Link>
          </div>
        ) : (
          <div className="list">
            {favorites.map(({ station, module }) => (
              <Link
                key={station.id}
                href={`/jogar/${module.slug}?e=${station.id}`}
                className="list-item"
              >
                <span
                  className="num"
                  data-done={stationPercent(station, user.progress[station.id]) === 100}
                >
                  ★
                </span>
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <strong>{station.name}</strong>
                    <span className="small muted">
                      {stationPercent(station, user.progress[station.id])}%
                    </span>
                  </div>
                  <div className="small muted">
                    {module.name} · {station.role}
                  </div>
                  <div className="pill-list" style={{ marginTop: 8 }}>
                    {station.disciplines.map((d) => (
                      <span className="badge" key={d}>
                        {DISCIPLINES[d]}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <h2 style={{ fontSize: 18, marginTop: 30 }}>Resumo dos módulos</h2>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {playableModules.map((mod) => {
            const stats = moduleStats(mod, user.progress);
            return (
              <div className="card card-tight" key={mod.id}>
                <strong>{mod.name}</strong>
                <div className="small muted">
                  {stats.percent}% · {TROPHY_LABEL[stats.trophy]}
                </div>
                <div className="bar" style={{ marginTop: 10 }}>
                  <span style={{ width: `${stats.percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </ShellPage>
  );
}
