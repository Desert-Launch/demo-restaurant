import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";

import { Providers } from "./providers";
import { DemoBar } from "@/components/layout/demo-bar";
import { demoJsonLd, demoMetadata } from "@/lib/desert-launch";
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
  title: {
    default: "Demo Restaurant — Levantine and Emirati dining in Dubai",
    template: "%s · Demo Restaurant",
  },
  // Share preview, robots, canonical host and the link back to the studio.
  ...demoMetadata(),
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
        <DemoBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(demoJsonLd()) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
