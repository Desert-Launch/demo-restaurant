"use client";

import { useId } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plate } from "@/features/menu";
import type { CartLine } from "@/types";
import { formatAedWithUnit } from "@/lib/utils";
import { useCartActions } from "../hooks/use-cart";

export function CartLineRow({ line }: { line: CartLine }) {
  const { setQuantity, setNote, remove } = useCartActions();
  const noteId = useId();

  return (
    <li className="sf-seam flex gap-4 py-4 first:border-t-0">
      <Plate course={line.course} className="mt-0.5 size-10" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-salt-50">{line.name}</p>
            <p className="tnum text-xs text-salt-400">
              {line.code} · {formatAedWithUnit(line.unitPriceFils)} each
            </p>
          </div>
          <p className="tnum shrink-0 text-salt-100">
            {formatAedWithUnit(line.unitPriceFils * line.quantity)}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center rounded-md border border-oud-600">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-r-none"
              onClick={() => setQuantity(line.lineId, line.quantity - 1)}
            >
              <Minus className="size-3.5" aria-hidden="true" />
              <span className="sr-only">One fewer {line.name}</span>
            </Button>
            <span
              aria-live="polite"
              className="tnum w-8 text-center text-sm text-salt-100"
            >
              {line.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-l-none"
              onClick={() => setQuantity(line.lineId, line.quantity + 1)}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              <span className="sr-only">One more {line.name}</span>
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-salt-400 hover:text-rumman-300"
            onClick={() => remove(line.lineId)}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Remove {line.name} from the order</span>
          </Button>
        </div>

        <label htmlFor={noteId} className="sr-only">
          A note for the kitchen about {line.name}
        </label>
        <Input
          id={noteId}
          value={line.note}
          onChange={(event) => setNote(line.lineId, event.target.value)}
          placeholder="Note for the kitchen"
          className="mt-2 h-8 text-xs"
        />
      </div>
    </li>
  );
}
