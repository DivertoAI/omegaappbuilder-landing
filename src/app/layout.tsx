import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cfBeaconToken =
  process.env.NEXT_PUBLIC_CF_BEACON_TOKEN || "0465113f0c0c4b04b3232553a0c6ba9b";

export const metadata: Metadata = {
  title: {
    default: "Omega — AI Agents, 3D Websites & Apps",
    template: "%s | Omega App Builder",
  },
  description: "We build AI SDRs and 3D funnels that increase demo bookings and conversion rates — or we don't charge. Book a free 20-min scoping call.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  },
  alternates: {
    canonical: "https://omegaappbuilder.com",
  },
  openGraph: {
    siteName: "Omega App Builder",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/device-frames/devices.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div id="omega-app" className="flex min-h-screen flex-col">
          <div className="flex-1">
            {children}
          </div>
          <SiteFooter />
        </div>
        {cfBeaconToken && (
          <Script
            strategy="afterInteractive"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${cfBeaconToken}"}`}
          />
        )}
      </body>
    </html>
  );
}
