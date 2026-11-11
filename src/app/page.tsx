import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { lines, totalStations } from "@/content/catalog";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />

      <section className="hero">
        <Image
          src="/brand/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-media"
        />
        <div className="hero-veil" aria-hidden="true" />
        <div className="container">
          <div className="eyebrow">Treinamento industrial imersivo</div>
          <h1>Entre na fábrica. Entenda cada máquina.</h1>
          <p className="lead">
            Um ambiente 3D em primeira pessoa para aprender automação, elétrica,
            mecânica e operação caminhando pela linha de produção. Cada estação tem
            funcionamento animado, componentes, parâmetros, falhas comuns e quiz.
          </p>
          <div className="row" style={{ marginTop: 26 }}>
            <Link href="/entrar" className="btn btn-primary">
              Começar agora — gratuito
            </Link>
            <Link href="/precos" className="btn btn-ghost">
              Ver planos
            </Link>
          </div>
          <p className="small" style={{ marginTop: 14 }}>
            {totalStations} estações navegáveis na primeira linha · desktop e celular ·
            sem instalar nada
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-3">
          {[
            {
              title: "Aprender andando",
              text: "O mapa é a própria fábrica. Você chega na máquina, abre o painel e entende o processo no lugar onde ele acontece.",
            },
            {
              title: "Progresso visível",
              text: "Cada estação tem marcação de visto, quiz e troféu. O percentual do módulo mostra exatamente o que falta.",
            },
            {
              title: "Feito para o chão de fábrica",
              text: "Conteúdo técnico de verdade: parâmetros, intertravamentos, LOTO, falhas comuns e o que verificar.",
            },
          ].map((item) => (
            <div className="card" key={item.title}>
              <h3 style={{ fontSize: 17 }}>{item.title}</h3>
              <p className="small" style={{ marginBottom: 0 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section className="section" id="como-funciona">
        <div className="container">
          <div className="eyebrow">Como funciona</div>
          <h2>Quatro passos por estação</h2>
          <div className="grid grid-4" style={{ marginTop: 20 }}>
            {[
              ["1", "Chegue", "Caminhe até a máquina com WASD, setas ou joystick no celular."],
              ["2", "Examine", "Abra o painel e leia funcionamento, componentes e operação."],
              ["3", "Marque o visto", "Cada bloco lido é registrado e entra no percentual do módulo."],
              ["4", "Responda", "O quiz fecha a estação e libera o troféu do módulo."],
            ].map(([n, title, text]) => (
              <div className="card card-tight" key={n}>
                <div className="num" style={{ marginBottom: 10 }}>
                  {n}
                </div>
                <strong>{title}</strong>
                <p className="small" style={{ margin: "6px 0 0" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container">
          <div className="eyebrow">Mapa de fábricas</div>
          <h2>Linhas disponíveis</h2>
          <div className="grid grid-3" style={{ marginTop: 20 }}>
            {lines.map((line) => (
              <div className="card" key={line.id}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <strong style={{ fontSize: 17 }}>{line.name}</strong>
                  <span className="badge">{line.tagline}</span>
                </div>
                <p className="small" style={{ marginTop: 10 }}>
                  {line.description}
                </p>
                <div className="pill-list">
                  {line.modules.map((mod) => (
                    <span
                      className={`badge ${mod.status === "playable" ? "badge-ok" : ""}`}
                      key={mod.id}
                    >
                      {mod.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="small" style={{ marginTop: 16 }}>
            A primeira linha liberada é <strong>Envase · Água mineral</strong>, com{" "}
            {totalStations} estações. As demais entram em expansão.
          </p>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 28 }}>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div style={{ maxWidth: 620 }}>
                <h2 style={{ fontSize: 24 }}>Comece pelo plano gratuito</h2>
                <p style={{ marginBottom: 0 }}>
                  A linha de água está liberada para explorar. O plano gratuito mostra
                  anúncios discretos entre as estações; o plano individual remove os
                  anúncios e guarda o histórico completo.
                </p>
              </div>
              <div className="row">
                <Link href="/entrar" className="btn btn-primary">
                  Entrar com Google
                </Link>
                <Link href="/precos" className="btn">
                  Comparar planos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
