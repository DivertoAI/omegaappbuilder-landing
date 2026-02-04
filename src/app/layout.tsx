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
  title: "Omega App Builder",
  description: "High-converting landing pages, websites & app UI. Clear messaging, fast load times, fixed pricing. Turnarounds 48–72h. Get a free 3-point audit.",
   icons: {
    icon: "/logo.png",         
    shortcut: "/logo.png",
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
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-white text-slate-900 antialiased`}>
        <div className="flex min-h-screen flex-col">
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
