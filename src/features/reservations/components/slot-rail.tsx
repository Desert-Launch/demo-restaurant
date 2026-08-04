"use client";

import { SERVICES } from "@/lib/house";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatTime, pluralize } from "@/lib/utils";
import type { ServiceId } from "@/types";
import { canSeat, fitFor, type SlotOccupancy } from "../availability";

/**
 * The signature element.
 *
 * Every seating time in the day, grouped by service, each showing how much of
 * the room is left *for this party* — one diamond per table that could hold
 * them, filled as the slot books out. The diamond is the unit the house
 * lattice repeats, so the rail fills in with the same pattern that runs behind
 * the hero.
 *
 * The pips are decorative; the caption underneath carries the same fact in
 * words, and the button's accessible name states it outright.
 */

function TablePips({ free, total }: { free: number; total: number }) {
  return (
    <span aria-hidden="true" className="flex flex-wrap gap-1">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={cn(
            "size-1.5 rotate-45",
            index < total - free
              ? "bg-saffron-600/70"
              : "bg-transparent ring-1 ring-oud-500 ring-inset",
          )}
        />
      ))}
    </span>
  );
}

function SlotButton({
  slot,
  partySize,
  selected,
  onSelect,
}: {
  slot: SlotOccupancy;
  partySize: number;
  selected: boolean;
  onSelect: (startsAt: string) => void;
}) {
  const { free, total } = fitFor(slot, partySize);
  const bookable = canSeat(slot, partySize);
  const time = formatTime(slot.startsAt);

  const caption = !slot.bookable
    ? "Too late"
    : free === 0
      ? "Full"
      : `${free} ${pluralize(free, "table", "tables")}`;

  return (
    <button
      type="button"
      disabled={!bookable}
      aria-pressed={selected}
      onClick={() => onSelect(slot.startsAt)}
      className={cn(
        "flex min-w-24 flex-col gap-2.5 rounded-lg border px-3 py-3 text-left transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-45",
        selected
          ? "border-saffron-500 bg-saffron-950 shadow-saffron"
          : "border-oud-600 bg-oud-850 hover:border-oud-500 hover:bg-oud-800",
      )}
    >
      <span
        className={cn(
          "tnum text-lg leading-none",
          selected ? "text-saffron-200" : "text-salt-100",
        )}
      >
        {time}
      </span>
      <TablePips free={free} total={total} />
      <span
        className={cn(
          "text-xs",
          free === 0 || !slot.bookable ? "text-salt-400" : "text-salt-300",
        )}
      >
        {caption}
      </span>
      <span className="sr-only">
        {time}, {caption === "Full"
          ? `no tables left for ${partySize}`
          : caption === "Too late"
            ? "too close to book"
            : `${free} of ${total} tables free for a party of ${partySize}`}
      </span>
    </button>
  );
}

export function SlotRail({
  slots,
  partySize,
  selected,
  onSelect,
  isPending,
}: {
  slots: SlotOccupancy[];
  partySize: number;
  selected: string | null;
  onSelect: (startsAt: string) => void;
  isPending?: boolean;
}) {
  if (isPending) {
    return (
      <div className="space-y-8" aria-hidden="true">
        {SERVICES.map((service) => (
          <div key={service.id} className="space-y-3">
            <Skeleton className="h-4 w-28" />
            <div className="flex gap-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-24 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {SERVICES.map((service) => {
        const forService = slots.filter((slot) => slot.service === service.id);
        if (forService.length === 0) return null;

        const anyOpen = forService.some((slot) => canSeat(slot, partySize));

        return (
          <section key={service.id} aria-labelledby={`service-${service.id}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 id={`service-${service.id}`} className="sf-rail">
                {service.label} · {service.note}
              </h3>
              {!anyOpen ? (
                <p className="text-xs text-salt-400">
                  Nothing left at {service.label.toLowerCase()} for{" "}
                  {partySize} — try another day.
                </p>
              ) : null}
            </div>

            <div
              role="group"
              aria-label={`${service.label} seating times`}
              className="mt-3 flex gap-2 overflow-x-auto pb-2"
            >
              {forService.map((slot) => (
                <SlotButton
                  key={slot.startsAt}
                  slot={slot}
                  partySize={partySize}
                  selected={selected === slot.startsAt}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export type { ServiceId };
