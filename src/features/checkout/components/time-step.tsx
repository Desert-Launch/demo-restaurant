"use client";

import { Button } from "@/components/ui/button";
import type { OrderType } from "@/types";
import { cn } from "@/lib/utils";
import { fulfilmentSlots, leadMinutesFor } from "../slots";

export function TimeStep({
  type,
  now,
  scheduledFor,
  onChange,
  onBack,
  onNext,
}: {
  type: OrderType;
  now: Date;
  /** null means "as soon as you can". */
  scheduledFor: string | null;
  onChange: (value: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const slots = fulfilmentSlots(type, now);
  const verb = type === "delivery" ? "delivered" : "ready";

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-salt-50">
        When would you like it?
      </h2>
      <p className="mt-3 max-w-md text-salt-300">
        The kitchen needs about {leadMinutesFor(type)} minutes from the moment
        you place the order.
      </p>

      <div
        role="radiogroup"
        aria-label={`When the order should be ${verb}`}
        className="mt-8 flex flex-wrap gap-2"
      >
        <button
          type="button"
          role="radio"
          aria-checked={scheduledFor === null}
          onClick={() => onChange(null)}
          className={cn(
            "rounded-lg border px-4 py-3 text-sm transition-colors",
            scheduledFor === null
              ? "border-saffron-500 bg-saffron-950 text-saffron-200"
              : "border-oud-600 bg-oud-850 text-salt-200 hover:border-oud-500",
          )}
        >
          As soon as you can
        </button>

        {slots.map((slot) => {
          const active = scheduledFor === slot.value;
          return (
            <button
              key={slot.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(slot.value)}
              className={cn(
                "tnum rounded-lg border px-4 py-3 text-sm transition-colors",
                active
                  ? "border-saffron-500 bg-saffron-950 text-saffron-200"
                  : "border-oud-600 bg-oud-850 text-salt-200 hover:border-oud-500",
              )}
            >
              {slot.label}
            </button>
          );
        })}
      </div>

      {slots.length === 0 ? (
        <p className="mt-5 max-w-md text-sm text-salt-400">
          The kitchen has closed for today, so this order goes in as soon as it
          opens. Nothing is charged either way — this is a demo.
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button size="lg" onClick={onNext}>
          Review the order
        </Button>
      </div>
    </div>
  );
}
