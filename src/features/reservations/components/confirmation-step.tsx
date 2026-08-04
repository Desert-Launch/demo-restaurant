"use client";

import Link from "next/link";

import { Khatim } from "@/components/layout/wordmark";
import { Button } from "@/components/ui/button";
import { HOUSE } from "@/lib/house";
import { formatCovers, formatTime, formatWeekday } from "@/lib/utils";
import type { Reservation } from "@/types";

export function ConfirmationStep({
  reservation,
  onBookAnother,
}: {
  reservation: Reservation;
  onBookAnother: () => void;
}) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="sf-mashrabiya pointer-events-none absolute -top-16 -right-10 size-72 opacity-40 [mask-image:radial-gradient(closest-side,#000,transparent)]"
      />

      <div className="relative">
        <Khatim className="size-8 text-saffron-500" />
        <h2 className="mt-6 font-display text-4xl font-semibold text-salt-50">
          The table is yours
        </h2>
        <p className="mt-3 max-w-md text-salt-300">
          We have sent nothing to your inbox, because this is a demo. In the
          real thing the confirmation would be there already.
        </p>

        <div className="mt-8 max-w-md rounded-xl border border-saffron-800 bg-saffron-950/60 p-6">
          <p className="sf-rail">Your reference</p>
          <p className="tnum mt-2 text-4xl font-semibold text-saffron-300">
            {reservation.reference}
          </p>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-salt-400">Day</dt>
              <dd className="text-salt-100">
                {formatWeekday(reservation.seatingAt)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-salt-400">Seating</dt>
              <dd className="tnum text-salt-100">
                {formatTime(reservation.seatingAt)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-salt-400">Party</dt>
              <dd className="text-salt-100">
                {formatCovers(reservation.partySize)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-salt-400">Name</dt>
              <dd className="text-salt-100">{reservation.guest.name}</dd>
            </div>
          </dl>
        </div>

        <p className="mt-6 max-w-md text-sm text-salt-400">
          {HOUSE.directions} Call <span className="tnum">{HOUSE.phone}</span> if
          anything changes.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/menu">Read the card before you come</Link>
          </Button>
          <Button variant="outline" onClick={onBookAnother}>
            Book another table
          </Button>
        </div>

        <p className="mt-8 text-xs text-salt-400">
          This booking is now in the staff view at{" "}
          <Link
            href="/admin/reservations"
            className="rounded-sm underline underline-offset-4 hover:text-salt-400"
          >
            /admin/reservations
          </Link>{" "}
          — that is the loop worth showing.
        </p>
      </div>
    </div>
  );
}
