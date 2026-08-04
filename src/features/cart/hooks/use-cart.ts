"use client";

import { useShallow } from "zustand/react/shallow";

import { computeTotals } from "@/lib/pricing";
import type { OrderType } from "@/types";
import { useCartStore } from "../store";

/** Read-only view of the cart, plus the totals for a given fulfilment type. */
export function useCart(type: OrderType = "pickup") {
  const lines = useCartStore((state) => state.lines);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    lines,
    itemCount,
    isEmpty: lines.length === 0,
    totals: computeTotals(lines, type),
  };
}

/** The cart's write surface, stable across renders. */
export function useCartActions() {
  return useCartStore(
    useShallow((state) => ({
      add: state.add,
      setQuantity: state.setQuantity,
      setNote: state.setNote,
      remove: state.remove,
      clear: state.clear,
    })),
  );
}

/** Just the badge number, so the navbar does not re-render on note edits. */
export function useCartCount(): number {
  return useCartStore((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  );
}
