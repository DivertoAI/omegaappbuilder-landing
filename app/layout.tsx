import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { OmegaModeProvider } from "@/app/components/mode-provider";
import { SiteShell } from "@/app/components/site-shell";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "OmegaAppBuilder — Operating system for real estate developers",
  description: "OmegaAppBuilder builds the full stack for real estate developers: 3D properties, marketing sites, CRM, agents, and ops.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}>
      <body>
        <OmegaModeProvider>
          <SiteShell>{children}</SiteShell>
        </OmegaModeProvider>
      </body>
    </html>
  );
}
