"use client";

import { Button } from "@/components/ui/button";
import { HOUSE } from "@/lib/house";
import { formatCovers, formatTime, formatWeekday } from "@/lib/utils";
import { OCCASION_LABELS } from "../status";
import type { GuestDetailsValues } from "../schema";

export function ReviewStep({
  partySize,
  seatingAt,
  guest,
  pending,
  onBack,
  onConfirm,
}: {
  partySize: number;
  seatingAt: string;
  guest: GuestDetailsValues;
  pending: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const rows = [
    { label: "Party", value: formatCovers(partySize) },
    { label: "Day", value: formatWeekday(seatingAt) },
    { label: "Seating", value: formatTime(seatingAt) },
    { label: "Name", value: guest.name },
    { label: "Phone", value: guest.phone },
    { label: "Email", value: guest.email },
    ...(guest.occasion !== "none"
      ? [{ label: "Occasion", value: OCCASION_LABELS[guest.occasion] }]
      : []),
    ...(guest.specialRequests
      ? [{ label: "Requests", value: guest.specialRequests }]
      : []),
  ];

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-salt-50">
        Have we got this right?
      </h2>
      <p className="mt-3 max-w-md text-salt-300">
        Nothing is charged and no card is taken. Confirm and the table is yours.
      </p>

      <dl className="mt-8 max-w-xl overflow-hidden rounded-xl border border-oud-700 bg-oud-800">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={`grid grid-cols-[7.5rem_1fr] gap-4 px-5 py-3.5 ${
              index > 0 ? "sf-seam" : ""
            }`}
          >
            <dt className="sf-rail pt-0.5">{row.label}</dt>
            <dd className="text-salt-100">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 max-w-xl text-sm text-salt-400">
        We hold the table for fifteen minutes. If plans change, call{" "}
        <span className="tnum">{HOUSE.phone}</span>.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button variant="ghost" onClick={onBack} disabled={pending}>
          Back
        </Button>
        <Button size="lg" onClick={onConfirm} disabled={pending}>
          {pending ? "Booking the table…" : "Confirm the booking"}
        </Button>
      </div>
    </div>
  );
}
