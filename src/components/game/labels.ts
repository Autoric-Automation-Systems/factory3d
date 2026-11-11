import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

export function labelTexture(title: string, subtitle: string, accent: string) {
  const key = `${title}|${subtitle}|${accent}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const width = 512;
  const height = 150;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d indisponível");

  ctx.fillStyle = "rgba(10, 16, 21, 0.9)";
  roundRect(ctx, 4, 4, width - 8, height - 8, 22);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  roundRect(ctx, 4, 4, width - 8, height - 8, 22);
  ctx.stroke();

  ctx.fillStyle = accent;
  ctx.fillRect(24, 30, 6, height - 60);

  ctx.fillStyle = "#eef4f9";
  ctx.font = "700 40px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText(truncate(ctx, title, width - 80), 48, 28);

  ctx.fillStyle = "#93a5b4";
  ctx.font = "500 26px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.fillText(truncate(ctx, subtitle, width - 80), 48, 82);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, texture);
  return texture;
}

function truncate(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let result = text;
  while (result.length > 3 && ctx.measureText(`${result}…`).width > maxWidth) {
    result = result.slice(0, -1);
  }
  return `${result}…`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
