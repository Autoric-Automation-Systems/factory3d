import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    highlight: false,
    features: [
      "Módulo Água mineral completo (8 estações)",
      "Progresso e troféu do módulo",
      "Favoritos",
      "Anúncios discretos entre estações",
    ],
    cta: "Começar agora",
    href: "/entrar",
  },
  {
    name: "Individual",
    price: "R$ 29",
    period: "por usuário / mês",
    highlight: true,
    features: [
      "Todas as linhas liberadas",
      "Sem anúncios",
      "Histórico e relatório de progresso",
      "Certificado de conclusão por módulo",
    ],
    cta: "Entrar na lista de espera",
    href: "/entrar",
  },
  {
    name: "Escola e indústria",
    price: "Sob consulta",
    period: "por usuário / ano",
    highlight: false,
    features: [
      "Painel do instrutor e turmas",
      "Relatório de competências por disciplina",
      "Conteúdo sob medida para a sua planta",
      "SSO e gestão de usuários",
    ],
    cta: "Falar com vendas",
    href: "/entrar",
  },
];

export default function PrecosPage() {
  return (
    <>
      <SiteHeader />
      <main className="container" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <div className="eyebrow">Planos</div>
        <h1 style={{ fontSize: 32 }}>Comece grátis, pague por usuário quando precisar</h1>
        <p style={{ maxWidth: 680 }}>
          A cobrança ainda não está ativa nesta versão. O plano gratuito inclui o módulo
          de Água mineral completo e exibe anúncios discretos entre as estações.
        </p>

        <div className="grid grid-3" style={{ marginTop: 24 }}>
          {plans.map((plan) => (
            <div
              className="card"
              key={plan.name}
              style={
                plan.highlight
                  ? { borderColor: "rgba(255,197,61,0.55)", boxShadow: "var(--shadow)" }
                  : undefined
              }
            >
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>{plan.name}</strong>
                {plan.highlight && <span className="badge badge-accent">recomendado</span>}
              </div>
              <div style={{ margin: "14px 0 4px" }}>
                <span className="big-number" style={{ fontSize: 32 }}>
                  {plan.price}
                </span>
              </div>
              <div className="small muted" style={{ marginBottom: 16 }}>
                {plan.period}
              </div>
              <ul style={{ paddingLeft: 18, margin: "0 0 18px" }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ marginBottom: 8 }}>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`btn btn-block ${plan.highlight ? "btn-primary" : ""}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 22 }}>
          <h3 style={{ fontSize: 17 }}>Por que por usuário?</h3>
          <p className="small" style={{ marginBottom: 0 }}>
            Cada aluno tem progresso, favoritos e histórico próprios. O preço por usuário
            acompanha o tamanho da turma e permite que a escola ou a indústria pague
            apenas por quem realmente treina.
          </p>
        </div>
      </main>
    </>
  );
}
