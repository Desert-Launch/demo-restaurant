"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartActions } from "@/features/cart";
import type { MenuItem } from "@/types";
import { cn, formatAedWhole } from "@/lib/utils";
import { Plate } from "./plate";
import { TagChip } from "./tag-chip";

/**
 * One line of the printed card: the plate, the dish in both scripts, the
 * leader dots, the price, and the button that puts it in an order.
 */
export function DishRow({ item }: { item: MenuItem }) {
  const { add } = useCartActions();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    add(item);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
    toast.success(`${item.name} added to your order`, {
      description: "Open your order from the header when you are ready.",
    });
  }

  return (
    <li
      className={cn(
        "sf-seam grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 py-6 sm:grid-cols-[auto_1fr_auto] sm:gap-x-6",
        !item.available && "opacity-70",
      )}
    >
      <Plate
        course={item.course}
        unavailable={!item.available}
        className="mt-1 size-12 sm:size-14"
      />

      <div className="min-w-0">
        <div className="sf-leader">
          <h3 className="font-display text-xl font-semibold text-salt-50">
            {item.name}
          </h3>
          <span className="sf-leader-fill" aria-hidden="true" />
          <span className="tnum shrink-0 text-lg text-saffron-300">
            {formatAedWhole(item.priceFils)}
            <span className="sr-only"> dirhams</span>
          </span>
        </div>

        <p
          lang="ar"
          dir="rtl"
          className="mt-1 text-sm text-salt-400"
          // The Arabic name is the same dish, so it is decorative for anyone
          // already reading the English line above it.
          aria-hidden="true"
        >
          {item.arabicName}
        </p>

        <p className="mt-2 max-w-prose text-sm text-pretty text-salt-300">
          {item.description}
        </p>

        {item.tags.length > 0 || !item.available ? (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {!item.available ? (
              <span className="inline-flex items-center rounded-sm border border-oud-600 bg-oud-850 px-1.5 py-0.5 text-2xs tracking-wide text-salt-400 uppercase">
                Off tonight
              </span>
            ) : null}
            {item.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="col-start-2 sm:col-start-3 sm:self-center">
        <Button
          type="button"
          variant={justAdded ? "secondary" : "outline"}
          size="sm"
          onClick={handleAdd}
          disabled={!item.available}
          className="w-full sm:w-auto"
        >
          {justAdded ? (
            <>
              <Check aria-hidden="true" /> Added
            </>
          ) : (
            <>
              <Plus aria-hidden="true" /> Add to order
            </>
          )}
          <span className="sr-only"> — {item.name}</span>
        </Button>
      </div>
    </li>
  );
}
