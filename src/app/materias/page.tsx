import Link from "next/link";
import ShellPage from "@/components/shell/ShellPage";
import { requireUser } from "@/lib/session";
import { playableModules } from "@/content/catalog";
import { materiaFeed, materiaIndex, LEVEL_LABEL } from "@/lib/materias";

export const dynamic = "force-dynamic";

export default async function MateriasPage({
  searchParams,
}: {
  searchParams: Promise<{ materia?: string }>;
}) {
  const { materia } = await searchParams;
  const user = await requireUser();
  const index = materiaIndex(playableModules);
  const selected = index.find((row) => row.discipline === materia);
  const feed = selected ? materiaFeed(playableModules, selected.discipline) : [];
  const totalTopics = index.reduce((sum, row) => sum + row.topics, 0);

  return (
    <ShellPage user={user}>
      <div className="stage-scroll">
        <Link href="/hub" className="small muted">
          ← Início
        </Link>
        <h1 style={{ fontSize: 30, marginTop: 8 }}>Matérias técnicas</h1>
        <p style={{ maxWidth: 660 }}>
          A linha de envase organizada por disciplina. Cada matéria reúne os componentes que
          aquela área explica, do fundamento ao diagnóstico de falha.
        </p>

        <div className="pill-list" style={{ margin: "18px 0 22px" }}>
          <Link className="badge badge-btn" data-active={!selected} href="/materias">
            Todas ({totalTopics})
          </Link>
          {index.map((row) => (
            <Link
              key={row.discipline}
              className="badge badge-btn"
              data-active={selected?.discipline === row.discipline}
              href={`/materias?materia=${row.discipline}`}
            >
              {row.label} ({row.topics})
            </Link>
          ))}
        </div>

        {!selected && (
          <div className="grid-2">
            {index.map((row) => (
              <Link
                key={row.discipline}
                className="card card-tight materia-card"
                href={`/materias?materia=${row.discipline}`}
              >
                <div className="eyebrow">Matéria</div>
                <strong style={{ fontSize: 18 }}>{row.label}</strong>
                <p className="small" style={{ margin: "6px 0 12px" }}>
                  {row.topics} tópicos em {row.stations}{" "}
                  {row.stations === 1 ? "estação" : "estações"}.
                </p>
                <span className="badge badge-accent">Abrir matéria</span>
              </Link>
            ))}
          </div>
        )}

        {selected && (
          <>
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div className="eyebrow">Disciplina</div>
                <h2 style={{ fontSize: 24 }}>{selected.label}</h2>
                <p className="small" style={{ margin: 0 }}>
                  {selected.topics} tópicos distribuídos em {selected.stations} estações.
                </p>
              </div>
              <span className="badge">{selected.stations} estações</span>
            </div>

            <div className="stack" style={{ gap: 12 }}>
              {feed.map((entry) => (
                <article
                  className="card card-tight materia-card"
                  key={`${entry.station.id}-${entry.topic.id}`}
                >
                  <div className="materia-head">
                    <span className="level-chip" data-level={entry.topic.level}>
                      Nível {entry.topic.level} · {LEVEL_LABEL[entry.topic.level]}
                    </span>
                    <span className="small muted">
                      {entry.station.name} · tópico {entry.index + 1}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 17, margin: "2px 0 6px" }}>{entry.topic.title}</h3>
                  <p className="small" style={{ margin: "0 0 10px" }}>
                    {entry.topic.summary}
                  </p>

                  <ul>
                    {entry.topic.bullets.map((item) => (
                      <li key={item} className="small">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div
                    className="row"
                    style={{ justifyContent: "space-between", marginTop: 12 }}
                  >
                    <span className="small muted">{entry.module.name}</span>
                    <Link
                      className="btn btn-sm"
                      href={`/jogar/${entry.module.slug}?e=${entry.station.id}`}
                    >
                      Abrir estação
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </ShellPage>
  );
}
