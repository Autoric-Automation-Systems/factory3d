import Link from "next/link";
import { redirect } from "next/navigation";
import { loginDemo, loginWithGoogle } from "@/app/actions";
import { currentUser } from "@/lib/session";
import { googleEnabled } from "@/auth";
import { brandAssets } from "@/lib/brand";
import BrandName from "@/components/brand/BrandName";

export const dynamic = "force-dynamic";

export default async function EntrarPage() {
  const user = await currentUser();
  if (user) redirect("/hub");
  const brand = brandAssets();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        className="card"
        style={{ width: "100%", maxWidth: 430, boxShadow: "var(--shadow)" }}
      >
        <Link href="/" className="brand" style={{ marginBottom: 22 }} aria-label="Fábrica 3D">
          <BrandName src={brand.logoName} />
        </Link>

        <h1 style={{ fontSize: 24 }}>Entrar</h1>
        <p className="small">
          Use sua conta Google para salvar progresso, favoritos e troféus. É gratuito
          nesta fase.
        </p>

        <div className="stack" style={{ marginTop: 18 }}>
          {googleEnabled ? (
            <form action={loginWithGoogle}>
              <button className="btn btn-primary btn-block" type="submit">
                Continuar com Google
              </button>
            </form>
          ) : (
            <button className="btn btn-primary btn-block" type="button" disabled>
              Continuar com Google
            </button>
          )}

          <form action={loginDemo}>
            <button className="btn btn-block" type="submit">
              Entrar para testar (demonstração)
            </button>
          </form>
        </div>

        {!googleEnabled && (
          <p className="small" style={{ marginTop: 16 }}>
            O login com Google aparece automaticamente quando{" "}
            <span className="mono">GOOGLE_CLIENT_ID</span> e{" "}
            <span className="mono">GOOGLE_CLIENT_SECRET</span> estiverem definidos no
            ambiente.
          </p>
        )}

        <hr className="divider" style={{ margin: "20px 0" }} />
        <p className="small" style={{ marginBottom: 0 }}>
          O acesso de demonstração é compartilhado e serve só para teste. Crie uma conta
          Google para ter seu próprio progresso.
        </p>
      </div>
    </main>
  );
}
