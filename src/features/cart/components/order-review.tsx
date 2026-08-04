"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatAedWithUnit, pluralize } from "@/lib/utils";
import { useCart, useCartActions } from "../hooks/use-cart";
import { CartLineRow } from "./cart-line-row";

/**
 * The order on its own page. The header sheet is fine on a laptop, but editing
 * quantities and notes on a phone wants the full width.
 */
export function OrderReview() {
  const { lines, itemCount, isEmpty, totals } = useCart("pickup");
  const { clear } = useCartActions();

  if (isEmpty) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-6" aria-hidden="true" />}
        title="Nothing in your order yet"
        description="Everything on the card can be collected or delivered. Start with the mezze."
        action={
          <Button asChild>
            <Link href="/menu">Open the menu</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      <div>
        <p className="text-sm text-salt-400">
          {itemCount} {pluralize(itemCount, "dish", "dishes")} from the card.
        </p>
        <ul className="mt-4">
          {lines.map((line) => (
            <CartLineRow key={line.lineId} line={line} />
          ))}
        </ul>
        <Button
          variant="ghost"
          className="mt-6 text-salt-400"
          onClick={() => clear()}
        >
          Empty the order
        </Button>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-oud-700 bg-oud-800 p-6">
          <h2 className="sf-rail">Running total</h2>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-salt-400">Subtotal</dt>
              <dd className="tnum text-salt-100">
                {formatAedWithUnit(totals.subtotalFils)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-salt-400">VAT (5%)</dt>
              <dd className="tnum text-salt-100">
                {formatAedWithUnit(totals.vatFils)}
              </dd>
            </div>
            <div className="sf-seam flex justify-between pt-3">
              <dt className="text-salt-100">Total</dt>
              <dd className="tnum text-xl text-saffron-300">
                {formatAedWithUnit(totals.totalFils)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-salt-400">
            Collection is free. Delivery adds AED 15 and is chosen at checkout.
          </p>
          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/checkout">Go to checkout</Link>
          </Button>
          <Button asChild variant="outline" className="mt-2 w-full">
            <Link href="/menu">Add something else</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
