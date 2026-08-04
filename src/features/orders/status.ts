import type { OrderStatus } from "@/types";

export interface OrderStatusMeta {
  label: string;
  /** What the kitchen is about to do, used on the advance button. */
  advanceLabel?: string;
  next?: OrderStatus;
  className: string;
  columnClassName: string;
}

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  new: {
    label: "New",
    advanceLabel: "Start it",
    next: "preparing",
    className: "border-steel-700 bg-steel-950 text-steel-300",
    columnClassName: "bg-steel-500",
  },
  preparing: {
    label: "Preparing",
    advanceLabel: "Mark ready",
    next: "ready",
    className: "border-saffron-800 bg-saffron-950 text-saffron-300",
    columnClassName: "bg-saffron-500",
  },
  ready: {
    label: "Ready",
    advanceLabel: "Hand it over",
    next: "completed",
    className: "border-mint-700 bg-mint-950 text-mint-300",
    columnClassName: "bg-mint-500",
  },
  completed: {
    label: "Completed",
    className: "border-oud-600 bg-oud-850 text-salt-300",
    columnClassName: "bg-salt-600",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-rumman-700 bg-rumman-950 text-rumman-300",
    columnClassName: "bg-rumman-500",
  },
};

export const ORDER_TYPE_LABELS = {
  pickup: "Pickup",
  delivery: "Delivery",
} as const;
