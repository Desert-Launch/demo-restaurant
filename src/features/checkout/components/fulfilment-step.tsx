"use client";

import { Bike, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DELIVERY_FEE_FILS, type OrderType } from "@/types";
import { HOUSE } from "@/lib/house";
import { cn, formatAedWithUnit } from "@/lib/utils";
import { DELIVERY_LEAD_MINUTES, PICKUP_LEAD_MINUTES } from "../slots";

const OPTIONS = [
  {
    value: "pickup" as const,
    label: "Collect it yourself",
    icon: ShoppingBag,
    detail: `Ready in about ${PICKUP_LEAD_MINUTES} minutes. Come to the courtyard door.`,
    cost: "No fee",
  },
  {
    value: "delivery" as const,
    label: "Have it delivered",
    icon: Bike,
    detail: `About ${DELIVERY_LEAD_MINUTES} minutes across the areas we cover.`,
    cost: `${formatAedWithUnit(DELIVERY_FEE_FILS)} fee`,
  },
];

export function FulfilmentStep({
  type,
  onChange,
  onNext,
}: {
  type: OrderType;
  onChange: (type: OrderType) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-salt-50">
        Collecting or delivering?
      </h2>
      <p className="mt-3 max-w-md text-salt-300">
        We cook to order either way. Collection is quicker, and the mezze
        travels better than the grills do.
      </p>

      <div
        role="radiogroup"
        aria-label="How you want the order"
        className="mt-8 grid gap-3 sm:max-w-lg sm:grid-cols-2"
      >
        {OPTIONS.map((option) => {
          const active = type === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-xl border p-5 text-left transition-colors",
                active
                  ? "border-saffron-500 bg-saffron-950 shadow-saffron"
                  : "border-oud-600 bg-oud-850 hover:border-oud-500 hover:bg-oud-800",
              )}
            >
              <Icon
                className={cn(
                  "size-5",
                  active ? "text-saffron-400" : "text-salt-400",
                )}
                aria-hidden="true"
              />
              <p className="mt-4 text-salt-50">{option.label}</p>
              <p className="mt-1 text-sm text-salt-400">{option.detail}</p>
              <p className="tnum mt-3 text-xs text-saffron-300">{option.cost}</p>
            </button>
          );
        })}
      </div>

      {type === "pickup" ? (
        <p className="mt-6 max-w-md text-sm text-salt-400">
          {HOUSE.address.line1}, {HOUSE.address.line2}. {HOUSE.directions}
        </p>
      ) : null}

      <div className="mt-10">
        <Button size="lg" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
