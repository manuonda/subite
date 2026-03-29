import type { Metadata, Viewport } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./provider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const BASE_URL = "https://suba.com.ar";

export const metadata: Metadata = {
  title: {
    default: "Suba — Transporte AMBA en tiempo real",
    template: "%s | Suba",
  },
  description:
    "Subtes, paradas y mapa del AMBA en tiempo real. Próximas llegadas, alertas y más.",
  keywords: [
    "subte",
    "colectivos",
    "AMBA",
    "Buenos Aires",
    "transporte",
    "tiempo real",
    "llegadas",
    "alertas",
    "mapa",
  ],
  manifest: "/manifest.json",
  icons: { icon: "/icon-suba.png", apple: "/icon-suba.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Suba",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: BASE_URL,
    siteName: "Suba",
    title: "Suba — Transporte AMBA en tiempo real",
    description:
      "Subtes, paradas y mapa del AMBA en tiempo real. Próximas llegadas, alertas y más.",
    images: [{ url: `${BASE_URL}/icon-suba.png`, width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "Suba — Transporte AMBA en tiempo real",
    description:
      "Subtes, paradas y mapa del AMBA en tiempo real. Próximas llegadas, alertas y más.",
    images: [`${BASE_URL}/icon-suba.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3D9DF3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${outfit.variable} ${spaceMono.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('suba-theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'light';var L=localStorage.getItem('suba-locale'),M={es:'es-AR',en:'en-GB','pt-BR':'pt-BR',pl:'pl','en-US':'en-US',ja:'ja',zh:'zh-Hans'};if(L&&M[L])document.documentElement.lang=M[L];}catch(e){document.documentElement.dataset.theme='light';}})();`,
          }}
        />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
