import Link from "next/link";

export default function AdSlot({
  title = "Espaço para parceiros industriais",
  description = "Sua marca para quem já está dentro da fábrica. Formato 728×90 ou card nativo.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="ad">
      <div>
        <div className="label">Anúncio · plano gratuito</div>
        <strong style={{ display: "block", margin: "4px 0 2px" }}>{title}</strong>
        <span className="small muted">{description}</span>
      </div>
      <Link href="/precos" className="btn btn-sm">
        Remover anúncios
      </Link>
    </div>
  );
}
