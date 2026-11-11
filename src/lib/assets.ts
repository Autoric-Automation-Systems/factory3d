import fs from "node:fs";
import path from "node:path";

/** Devolve a URL do arquivo em public/ somente se ele existir, para não gerar 404. */
export function publicAsset(url: string): string | null {
  try {
    const file = path.join(process.cwd(), "public", url.replace(/^\//, ""));
    return fs.existsSync(file) ? url : null;
  } catch {
    return null;
  }
}
