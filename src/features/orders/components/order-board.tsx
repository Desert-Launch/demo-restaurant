"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { isSameDay } from "date-fns";
import { PhoneCall } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNow } from "@/lib/hooks/use-now";
import { ORDER_BOARD_STATUSES, type Order, type OrderStatus } from "@/types";
import { cn, pluralize } from "@/lib/utils";
import { useOrders, useUpdateOrderStatus } from "../hooks/use-orders";
import { ORDER_STATUS_META } from "../status";
import { CancelOrderDialog } from "./cancel-order-dialog";
import { OrderDetailSheet } from "./order-detail-sheet";
import { OrderTicket } from "./order-ticket";
import { PhoneOrderDialog } from "./phone-order-dialog";

export function OrderBoard() {
  // Ticks so the elapsed time on every ticket stays honest.
  const now = useNow(30_000);
  const { data: orders, isPending, isError, error, refetch } = useOrders();

  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<Order | null>(null);
  const [phoneOpen, setPhoneOpen] = useState(false);

  const advance = useUpdateOrderStatus();
  const reduced = useReducedMotion();

  const columns = useMemo(() => {
    const today = (orders ?? []).filter(
      (order) => !now || isSameDay(new Date(order.placedAt), now),
    );

    return ORDER_BOARD_STATUSES.map((status) => ({
      status,
      orders: today
        .filter((order) => order.status === status)
        .sort(
          (a, b) =>
            new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
        ),
    }));
  }, [orders, now]);

  // Read the open ticket back out of the list so the sheet reflects every edit.
  const openOrder =
    (orders ?? []).find((order) => order.id === openOrderId) ?? null;

  if (isError) {
    return (
      <EmptyState
        title="The board did not load"
        description={error.message}
        action={
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  const loading = isPending || !now;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-salt-300">
          Everything that came in today. Move a ticket with the button on it, or
          open it to change quantities, leave a note or cancel.
        </p>
        <Button onClick={() => setPhoneOpen(true)}>
          <PhoneCall aria-hidden="true" /> Take a phone order
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {columns.map((column) => {
          const meta = ORDER_STATUS_META[column.status];

          return (
            <section
              key={column.status}
              aria-labelledby={`column-${column.status}`}
              className="rounded-lg border border-oud-700 bg-oud-900/60 p-3"
            >
              <div className="flex items-center gap-2 px-1 pb-3">
                <span
                  aria-hidden="true"
                  className={cn("size-2 rounded-full", meta.columnClassName)}
                />
                <h2
                  id={`column-${column.status}`}
                  className="sf-rail text-salt-200"
                >
                  {meta.label}
                </h2>
                <span className="tnum ml-auto text-xs text-salt-400">
                  {column.orders.length}
                </span>
              </div>

              {loading ? (
                <div className="space-y-3" aria-hidden="true">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={index} className="h-40 rounded-lg" />
                  ))}
                </div>
              ) : column.orders.length === 0 ? (
                <p className="px-1 py-6 text-center text-xs text-salt-400">
                  {emptyLine(column.status)}
                </p>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {column.orders.map((order) => (
                      <motion.li
                        key={order.id}
                        layout={!reduced}
                        initial={reduced ? false : { opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduced ? undefined : { opacity: 0, scale: 0.97 }}
                        transition={{ duration: reduced ? 0 : 0.22 }}
                      >
                        <OrderTicket
                          order={order}
                          now={now}
                          advancing={advance.isPending}
                          onOpen={() => setOpenOrderId(order.id)}
                          onAdvance={() => {
                            const next = ORDER_STATUS_META[order.status].next;
                            if (!next) return;
                            advance.mutate(
                              { id: order.id, status: next },
                              {
                                onError: (mutationError) =>
                                  toast.error("That did not stick", {
                                    description: mutationError.message,
                                  }),
                              },
                            );
                          }}
                        />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <p aria-live="polite" className="text-sm text-salt-400">
        {columns.reduce((sum, column) => sum + column.orders.length, 0)}{" "}
        {pluralize(
          columns.reduce((sum, column) => sum + column.orders.length, 0),
          "ticket",
          "tickets",
        )}{" "}
        today.
      </p>

      <OrderDetailSheet
        order={openOrder}
        onOpenChange={(open) => !open && setOpenOrderId(null)}
        onCancel={(order) => {
          setOpenOrderId(null);
          setCancelling(order);
        }}
      />

      <CancelOrderDialog
        order={cancelling}
        onOpenChange={(open) => !open && setCancelling(null)}
      />

      <PhoneOrderDialog open={phoneOpen} onOpenChange={setPhoneOpen} />
    </div>
  );
}

/** Empty columns say what that means rather than "no orders". */
function emptyLine(status: OrderStatus): string {
  switch (status) {
    case "new":
      return "Nothing waiting to be started.";
    case "preparing":
      return "Nothing on the stove.";
    case "ready":
      return "Nothing waiting to go out.";
    case "completed":
      return "Nothing finished yet today.";
    default:
      return "Nothing cancelled today.";
  }
}
