"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MAX_PARTY_SIZE } from "@/types";
import { cn, formatCovers } from "@/lib/utils";

const SIZES = Array.from({ length: MAX_PARTY_SIZE }, (_, index) => index + 1);

export function PartyStep({
  partySize,
  onChange,
  onNext,
}: {
  partySize: number;
  onChange: (size: number) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-salt-50">
        How many are eating?
      </h2>
      <p className="mt-3 max-w-md text-salt-300">
        We seat up to eight at one table. The long table takes the full eight,
        and it books out first.
      </p>

      <div
        role="group"
        aria-label="Party size"
        className="mt-8 grid grid-cols-4 gap-2 sm:max-w-md"
      >
        {SIZES.map((size) => {
          const active = size === partySize;
          return (
            <button
              key={size}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(size)}
              className={cn(
                "tnum rounded-lg border py-4 text-xl transition-colors",
                active
                  ? "border-saffron-500 bg-saffron-950 text-saffron-200 shadow-saffron"
                  : "border-oud-600 bg-oud-850 text-salt-200 hover:border-oud-500 hover:bg-oud-800",
              )}
            >
              {size}
              <span className="sr-only"> {formatCovers(size)}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-salt-400">
        More than eight?{" "}
        <Link
          href="/contact"
          className="rounded-sm text-saffron-300 underline underline-offset-4"
        >
          Tell us what you need
        </Link>{" "}
        and we will put tables together.
      </p>

      <div className="mt-10">
        <Button size="lg" onClick={onNext}>
          Choose a time
        </Button>
      </div>
    </div>
  );
}
