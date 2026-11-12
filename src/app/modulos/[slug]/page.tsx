import Link from "next/link";
import { notFound } from "next/navigation";
import ShellPage from "@/components/shell/ShellPage";
import AdSlot from "@/components/AdSlot";
import { requireUser } from "@/lib/session";
import { moduleStats, TROPHY_LABEL } from "@/lib/progress";
import { getModule } from "@/content/catalog";
import { stationMaterias } from "@/lib/materias";

export const dynamic = "force-dynamic";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const mod = getModule(slug);
  if (!mod) notFound();

  if (mod.status === "soon") {
    return (
      <ShellPage user={user}>
        <div className="stage-scroll">
          <span className="badge">em breve</span>
          <h1 style={{ fontSize: 28, marginTop: 12 }}>{mod.name}</h1>
          <p style={{ maxWidth: 620 }}>{mod.summary}</p>
          <Link href="/hub" className="btn">
            Voltar ao início
          </Link>
        </div>
      </ShellPage>
    );
  }

  const stats = moduleStats(mod, user.progress);

  return (
    <ShellPage user={user}>
        <div className="stage-scroll">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <Link href="/hub" className="small muted">
              ← Início
            </Link>
            <h1 style={{ fontSize: 30, marginTop: 8 }}>{mod.name}</h1>
            <p style={{ maxWidth: 640 }}>{mod.summary}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="big-number">{stats.percent}%</div>
            <div className="small muted">{TROPHY_LABEL[stats.trophy]}</div>
          </div>
        </div>

        <div className="bar" style={{ margin: "8px 0 22px" }}>
          <span style={{ width: `${stats.percent}%` }} />
        </div>

        <div className="row" style={{ marginBottom: 18 }}>
          <Link href={`/jogar/${mod.slug}`} className="btn btn-primary">
            Entrar na fábrica
          </Link>
          <Link href="/materias" className="btn">
            Matérias da linha
          </Link>
          {mod.goals && (
            <span className="small muted">
              Objetivos: {mod.goals.join(" · ")}
            </span>
          )}
        </div>

        <div className="list">
          {stats.stations.map(({ station, percent }, index) => {
            const materias = stationMaterias(station);
            return (
              <Link
                key={station.id}
                href={`/jogar/${mod.slug}?e=${station.id}`}
                className="list-item"
              >
                <span className="num" data-done={percent === 100}>
                  {percent === 100 ? "✓" : index + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <strong>{station.name}</strong>
                    <span className="small muted">{percent}%</span>
                  </div>
                  <div className="small muted" style={{ marginTop: 2 }}>
                    {station.role}
                  </div>
                  <div className="pill-list" style={{ marginTop: 8 }}>
                    {materias.map((group) => (
                      <span className="badge" key={group.discipline}>
                        {group.label}
                      </span>
                    ))}
                    <span className="badge">{station.minutes} min</span>
                    <span className="badge badge-accent">
                      {station.materias.length} tópicos
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {user.plan === "free" && (
          <div style={{ marginTop: 20 }}>
            <AdSlot
              title="Quer a linha inteira sem interrupções?"
              description="O plano individual remove anúncios e libera o histórico completo de estudo."
            />
          </div>
        )}
        </div>
      </ShellPage>
  );
}
