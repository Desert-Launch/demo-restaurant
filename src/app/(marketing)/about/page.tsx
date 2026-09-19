import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ChefsNote } from "@/components/marketing/chefs-note";
import { VisitPanel } from "@/components/marketing/visit-panel";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "A courtyard house in Dubai, one charcoal fire, and a card that runs from Levantine mezze to Emirati machboos.",
};

const CHAPTERS = [
  {
    rail: "2019",
    title: "A house nobody wanted",
    body: "The building had been shut for a decade and the courtyard was full of sand. It took eleven months to make it a kitchen, most of it spent arguing about where the extraction could go in a heritage wall.",
  },
  {
    rail: "The card",
    title: "Two cuisines that already share a pantry",
    body: "Levantine cooking and Emirati cooking meet at spice, rice and slow lamb. We did not fuse anything — we put both on one card and let the loomi and the sumac sit next to each other.",
  },
  {
    rail: "The fire",
    title: "One grill, no gas",
    body: "Everything charred here was charred over lump charcoal. It is slower, it is harder to hold steady, and it is the reason the lamb tastes like it does.",
  },
  {
    rail: "The people",
    title: "Nine in the kitchen, seven in the room",
    body: "Most of them have been here since the second year. The mezze section is three people who have worked together long enough to stop talking during service.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageContainer className="py-20">
        <p className="sf-rail">About</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight font-semibold text-balance text-salt-50">
          A Levantine kitchen that learned to cook like the Gulf
        </h1>
        <p className="mt-6 max-w-xl text-lg text-pretty text-salt-300">
          The Demo Restaurant opened in a courtyard house in Dubai with one
          fire, forty covers and a card that has changed about six times since.
        </p>

        <div className="mt-20 grid gap-x-10 gap-y-14 md:grid-cols-2">
          {CHAPTERS.map((chapter) => (
            <article key={chapter.rail} className="sf-seam pt-6">
              <p className="sf-rail">{chapter.rail}</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-balance text-salt-50">
                {chapter.title}
              </h2>
              <p className="mt-3 text-pretty text-salt-300">{chapter.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/reserve">Reserve a table</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/menu">Read the card</Link>
          </Button>
        </div>
      </PageContainer>

      <ChefsNote />
      <VisitPanel />
    </>
  );
}
