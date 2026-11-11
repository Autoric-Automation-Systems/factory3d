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

/** Só aponta para os arquivos de /brand que realmente existem, evitando 404 no console. */
export function brandAssets(): BrandAssets {
  const logo = "/brand/logo/logo.svg";
  const logoName = "/brand/logo-name/logo-name.svg";
  return {
    logo: exists(logo) ? logo : null,
    logoName: exists(logoName) ? logoName : null,
  };
}
