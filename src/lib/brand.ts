import fs from "node:fs";
import path from "node:path";

export type BrandAssets = { logo: string | null; logoName: string | null };

function exists(url: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", url.replace(/^\//, "")));
  } catch {
    return false;
  }
}

/** Só aponta para arquivos que existem, evitando 404 no console. */
export function brandAssets(): BrandAssets {
  const pick = (candidates: string[]) => candidates.find(exists) ?? null;

  return {
    logo: pick(["/brand/logo/logo.svg", "/brand/logo/logo.png", "/logo.png"]),
    logoName: pick([
      "/brand/logo-name/logo-name.svg",
      "/brand/logo-name/logo-name.png",
      "/logo_name.png",
    ]),
  };
}
