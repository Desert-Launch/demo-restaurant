"use client";

import { useEffect, useId, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { computeTotals } from "@/lib/pricing";
import { Plate } from "@/features/menu";
import type { Order, OrderLine } from "@/types";
import {
  cn,
  formatAedWithUnit,
  formatDayTime,
  formatTime,
} from "@/lib/utils";
import {
  useUpdateOrderLines,
  useUpdateOrderNote,
  useUpdateOrderStatus,
} from "../hooks/use-orders";
import { ORDER_STATUS_META, ORDER_TYPE_LABELS } from "../status";

export function OrderDetailSheet({
  order,
  onOpenChange,
  onCancel,
}: {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
  onCancel: (order: Order) => void;
}) {
  const noteId = useId();
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [note, setNote] = useState("");

  // The sheet is reused for every ticket, so its draft state has to be refilled
  // whenever a different order is opened.
  useEffect(() => {
    if (!order) return;
    setLines(order.lines);
    setNote(order.staffNote);
  }, [order]);

  const saveLines = useUpdateOrderLines();
  const saveNote = useUpdateOrderNote();
  const advance = useUpdateOrderStatus();

  if (!order) return null;

  const meta = ORDER_STATUS_META[order.status];
  const nextStatus = meta.next;
  const totals = computeTotals(lines, order.type);
  const linesChanged =
    JSON.stringify(lines.map((line) => [line.id, line.quantity])) !==
    JSON.stringify(order.lines.map((line) => [line.id, line.quantity]));

  function setQuantity(id: string, quantity: number) {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) =>
            line.id === id ? { ...line, quantity } : line,
          ),
    );
  }

  return (
    <Sheet open onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="tnum font-display text-2xl">
            {order.reference}
          </SheetTitle>
          <SheetDescription>
            {ORDER_TYPE_LABELS[order.type]} ·{" "}
            {order.channel === "phone" ? "Taken by phone" : "Ordered online"} ·
            placed {formatDayTime(order.placedAt)}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-sm border px-2 py-0.5 text-2xs uppercase",
                meta.className,
              )}
            >
              {meta.label}
            </span>
            {order.scheduledFor ? (
              <span className="tnum text-xs text-saffron-300">
                Wanted for {formatTime(order.scheduledFor)}
              </span>
            ) : null}
          </div>

          <section>
            <h3 className="sf-rail">Guest</h3>
            <div className="mt-2 space-y-0.5 text-sm">
              <p className="text-salt-100">{order.customer.name}</p>
              <p className="tnum text-salt-400">{order.customer.phone}</p>
              <p className="text-salt-400">{order.customer.email}</p>
              {order.customer.address ? (
                <p className="pt-2 text-salt-300">
                  {order.customer.address.line1}, {order.customer.address.area},{" "}
                  {order.customer.address.city}
                  {order.customer.address.notes ? (
                    <span className="mt-1 block text-salt-400">
                      {order.customer.address.notes}
                    </span>
                  ) : null}
                </p>
              ) : null}
            </div>
          </section>

          <section>
            <h3 className="sf-rail">Lines</h3>
            <ul className="mt-2">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="sf-seam flex items-center gap-3 py-3 first:border-t-0"
                >
                  <Plate course={line.course} className="size-8" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-salt-100">{line.name}</p>
                    {line.note ? (
                      <p className="text-xs text-saffron-300">{line.note}</p>
                    ) : null}
                  </div>
                  <div className="flex items-center rounded-md border border-oud-600">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-r-none"
                      onClick={() => setQuantity(line.id, line.quantity - 1)}
                    >
                      <Minus className="size-3" aria-hidden="true" />
                      <span className="sr-only">One fewer {line.name}</span>
                    </Button>
                    <span className="tnum w-7 text-center text-xs text-salt-100">
                      {line.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 rounded-l-none"
                      onClick={() => setQuantity(line.id, line.quantity + 1)}
                    >
                      <Plus className="size-3" aria-hidden="true" />
                      <span className="sr-only">One more {line.name}</span>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-salt-400 hover:text-rumman-300"
                    onClick={() => setQuantity(line.id, 0)}
                  >
                    <Trash2 className="size-3" aria-hidden="true" />
                    <span className="sr-only">Take {line.name} off</span>
                  </Button>
                </li>
              ))}
            </ul>

            {linesChanged ? (
              <Button
                size="sm"
                className="mt-3"
                disabled={saveLines.isPending || lines.length === 0}
                onClick={() =>
                  saveLines.mutate(
                    { id: order.id, lines },
                    {
                      onSuccess: () => toast.success("Ticket updated"),
                      onError: (error) =>
                        toast.error("That did not save", {
                          description: error.message,
                        }),
                    },
                  )
                }
              >
                {saveLines.isPending ? "Saving…" : "Save the lines"}
              </Button>
            ) : null}
          </section>

          <section>
            <h3 className="sf-rail">Money</h3>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-salt-400">Subtotal</dt>
                <dd className="tnum text-salt-100">
                  {formatAedWithUnit(totals.subtotalFils)}
                </dd>
              </div>
              {order.type === "delivery" ? (
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
                <dd className="tnum text-saffron-300">
                  {formatAedWithUnit(totals.totalFils)}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <label htmlFor={noteId} className="sf-rail">
              Note for the pass
            </label>
            <Textarea
              id={noteId}
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2"
            />
            {note !== order.staffNote ? (
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                disabled={saveNote.isPending}
                onClick={() =>
                  saveNote.mutate(
                    { id: order.id, staffNote: note },
                    { onSuccess: () => toast.success("Note saved") },
                  )
                }
              >
                {saveNote.isPending ? "Saving…" : "Save the note"}
              </Button>
            ) : null}
          </section>

          {order.cancellationReason ? (
            <section>
              <h3 className="sf-rail">Cancelled because</h3>
              <p className="mt-2 text-sm text-rumman-300">
                {order.cancellationReason}
              </p>
            </section>
          ) : null}
        </div>

        <SheetFooter className="gap-2 border-t border-oud-700 sm:flex-row">
          {nextStatus && meta.advanceLabel ? (
            <Button
              className="flex-1"
              disabled={advance.isPending}
              onClick={() =>
                advance.mutate({ id: order.id, status: nextStatus })
              }
            >
              {meta.advanceLabel}
            </Button>
          ) : null}
          {order.status !== "cancelled" && order.status !== "completed" ? (
            <Button
              variant="outline"
              className="flex-1 text-rumman-300"
              onClick={() => onCancel(order)}
            >
              Cancel the order
            </Button>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
