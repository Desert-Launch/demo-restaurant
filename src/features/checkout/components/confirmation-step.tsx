"use client";

import Link from "next/link";
import { addMinutes } from "date-fns";

import { Khatim } from "@/components/layout/wordmark";
import { Button } from "@/components/ui/button";
import { estimateReadyMinutes } from "@/features/orders";
import type { Order } from "@/types";
import { formatAedWithUnit, formatTime } from "@/lib/utils";

export function ConfirmationStep({ order }: { order: Order }) {
  const minutes = estimateReadyMinutes(order);
  const eta = addMinutes(
    new Date(order.scheduledFor ?? order.placedAt),
    order.scheduledFor ? 0 : minutes,
  );
  const verb = order.type === "delivery" ? "With you" : "Ready";

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="sf-mashrabiya pointer-events-none absolute -top-16 -right-10 size-72 opacity-40 [mask-image:radial-gradient(closest-side,#000,transparent)]"
      />

      <div className="relative">
        <Khatim className="size-8 text-saffron-500" />
        <h2 className="mt-6 font-display text-4xl font-semibold text-salt-50">
          It is on the pass
        </h2>
        <p className="mt-3 max-w-md text-salt-300">
          The kitchen has it. Nothing was charged and no email was sent, because
          this is a demo.
        </p>

        <div className="mt-8 max-w-md rounded-xl border border-saffron-800 bg-saffron-950/60 p-6">
          <p className="sf-rail">Order number</p>
          <p className="tnum mt-2 text-4xl font-semibold text-saffron-300">
            {order.reference}
          </p>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-salt-400">{verb} around</dt>
              <dd className="tnum text-salt-100">{formatTime(eta)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-salt-400">
                {order.type === "delivery" ? "Going to" : "Collect from"}
              </dt>
              <dd className="max-w-56 text-right text-salt-100">
                {order.customer.address
                  ? `${order.customer.address.line1}, ${order.customer.address.area}`
                  : "The courtyard door, Al Fahidi"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-salt-400">Total</dt>
              <dd className="tnum text-salt-100">
                {formatAedWithUnit(order.totalFils)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/menu">Order something else</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to the home page</Link>
          </Button>
        </div>

        <p className="mt-8 text-xs text-salt-600">
          This ticket is now at the top of the New column in{" "}
          <Link
            href="/admin/orders"
            className="rounded-sm underline underline-offset-4 hover:text-salt-400"
          >
            /admin/orders
          </Link>{" "}
          — that is the loop worth showing.
        </p>
      </div>
    </div>
  );
}
