import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    highlight: false,
    features: [
      "Módulo Água mineral completo (10 estações)",
      "Progresso e troféu do módulo",
      "Favoritos",
      "Anúncios discretos no painel e nas telas de apoio",
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
      "Todos os mapas liberados",
      "Sem anúncios",
      "Histórico completo de progresso",
      "Certificado de conclusão por módulo",
    ],
    cta: "Entrar na lista de espera",
    href: "/entrar",
  },
  {
    name: "Escola",
    price: "R$ 99",
    period: "a partir de 10 vagas / mês",
    highlight: false,
    features: [
      "A partir de 10 vagas rotativas",
      "Cada mapa ocupa 1 vaga",
      "A escola indica qual mapa cada aluno acessa",
      "Vagas rotativas: realoque quando o aluno concluir",
      "Painel da turma e relatório de competências",
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
        <h1 style={{ fontSize: 32 }}>Comece grátis, pague por vaga quando precisar</h1>
        <p style={{ maxWidth: 700 }}>
          A cobrança ainda não está ativa nesta versão. O plano gratuito inclui o módulo
          de Água mineral completo e exibe anúncios discretos. Individual e Escola entram
          em cobrança na próxima etapa.
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

        <div className="grid grid-2" style={{ marginTop: 22 }}>
          <div className="card">
            <h3 style={{ fontSize: 17 }}>Como funciona a vaga do plano Escola</h3>
            <p className="small" style={{ marginBottom: 0 }}>
              A instituição contrata um pacote de vagas rotativas, com mínimo de 10. Cada
              vaga dá acesso a um mapa. A escola decide qual mapa cada aluno acessa; quando
              o aluno conclui, a vaga volta para o pacote e pode ser atribuída a outro
              aluno. É o modelo certo para turmas que se renovam a cada semestre.
            </p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: 17 }}>Por que não é licença por aluno fixo?</h3>
            <p className="small" style={{ marginBottom: 0 }}>
              Escola trabalha com turmas que entram e saem. Vaga rotativa evita pagar por
              aluno inativo e mantém o custo previsível: 10 vagas por R$ 99/mês.
            </p>
          </div>
        </div>

        <p className="small" style={{ marginTop: 22 }}>
          Valores em reais, sem impostos. Individual e Escola incluem certificado e
          histórico; o plano Escola adiciona painel da turma e relatório por competência.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
