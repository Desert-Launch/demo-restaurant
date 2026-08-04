"use client";

import type { CartLine, OrderTotals, OrderType } from "@/types";
import { formatAedWithUnit } from "@/lib/utils";
import { Plate } from "@/features/menu";

export function OrderSummary({
  lines,
  totals,
  type,
}: {
  lines: readonly CartLine[];
  totals: OrderTotals;
  type: OrderType;
}) {
  return (
    <div className="rounded-xl border border-oud-700 bg-oud-800 p-5">
      <h2 className="sf-rail">Your order</h2>

      <ul className="mt-4">
        {lines.map((line) => (
          <li key={line.lineId} className="sf-seam flex gap-3 py-3 first:border-t-0">
            <Plate course={line.course} className="mt-0.5 size-8" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-salt-100">
                <span className="tnum text-salt-400">{line.quantity}×</span>{" "}
                {line.name}
              </p>
              {line.note ? (
                <p className="mt-0.5 text-xs text-salt-400">{line.note}</p>
              ) : null}
            </div>
            <p className="tnum shrink-0 text-sm text-salt-100">
              {formatAedWithUnit(line.unitPriceFils * line.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="sf-seam mt-4 space-y-1.5 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-salt-400">Subtotal</dt>
          <dd className="tnum text-salt-100">
            {formatAedWithUnit(totals.subtotalFils)}
          </dd>
        </div>
        {type === "delivery" ? (
          <div className="flex justify-between">
            <dt className="text-salt-400">Delivery</dt>
            <dd className="tnum text-salt-100">
              {formatAedWithUnit(totals.deliveryFeeFils)}
            </dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-salt-400">VAT (5%)</dt>
          <dd className="tnum text-salt-100">
            {formatAedWithUnit(totals.vatFils)}
          </dd>
        </div>
        <div className="sf-seam flex justify-between pt-2">
          <dt className="text-salt-100">Total</dt>
          <dd className="tnum text-lg text-saffron-300">
            {formatAedWithUnit(totals.totalFils)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
