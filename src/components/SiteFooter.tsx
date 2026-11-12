import Link from "next/link";
import { brandAssets } from "@/lib/brand";

const DEV_URL = "https://www.autoric.com.br";

export default function SiteFooter() {
  const brand = brandAssets();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-about">
          <p className="footer-title">Fábrica 3D</p>
          <p className="small">
            Ambiente de aprendizagem industrial em 3D. A simulação apoia o treinamento e
            não substitui a capacitação prática nem autoriza operar equipamentos reais.
          </p>
        </div>

        <nav className="footer-links" aria-label="Rodapé">
          <Link href="/">Início</Link>
          <Link href="/precos">Planos</Link>
          <Link href="/entrar">Entrar</Link>
        </nav>
      </div>

      <div className="container footer-base">
        <p className="small">© {year} Fábrica 3D · www.factory3d.app.br</p>

        <div className="footer-dev">
          <span className="small">Desenvolvido por</span>
          <a
            className="footer-dev-link"
            href={DEV_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Autoric Automação e Sistemas"
          >
            {brand.devMark && (
              <img className="footer-dev-mark" src={brand.devMark} alt="" width={157} height={22} />
            )}
            <span>
              <strong>Autoric Automação e Sistemas</strong>
              <span className="footer-dev-site">www.autoric.com.br</span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
