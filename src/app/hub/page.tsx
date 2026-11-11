import ShellPage from "@/components/shell/ShellPage";
import { requireUser, storageWarning } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function HubPage() {
  const user = await requireUser();
  const warning = storageWarning();

  return (
    <ShellPage user={user}>
      <div className="void" aria-hidden="true">
        <div className="void-glow" />
        <div className="void-floor" />
        <div className="void-vignette" />
      </div>

      <div className="void-hint">
        <span className="kbd">M</span>
        <span>abrir os mapas</span>
      </div>

      {warning && (
        <div className="void-warning">
          <strong>Atenção</strong>
          <span className="small">{warning}</span>
        </div>
      )}
    </ShellPage>
  );
}
