import { isSameDay, startOfDay } from "date-fns";

import { selectMenu, selectOrders, selectReservations } from "@/lib/store";
import { sleep } from "@/lib/utils";
import { slotsForDay } from "@/features/reservations";
import type { Order, Reservation, ServiceId } from "@/types";

const LATENCY_MS = 140;

export interface CoversPoint {
  /** "19:30" */
  time: string;
  covers: number;
  service: ServiceId;
}

export interface DashboardSummary {
  coversToday: number;
  reservationsToday: number;
  seatedNow: number;
  ordersToday: number;
  openOrders: number;
  revenueTodayFils: number;
  averageSpendFils: number;
  dishesOffTonight: number;
  coversBySlot: CoversPoint[];
  upcoming: Reservation[];
  liveOrders: Order[];
}

/** Statuses that count as a table actually taken. */
const HELD: Reservation["status"][] = ["booked", "seated", "completed"];

/** Tickets still moving through the kitchen. */
const OPEN: Order["status"][] = ["new", "preparing", "ready"];

export async function fetchDashboard(): Promise<DashboardSummary> {
  await sleep(LATENCY_MS);

  const now = new Date();
  const today = startOfDay(now);

  const reservations = selectReservations();
  const orders = selectOrders();
  const menu = selectMenu();

  const todaysReservations = reservations.filter(
    (reservation) =>
      HELD.includes(reservation.status) &&
      isSameDay(new Date(reservation.seatingAt), today),
  );

  const todaysOrders = orders.filter(
    (order) =>
      order.status !== "cancelled" && isSameDay(new Date(order.placedAt), today),
  );

  const revenueTodayFils = todaysOrders.reduce(
    (sum, order) => sum + order.totalFils,
    0,
  );

  // Covers per seating time, split by service — the shape of the day rather
  // than one number for lunch and one for dinner.
  const coversBySlot: CoversPoint[] = slotsForDay(today).map(
    ({ startsAt, service }) => ({
      time: startsAt.toTimeString().slice(0, 5),
      service,
      covers: todaysReservations
        .filter(
          (reservation) =>
            new Date(reservation.seatingAt).getTime() === startsAt.getTime(),
        )
        .reduce((sum, reservation) => sum + reservation.partySize, 0),
    }),
  );

  const upcoming = todaysReservations
    .filter(
      (reservation) =>
        reservation.status === "booked" &&
        new Date(reservation.seatingAt) >= now,
    )
    .sort(
      (a, b) =>
        new Date(a.seatingAt).getTime() - new Date(b.seatingAt).getTime(),
    )
    .slice(0, 6);

  const liveOrders = orders
    .filter((order) => OPEN.includes(order.status))
    .sort(
      (a, b) => new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime(),
    )
    .slice(0, 6);

  return {
    coversToday: todaysReservations.reduce(
      (sum, reservation) => sum + reservation.partySize,
      0,
    ),
    reservationsToday: todaysReservations.length,
    seatedNow: todaysReservations.filter(
      (reservation) => reservation.status === "seated",
    ).length,
    ordersToday: todaysOrders.length,
    openOrders: orders.filter((order) => OPEN.includes(order.status)).length,
    revenueTodayFils,
    averageSpendFils:
      todaysOrders.length === 0
        ? 0
        : Math.round(revenueTodayFils / todaysOrders.length),
    dishesOffTonight: menu.filter((item) => !item.available).length,
    coversBySlot,
    upcoming,
    liveOrders,
  };
}

export type { ServiceId };
