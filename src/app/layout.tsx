import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";

import { Providers } from "./providers";
import { DemoBar } from "@/components/layout/demo-bar";
import "./globals.css";

/* Display: Fraunces — a variable serif with soft, slightly wonky terminals.
   Warm and edible, and deliberately not the tasteful fine-dining reach.
   Body: Hanken Grotesk — humanist, quiet, sits under Fraunces without
   arguing. Data: IBM Plex Mono — every price, cover count, code and time. */
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-sf-display",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sf-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sf-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // Fictional business, invented contact details: never a search result.
  robots: { index: false, follow: false },
  title: {
    default: "Saffron & Oud — Levantine and Emirati dining in Dubai",
    template: "%s · Saffron & Oud",
  },
  description:
    "Charcoal grills, mezze and saffron rice in Al Fahidi. Reserve a table or order for pickup and delivery across Dubai.",
};

export const viewport: Viewport = {
  // The one literal colour in the app. It is serialised into a meta tag before
  // any stylesheet loads, so it cannot reference --sf-oud-950; keep the two in
  // step by hand.
  themeColor: "#08100e",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} min-h-dvh bg-background text-foreground`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-saffron-500 focus:px-4 focus:py-2 focus:text-sm focus:text-oud-950"
        >
          Skip to content
        </a>
        <DemoBar demo="Saffron & Oud" slug="restaurant" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
