import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fábrica 3D — treinamento industrial imersivo",
  description:
    "Caminhe por uma fábrica em primeira pessoa, entenda cada máquina e acompanhe seu progresso estação por estação.",
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
