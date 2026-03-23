import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./provider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Suba — Transporte AMBA en tiempo real",
  description: "Subtes, paradas y mapa del AMBA en tiempo real. Próximas llegadas, alertas y más.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Suba",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1D9E75",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} ${spaceMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
