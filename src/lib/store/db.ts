/**
 * The demo "backend".
 *
 * A module-level singleton holding the menu, the reservation book and the
 * order board. No React, no framework imports, no persistence — the data
 * re-seeds whenever the module is evaluated fresh (a hard refresh), and every
 * add / edit / delete survives for the rest of the browser session.
 *
 * Nothing outside `src/lib/store` and the feature `api.ts` files may import
 * this module. UI reaches it through: component → feature hook → api.ts → store.
 *
 * Reads return structured clones, so nothing outside can mutate state by
 * holding on to a reference.
 */

import type {
  MenuItem,
  Order,
  OrderStatus,
  Reservation,
  ReservationStatus,
} from "@/types";
import { createSeedMenu, createSeedOrders, createSeedReservations } from "./seed";

interface Database {
  menu: MenuItem[];
  reservations: Reservation[];
  orders: Order[];
  /** Bumped per write so references stay sequential and unique in a session. */
  nextReference: number;
}

function createDatabase(): Database {
  const now = new Date();
  const menu = createSeedMenu(now);

  return {
    menu,
    reservations: createSeedReservations(now),
    orders: createSeedOrders(menu, now),
    nextReference: 5200,
  };
}

let db: Database = createDatabase();

/** Wired to the reset control in the admin sidebar footer. */
export function resetStore(): void {
  db = createDatabase();
}

export function newId(): string {
  return crypto.randomUUID();
}

/**
 * One counter behind both books. A guest's reservation code and an order
 * number are both "SO-nnnn", and they can never collide.
 */
export function nextReference(): string {
  const reference = `SO-${db.nextReference}`;
  db.nextReference += 1;
  return reference;
}

/* --- Menu ----------------------------------------------------------------- */

export function selectMenu(): MenuItem[] {
  return db.menu.map((item) => structuredClone(item));
}

export function selectMenuItem(id: string): MenuItem | undefined {
  const found = db.menu.find((item) => item.id === id);
  return found ? structuredClone(found) : undefined;
}

export function insertMenuItem(item: MenuItem): MenuItem {
  db.menu = [item, ...db.menu];
  return structuredClone(item);
}

export function patchMenuItem(
  id: string,
  changes: Partial<Omit<MenuItem, "id" | "createdAt">>,
): MenuItem {
  const index = db.menu.findIndex((item) => item.id === id);
  if (index === -1) throw new Error(`No menu item with id ${id}`);

  const updated: MenuItem = { ...db.menu[index], ...changes };
  db.menu = db.menu.map((item, i) => (i === index ? updated : item));
  return structuredClone(updated);
}

export function removeMenuItem(id: string): void {
  const exists = db.menu.some((item) => item.id === id);
  if (!exists) throw new Error(`No menu item with id ${id}`);
  db.menu = db.menu.filter((item) => item.id !== id);
}

/* --- Reservations --------------------------------------------------------- */

export function selectReservations(): Reservation[] {
  return db.reservations.map((reservation) => structuredClone(reservation));
}

export function selectReservation(id: string): Reservation | undefined {
  const found = db.reservations.find((reservation) => reservation.id === id);
  return found ? structuredClone(found) : undefined;
}

export function insertReservation(reservation: Reservation): Reservation {
  db.reservations = [reservation, ...db.reservations];
  return structuredClone(reservation);
}

export function patchReservation(
  id: string,
  changes: Partial<Reservation>,
): Reservation {
  const index = db.reservations.findIndex(
    (reservation) => reservation.id === id,
  );
  if (index === -1) throw new Error(`No reservation with id ${id}`);

  const updated: Reservation = { ...db.reservations[index], ...changes };
  db.reservations = db.reservations.map((reservation, i) =>
    i === index ? updated : reservation,
  );
  return structuredClone(updated);
}

export function removeReservation(id: string): void {
  const exists = db.reservations.some((reservation) => reservation.id === id);
  if (!exists) throw new Error(`No reservation with id ${id}`);
  db.reservations = db.reservations.filter(
    (reservation) => reservation.id !== id,
  );
}

/** Timestamps that must be stamped whenever a reservation's status changes. */
export function stampsForReservationStatus(
  status: ReservationStatus,
  at: Date,
): Pick<Reservation, "seatedAt" | "completedAt" | "cancelledAt"> {
  const iso = at.toISOString();
  return {
    seatedAt: status === "seated" || status === "completed" ? iso : null,
    completedAt: status === "completed" ? iso : null,
    cancelledAt: status === "cancelled" || status === "no-show" ? iso : null,
  };
}

/* --- Orders --------------------------------------------------------------- */

export function selectOrders(): Order[] {
  return db.orders.map((order) => structuredClone(order));
}

export function selectOrder(id: string): Order | undefined {
  const found = db.orders.find((order) => order.id === id);
  return found ? structuredClone(found) : undefined;
}

export function insertOrder(order: Order): Order {
  db.orders = [order, ...db.orders];
  return structuredClone(order);
}

export function patchOrder(id: string, changes: Partial<Order>): Order {
  const index = db.orders.findIndex((order) => order.id === id);
  if (index === -1) throw new Error(`No order with id ${id}`);

  const updated: Order = { ...db.orders[index], ...changes };
  db.orders = db.orders.map((order, i) => (i === index ? updated : order));
  return structuredClone(updated);
}

/** Timestamps that must be stamped whenever an order's status changes. */
export function stampsForOrderStatus(
  status: OrderStatus,
  at: Date,
): Pick<Order, "readyAt" | "completedAt" | "cancelledAt"> {
  const iso = at.toISOString();
  return {
    readyAt: status === "ready" || status === "completed" ? iso : null,
    completedAt: status === "completed" ? iso : null,
    cancelledAt: status === "cancelled" ? iso : null,
  };
}
