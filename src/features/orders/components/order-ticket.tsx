"use client";

import { Bike, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
import {
  cn,
  formatAedWithUnit,
  formatElapsed,
  formatTime,
  minutesSince,
} from "@/lib/utils";
import { ORDER_STATUS_META } from "../status";

/**
 * A ticket on the pass. Set like the printed kind: reference and clock at the
 * top, a rule, then the lines. The elapsed time turns pomegranate once a
 * ticket has been sitting too long for its stage.
 */
export function OrderTicket({
  order,
  now,
  onOpen,
  onAdvance,
  advancing,
}: {
  order: Order;
  now: Date;
  onOpen: () => void;
  onAdvance: () => void;
  advancing: boolean;
}) {
  const meta = ORDER_STATUS_META[order.status];
  const waiting = minutesSince(order.placedAt, now);
  const late = order.status !== "completed" && order.status !== "cancelled" && waiting > 40;
  const TypeIcon = order.type === "delivery" ? Bike : ShoppingBag;

  return (
    <article className="rounded-lg border border-oud-700 bg-oud-850">
      <button
        type="button"
        onClick={onOpen}
        className="w-full rounded-t-lg px-4 pt-3 pb-2 text-left transition-colors hover:bg-oud-800"
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="tnum text-sm text-salt-50">{order.reference}</span>
          <span
            className={cn(
              "tnum text-xs",
              late ? "text-rumman-300" : "text-salt-400",
            )}
          >
            {formatElapsed(waiting)}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-salt-400">
          <TypeIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{order.customer.name}</span>
          {order.scheduledFor ? (
            <span className="tnum shrink-0 text-saffron-300">
              for {formatTime(order.scheduledFor)}
            </span>
          ) : null}
        </div>

        <ul className="sf-perf mt-3 space-y-0.5 pt-2 text-xs">
          {order.lines.map((line) => (
            <li key={line.id} className="flex gap-2 text-salt-200">
              <span className="tnum shrink-0 text-salt-400">
                {line.quantity}×
              </span>
              <span className="min-w-0 flex-1 truncate">{line.name}</span>
            </li>
          ))}
        </ul>

        {order.lines.some((line) => line.note) || order.staffNote ? (
          <p className="mt-2 text-2xs text-saffron-300">
            {order.staffNote ||
              order.lines.find((line) => line.note)?.note}
          </p>
        ) : null}

        <p className="tnum mt-3 text-xs text-salt-300">
          {formatAedWithUnit(order.totalFils)}
        </p>
        <span className="sr-only">Open order {order.reference}</span>
      </button>

      {meta.next && meta.advanceLabel ? (
        <div className="px-3 pb-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onAdvance}
            disabled={advancing}
          >
            {meta.advanceLabel}
            <span className="sr-only"> — order {order.reference}</span>
          </Button>
        </div>
      ) : null}
    </article>
  );
}
