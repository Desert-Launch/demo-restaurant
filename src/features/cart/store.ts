"use client";

import { create } from "zustand";

import type { CartLine, MenuItem } from "@/types";

/**
 * The cart is client selection state, not domain data — it lives in Zustand and
 * never touches `lib/store`. It becomes an `Order` only when checkout writes it
 * through `features/orders/api.ts`, and it is cleared on success.
 *
 * Ids are minted here rather than through the store's `newId` so this file has
 * no reason to import the data layer at all.
 */
interface CartState {
  lines: CartLine[];
  add: (item: MenuItem, quantity?: number) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  setNote: (lineId: string, note: string) => void;
  remove: (lineId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  lines: [],

  add: (item, quantity = 1) =>
    set((state) => {
      // Ordering the same dish twice bumps the quantity rather than opening a
      // second line — a per-dish note is edited on the one line.
      const existing = state.lines.find((line) => line.menuItemId === item.id);
      if (existing) {
        return {
          lines: state.lines.map((line) =>
            line.lineId === existing.lineId
              ? { ...line, quantity: Math.min(30, line.quantity + quantity) }
              : line,
          ),
        };
      }

      const line: CartLine = {
        lineId: crypto.randomUUID(),
        menuItemId: item.id,
        code: item.code,
        name: item.name,
        course: item.course,
        unitPriceFils: item.priceFils,
        quantity,
        note: "",
      };

      return { lines: [...state.lines, line] };
    }),

  setQuantity: (lineId, quantity) =>
    set((state) => ({
      lines:
        quantity <= 0
          ? state.lines.filter((line) => line.lineId !== lineId)
          : state.lines.map((line) =>
              line.lineId === lineId
                ? { ...line, quantity: Math.min(30, quantity) }
                : line,
            ),
    })),

  setNote: (lineId, note) =>
    set((state) => ({
      lines: state.lines.map((line) =>
        line.lineId === lineId ? { ...line, note } : line,
      ),
    })),

  remove: (lineId) =>
    set((state) => ({
      lines: state.lines.filter((line) => line.lineId !== lineId),
    })),

  clear: () => set({ lines: [] }),
}));
