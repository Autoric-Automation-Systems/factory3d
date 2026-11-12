import { publicAsset } from "./assets";

export type BrandAssets = {
  logo: string | null;
  logoName: string | null;
  logoIcon: string | null;
  devMark: string | null;
};

/** Só aponta para arquivos que existem, evitando 404 no console. */
export function brandAssets(): BrandAssets {
  const pick = (candidates: string[]) =>
    candidates.map(publicAsset).find((url) => url !== null) ?? null;

  return {
    logo: pick(["/brand/logo.png"]),
    logoName: pick(["/brand/logo-name-wide.png", "/brand/logo-name.png"]),
    logoIcon: pick(["/brand/logo-icon.png", "/brand/logo.png"]),
    devMark: pick(["/brand/dev-mark.png", "/brand/dev-logo.png"]),
  };
}
