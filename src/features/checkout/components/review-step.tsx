"use client";

import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import type { CheckoutDetailsValues } from "../schema";

export function ReviewStep({
  details,
  scheduledFor,
  pending,
  onBack,
  onPlace,
}: {
  details: CheckoutDetailsValues;
  scheduledFor: string | null;
  pending: boolean;
  onBack: () => void;
  onPlace: () => void;
}) {
  const rows = [
    {
      label: details.type === "delivery" ? "Delivering to" : "Collecting",
      value:
        details.type === "delivery"
          ? `${details.addressLine}, ${details.area}`
          : "The courtyard door, Demo District",
    },
    { label: "Name", value: details.name },
    { label: "Phone", value: details.phone },
    { label: "Email", value: details.email },
    {
      label: "Time",
      value: scheduledFor
        ? formatTime(scheduledFor)
        : "As soon as the kitchen can",
    },
    ...(details.addressNotes
      ? [{ label: "For the driver", value: details.addressNotes }]
      : []),
  ];

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-salt-50">
        Ready to send it to the kitchen?
      </h2>
      <p className="mt-3 max-w-md text-salt-300">
        No card is taken and nothing is charged. Placing the order puts it
        straight on the pass.
      </p>

      <dl className="mt-8 max-w-xl overflow-hidden rounded-xl border border-oud-700 bg-oud-800">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={`grid grid-cols-[8rem_1fr] gap-4 px-5 py-3.5 ${
              index > 0 ? "sf-seam" : ""
            }`}
          >
            <dt className="sf-rail pt-0.5">{row.label}</dt>
            <dd className="text-salt-100">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button variant="ghost" onClick={onBack} disabled={pending}>
          Back
        </Button>
        <Button size="lg" onClick={onPlace} disabled={pending}>
          {pending ? "Sending it through…" : "Place the order"}
        </Button>
      </div>
    </div>
  );
}
