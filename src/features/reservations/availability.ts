import { addMinutes, isSameDay, startOfDay } from "date-fns";

import { SERVICES } from "@/lib/house";
import {
  SLOT_MINUTES,
  TABLE_STOCK,
  type Reservation,
  type ReservationStatus,
  type ServiceId,
} from "@/types";

/**
 * Availability is derived, never stored.
 *
 * A reservation records only a party size and a seating time. Which table it
 * occupies — and therefore whether the next party can be seated — is worked
 * out here, from the reservations already in the book and the room's fixed
 * table stock. Nothing writes an occupancy figure anywhere.
 *
 * The room's simplification: a table is held for the slot it is booked into,
 * not for a rolling dwell window. That is what the spec asks for and it keeps
 * "why is 20:00 full?" answerable by pointing at one list.
 */

/** Statuses that still hold a table. Cancelled and no-show give it back. */
const OCCUPYING: readonly ReservationStatus[] = ["booked", "seated", "completed"];

export const TOTAL_TABLES = TABLE_STOCK.reduce(
  (sum, table) => sum + table.count,
  0,
);

export const TOTAL_COVERS = TABLE_STOCK.reduce(
  (sum, table) => sum + table.count * table.seats,
  0,
);

/** How much notice the kitchen wants before a booking starts. */
export const BOOKING_LEAD_MINUTES = 45;

export interface TableUsage {
  seats: number;
  label: string;
  total: number;
  taken: number;
}

export interface SlotOccupancy {
  /** ISO timestamp of the seating time. */
  startsAt: string;
  service: ServiceId;
  usage: TableUsage[];
  tablesTaken: number;
  coversBooked: number;
  /** False once the slot is too close to now to book. */
  bookable: boolean;
}

/** Every seating time a day offers, across both services. */
export function slotsForDay(
  day: Date,
): { startsAt: Date; service: ServiceId }[] {
  const base = startOfDay(day);
  const slots: { startsAt: Date; service: ServiceId }[] = [];

  for (const service of SERVICES) {
    for (
      let minutes = service.opensAt;
      minutes <= service.lastSeating;
      minutes += SLOT_MINUTES
    ) {
      slots.push({ startsAt: addMinutes(base, minutes), service: service.id });
    }
  }

  return slots;
}

/**
 * Seat a list of parties against the room's table stock, smallest table that
 * fits first. Returns how many of each class ended up taken.
 *
 * A party that finds nothing its own size or larger spills upward until it
 * runs out of room; anything left after that is over capacity, which only
 * happens for hand-seeded data, never for a booking made through the flow.
 */
function seatParties(partySizes: readonly number[]): Map<number, number> {
  const taken = new Map<number, number>(
    TABLE_STOCK.map((table) => [table.seats, 0]),
  );

  // Largest parties first: they have the fewest tables that will hold them.
  const queue = [...partySizes].sort((a, b) => b - a);

  for (const size of queue) {
    const table = TABLE_STOCK.find(
      (candidate) =>
        candidate.seats >= size && (taken.get(candidate.seats) ?? 0) < candidate.count,
    );
    if (table) taken.set(table.seats, (taken.get(table.seats) ?? 0) + 1);
  }

  return taken;
}

export function buildDayOccupancy(
  reservations: readonly Reservation[],
  day: Date,
  now: Date,
): SlotOccupancy[] {
  const onTheDay = reservations.filter(
    (reservation) =>
      OCCUPYING.includes(reservation.status) &&
      isSameDay(new Date(reservation.seatingAt), day),
  );

  return slotsForDay(day).map(({ startsAt, service }) => {
    const inSlot = onTheDay.filter(
      (reservation) =>
        new Date(reservation.seatingAt).getTime() === startsAt.getTime(),
    );

    const taken = seatParties(inSlot.map((reservation) => reservation.partySize));

    return {
      startsAt: startsAt.toISOString(),
      service,
      usage: TABLE_STOCK.map((table) => ({
        seats: table.seats,
        label: table.label,
        total: table.count,
        taken: taken.get(table.seats) ?? 0,
      })),
      tablesTaken: inSlot.length,
      coversBooked: inSlot.reduce(
        (sum, reservation) => sum + reservation.partySize,
        0,
      ),
      bookable:
        startsAt.getTime() - now.getTime() >= BOOKING_LEAD_MINUTES * 60_000,
    };
  });
}

/** The tables in a slot that could hold this party, free and total. */
export function fitFor(
  slot: SlotOccupancy,
  partySize: number,
): { free: number; total: number } {
  return slot.usage
    .filter((table) => table.seats >= partySize)
    .reduce(
      (acc, table) => ({
        free: acc.free + (table.total - table.taken),
        total: acc.total + table.total,
      }),
      { free: 0, total: 0 },
    );
}

export function canSeat(slot: SlotOccupancy, partySize: number): boolean {
  return slot.bookable && fitFor(slot, partySize).free > 0;
}

/** Covers seated across a whole day, for the admin's service chart. */
export function coversByService(
  reservations: readonly Reservation[],
  day: Date,
): Record<ServiceId, number> {
  const totals: Record<ServiceId, number> = { lunch: 0, dinner: 0 };

  for (const reservation of reservations) {
    if (!OCCUPYING.includes(reservation.status)) continue;
    if (!isSameDay(new Date(reservation.seatingAt), day)) continue;
    totals[reservation.service] += reservation.partySize;
  }

  return totals;
}
