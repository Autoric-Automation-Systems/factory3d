import Link from "next/link";
import { brandAssets } from "@/lib/brand";
import BrandName from "./brand/BrandName";

export default function SiteFooter() {
  const brand = brandAssets();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          {brand.logoIcon && (
            <img
              className="footer-icon"
              src={brand.logoIcon}
              alt=""
              width={40}
              height={40}
            />
          )}
          <div>
            <BrandName src={brand.logoName} />
            <p className="small" style={{ margin: "8px 0 0" }}>
              Ambiente de aprendizagem industrial em 3D. A simulação apoia o treinamento e
              não substitui a capacitação prática nem autoriza operar equipamentos reais.
            </p>
          </div>
        </div>

        <nav className="footer-links" aria-label="Rodapé">
          <Link href="/">Início</Link>
          <Link href="/precos">Planos</Link>
          <Link href="/entrar">Entrar</Link>
        </nav>
      </div>
      <div className="container">
        <p className="small muted" style={{ margin: "18px 0 0" }}>
          © {year} Fábrica 3D · www.factory3d.app.br
        </p>
      </div>
    </footer>
  );
}
