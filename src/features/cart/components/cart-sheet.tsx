"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatAedWithUnit, pluralize } from "@/lib/utils";
import { useCart, useCartActions } from "../hooks/use-cart";
import { CartLineRow } from "./cart-line-row";

/** The header button and the panel behind it. Totals here assume pickup —
 *  the delivery fee is added once the guest chooses delivery at checkout. */
export function CartSheet() {
  const [open, setOpen] = useState(false);
  const { lines, itemCount, isEmpty, totals } = useCart("pickup");
  const { clear } = useCartActions();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative gap-2">
          <ShoppingBag className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Your order</span>
          <span className="tnum rounded-pill bg-saffron-500 px-1.5 text-2xs text-oud-950">
            {itemCount}
          </span>
          <span className="sr-only">
            {itemCount} {pluralize(itemCount, "dish", "dishes")} in your order
          </span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Your order</SheetTitle>
          <SheetDescription>
            {isEmpty
              ? "Nothing in it yet."
              : `${itemCount} ${pluralize(itemCount, "dish", "dishes")} from the card.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {isEmpty ? (
            <EmptyState
              className="mt-6"
              icon={<ShoppingBag className="size-6" aria-hidden="true" />}
              title="Your order is empty"
              description="Add something from the card and it will show up here."
              action={
                <SheetClose asChild>
                  <Button asChild variant="outline">
                    <Link href="/menu">Open the menu</Link>
                  </Button>
                </SheetClose>
              }
            />
          ) : (
            <ul>
              {lines.map((line) => (
                <CartLineRow key={line.lineId} line={line} />
              ))}
            </ul>
          )}
        </div>

        {!isEmpty ? (
          <SheetFooter className="gap-3 border-t border-oud-700">
            <dl className="space-y-1.5 text-sm">
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
              <div className="sf-seam flex justify-between pt-2">
                <dt className="text-salt-100">Total</dt>
                <dd className="tnum text-lg text-saffron-300">
                  {formatAedWithUnit(totals.totalFils)}
                </dd>
              </div>
            </dl>
            <p className="text-xs text-salt-400">
              Delivery is AED 15 and is added once you choose it at checkout.
            </p>
            <SheetClose asChild>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Go to checkout</Link>
              </Button>
            </SheetClose>
            <Button
              variant="ghost"
              className="w-full text-salt-400"
              onClick={() => clear()}
            >
              Empty the order
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
