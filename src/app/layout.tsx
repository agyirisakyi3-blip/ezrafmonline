import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/ads";
import GoogleAdsense from "@/components/ads/google-adsense";
import MetaPixel from "@/components/ads/meta-pixel";
import Analytics from "@/components/analytics";
import ServiceWorkerRegister from "@/components/service-worker-register";
import ThemeProvider from "@/components/theme-provider";
import CookieConsent from "@/components/cookie-consent";
import BackToTop from "@/components/back-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.AUTH_URL || "http://localhost:3001";

export const metadata: Metadata = {
  title: {
    default: "Ezrafmonline",
    template: "%s | Ezrafmonline",
  },
  description: "Your trusted source for the latest news, breaking stories and updates",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: "Ezrafmonline",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#256b12" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ezrafmonline" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://openweathermap.org" />
        <link rel="alternate" type="application/rss+xml" title="Ezrafmonline RSS" href="/rss.xml" />
        <link rel="sitemap" type="application/xml" title="News Sitemap" href="/news-sitemap.xml" />
        <meta name="geo.region" content="GH" />
        <meta name="geo.placename" content="Ghana" />
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
        )}
        {config?.googleAdsenseId && (
          <GoogleAdsense publisherId={config.googleAdsenseId} />
        )}
        {config?.metaPixelId && (
          <MetaPixel pixelId={config.metaPixelId} />
        )}
      </head>
      <body className="min-h-screen bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <CookieConsent />
        <BackToTop />
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
