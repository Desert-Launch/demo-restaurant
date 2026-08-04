import type {
  CartLine,
  Order,
  OrderChannel,
  OrderCustomer,
  OrderLine,
  OrderStatus,
  OrderType,
} from "@/types";
import { computeTotals } from "@/lib/pricing";
import {
  insertOrder,
  newId,
  nextReference,
  patchOrder,
  selectOrder,
  selectOrders,
  stampsForOrderStatus,
} from "@/lib/store";
import { sleep } from "@/lib/utils";

const LATENCY_MS = 120;

/**
 * Cancelling refunds a card in the real product, so it is the one call on the
 * order board allowed to fail. The ticket moves to Cancelled optimistically
 * and rolls back with an error toast when this fires. Raise it to 1 to demo
 * the rollback on purpose.
 */
export const CANCEL_FAILURE_RATE = 0.1;

export interface PlaceOrderInput {
  type: OrderType;
  channel: OrderChannel;
  customer: OrderCustomer;
  lines: readonly CartLine[];
  /** null means "as soon as the kitchen can". */
  scheduledFor: string | null;
  staffNote?: string;
}

function toOrderLines(lines: readonly CartLine[]): OrderLine[] {
  return lines.map((line) => ({
    id: newId(),
    menuItemId: line.menuItemId,
    code: line.code,
    name: line.name,
    course: line.course,
    quantity: line.quantity,
    unitPriceFils: line.unitPriceFils,
    note: line.note,
  }));
}

export async function fetchOrders(): Promise<Order[]> {
  await sleep(LATENCY_MS);
  return selectOrders();
}

export async function fetchOrder(id: string): Promise<Order> {
  await sleep(LATENCY_MS);
  const order = selectOrder(id);
  if (!order) throw new Error("That order is no longer on the board.");
  return order;
}

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  await sleep(LATENCY_MS * 2);

  if (input.lines.length === 0) {
    throw new Error("There is nothing in the order yet.");
  }

  const lines = toOrderLines(input.lines);
  const totals = computeTotals(lines, input.type);

  return insertOrder({
    id: newId(),
    reference: nextReference(),
    type: input.type,
    channel: input.channel,
    status: "new",
    lines,
    customer: input.customer,
    ...totals,
    placedAt: new Date().toISOString(),
    scheduledFor: input.scheduledFor,
    readyAt: null,
    completedAt: null,
    cancelledAt: null,
    cancellationReason: "",
    staffNote: input.staffNote ?? "",
  });
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  await sleep(LATENCY_MS);
  return patchOrder(id, { status, ...stampsForOrderStatus(status, new Date()) });
}

export async function updateOrderLines(
  id: string,
  lines: OrderLine[],
): Promise<Order> {
  await sleep(LATENCY_MS);
  const current = selectOrder(id);
  if (!current) throw new Error("That order is no longer on the board.");
  return patchOrder(id, { lines, ...computeTotals(lines, current.type) });
}

export async function updateOrderNote(
  id: string,
  staffNote: string,
): Promise<Order> {
  await sleep(LATENCY_MS);
  return patchOrder(id, { staffNote });
}

export async function cancelOrder(id: string, reason: string): Promise<Order> {
  await sleep(LATENCY_MS * 2);

  if (Math.random() < CANCEL_FAILURE_RATE) {
    throw new Error(
      "The card refund did not go through. The order is still open — try cancelling again.",
    );
  }

  return patchOrder(id, {
    status: "cancelled",
    cancellationReason: reason,
    ...stampsForOrderStatus("cancelled", new Date()),
  });
}

/** Roughly how long the kitchen needs, used for the confirmation ETA. */
export function estimateReadyMinutes(order: Order): number {
  const dishes = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  // Grills and rice are the slow parts of the card, so they carry the estimate.
  const slow = order.lines
    .filter((line) => line.course === "grills" || line.course === "mains")
    .reduce((sum, line) => sum + line.quantity, 0);

  const base = order.type === "delivery" ? 35 : 20;
  return base + Math.min(25, dishes * 2 + slow * 3);
}
