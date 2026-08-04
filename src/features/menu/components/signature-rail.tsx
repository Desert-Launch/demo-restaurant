"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { formatAedWhole } from "@/lib/utils";
import { useMenu } from "../hooks/use-menu";
import { COURSE_META } from "../taxonomy";
import { Plate } from "./plate";

/**
 * The house dishes on the home page. Plates run large here and overlap their
 * captions, so the section reads as a table being set rather than a grid of
 * product cards.
 */
export function SignatureRail() {
  const { data: menu, isPending } = useMenu();

  if (isPending) {
    return (
      <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <li key={index} className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-full" />
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
          </li>
        ))}
      </ul>
    );
  }

  const signatures = (menu ?? []).filter((item) =>
    item.tags.includes("signature"),
  );

  return (
    <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {signatures.map((item) => (
        <li key={item.id} className="group">
          <Link
            href={`/menu#${item.course}`}
            className="block rounded-xl focus-visible:outline-offset-8"
          >
            <div className="relative">
              <Plate
                course={item.course}
                unavailable={!item.available}
                className="aspect-square w-full transition-transform duration-(--sf-duration-slow) ease-(--sf-ease-out) group-hover:scale-[1.03]"
              />
              <span className="tnum absolute -right-1 -bottom-1 rounded-pill border border-oud-600 bg-oud-950 px-3 py-1.5 text-sm text-saffron-300 shadow-md">
                {formatAedWhole(item.priceFils)}
              </span>
            </div>

            <p className="sf-rail mt-6">{COURSE_META[item.course].label}</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-salt-50 transition-colors group-hover:text-saffron-300">
              {item.name}
            </h3>
            <p className="mt-2 text-sm text-pretty text-salt-300">
              {item.description}
            </p>
            {!item.available ? (
              <p className="mt-2 text-xs text-salt-400">
                Off tonight — the kitchen will have it back tomorrow.
              </p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
