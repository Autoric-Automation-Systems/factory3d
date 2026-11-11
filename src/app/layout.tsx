import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  ),
  title: {
    default: "Fábrica 3D — treinamento industrial imersivo",
    template: "%s · Fábrica 3D",
  },
  description:
    "Caminhe por uma fábrica em primeira pessoa, entenda cada máquina e acompanhe seu progresso estação por estação.",
  applicationName: "Fábrica 3D",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Fábrica 3D — treinamento industrial imersivo",
    description:
      "Ambiente 3D em primeira pessoa para aprender automação, elétrica, mecânica e operação caminhando pela linha de produção.",
    images: [{ url: "/hero.jpg", width: 2752, height: 1536 }],
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f13",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
