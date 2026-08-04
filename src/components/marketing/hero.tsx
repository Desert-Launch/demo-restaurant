"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { HOUSE } from "@/lib/house";

const FACTS = [
  { value: "38", label: "dishes on the card" },
  { value: "19", label: "tables in the room" },
  { value: "16:00", label: "the coals are lit" },
] as const;

/**
 * The thesis, not a template: the fire is the point, and the room is built
 * around it. One page-load reveal, staggered, and nothing else moves.
 */
export function Hero() {
  const reduced = useReducedMotion();

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: [0.2, 0.8, 0.2, 1] as const },
        };

  return (
    <section className="relative overflow-hidden border-b border-oud-700">
      {/* The house lattice, thrown across the top-right of the room. */}
      <div
        aria-hidden="true"
        className="sf-mashrabiya pointer-events-none absolute -top-32 -right-24 size-[36rem] opacity-40 [mask-image:radial-gradient(closest-side,#000,transparent)]"
      />
      {/* The fire, banked low behind the copy. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 left-1/4 h-[32rem] w-[38rem] rounded-full bg-saffron-800/25 blur-[120px]"
      />

      <PageContainer className="relative py-24 sm:py-32 lg:py-40">
        <motion.p {...rise(0)} className="sf-rail">
          {HOUSE.address.line2} · {HOUSE.tagline}
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          className="mt-6 max-w-4xl font-display text-5xl leading-flat font-semibold text-balance text-salt-50 sm:text-6xl"
        >
          The grill is the loudest thing in the room.
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-8 max-w-xl text-lg text-pretty text-salt-300"
        >
          One fire, lit at four, and a card built around what comes off it —
          lamb chops, kafta, whole hammour — with the mezze arriving first and
          not stopping. Saffron rice takes an hour, so we start it before you
          arrive.
        </motion.p>

        <motion.div {...rise(0.24)} className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" className="shadow-saffron">
            <Link href="/reserve">
              Reserve a table <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/menu">Order online</Link>
          </Button>
        </motion.div>

        <motion.dl
          {...rise(0.32)}
          className="mt-20 grid max-w-2xl grid-cols-3 gap-6 border-t border-oud-700 pt-8"
        >
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <dt className="sr-only">{fact.label}</dt>
              <dd>
                <span className="tnum block text-3xl font-semibold text-saffron-400">
                  {fact.value}
                </span>
                <span className="mt-1 block text-xs text-salt-400">
                  {fact.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </PageContainer>
    </section>
  );
}
