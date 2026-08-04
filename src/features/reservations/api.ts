import type {
  Occasion,
  Reservation,
  ReservationGuest,
  ReservationStatus,
  ServiceId,
} from "@/types";
import {
  insertReservation,
  newId,
  nextReference,
  patchReservation,
  removeReservation,
  selectReservation,
  selectReservations,
  stampsForReservationStatus,
} from "@/lib/store";
import { sleep } from "@/lib/utils";
import { buildDayOccupancy, canSeat, type SlotOccupancy } from "./availability";

const LATENCY_MS = 120;

/**
 * Cancelling reaches the guest's card in the real product, so it is the one
 * call in this demo that is allowed to fail. The table advances optimistically
 * and rolls back with an error toast when this fires.
 */
export const CANCEL_FAILURE_RATE = 0.1;

export interface BookReservationInput {
  guest: ReservationGuest;
  partySize: number;
  /** ISO timestamp of the seating time. */
  seatingAt: string;
  occasion: Occasion;
  specialRequests: string;
  staffNote?: string;
  status?: ReservationStatus;
}

export function serviceForTime(seatingAt: string | Date): ServiceId {
  return new Date(seatingAt).getHours() < 16 ? "lunch" : "dinner";
}

export async function fetchReservations(): Promise<Reservation[]> {
  await sleep(LATENCY_MS);
  return selectReservations();
}

export async function fetchReservation(id: string): Promise<Reservation> {
  await sleep(LATENCY_MS);
  const reservation = selectReservation(id);
  if (!reservation) throw new Error("That booking is no longer in the book.");
  return reservation;
}

/** Occupancy for one day, derived from the book rather than read from it. */
export async function fetchDayOccupancy(
  dayIso: string,
): Promise<SlotOccupancy[]> {
  await sleep(LATENCY_MS);
  return buildDayOccupancy(selectReservations(), new Date(dayIso), new Date());
}

export async function bookReservation(
  input: BookReservationInput,
): Promise<Reservation> {
  await sleep(LATENCY_MS * 2);

  // The slot is re-checked here rather than trusted from the client, the same
  // way a real endpoint would: someone else may have taken the last table
  // while this guest was filling in their name.
  const day = new Date(input.seatingAt);
  const occupancy = buildDayOccupancy(selectReservations(), day, new Date());
  const slot = occupancy.find(
    (entry) => new Date(entry.startsAt).getTime() === day.getTime(),
  );

  if (!slot) {
    throw new Error("We do not seat at that time. Pick another slot.");
  }
  if (!canSeat(slot, input.partySize)) {
    throw new Error(
      "That slot filled up while you were booking. Pick another time and we will hold it.",
    );
  }

  const now = new Date();
  const status = input.status ?? "booked";

  return insertReservation({
    id: newId(),
    reference: nextReference(),
    guest: input.guest,
    partySize: input.partySize,
    seatingAt: input.seatingAt,
    service: serviceForTime(input.seatingAt),
    status,
    occasion: input.occasion,
    specialRequests: input.specialRequests,
    staffNote: input.staffNote ?? "",
    createdAt: now.toISOString(),
    ...stampsForReservationStatus(status, now),
  });
}

export interface UpdateReservationInput {
  guest: ReservationGuest;
  partySize: number;
  seatingAt: string;
  occasion: Occasion;
  specialRequests: string;
  staffNote: string;
  status: ReservationStatus;
}

export async function updateReservation(
  id: string,
  input: UpdateReservationInput,
): Promise<Reservation> {
  await sleep(LATENCY_MS);
  const current = selectReservation(id);
  if (!current) throw new Error("That booking is no longer in the book.");

  const statusChanged = current.status !== input.status;

  return patchReservation(id, {
    ...input,
    service: serviceForTime(input.seatingAt),
    ...(statusChanged
      ? stampsForReservationStatus(input.status, new Date())
      : {}),
  });
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<Reservation> {
  await sleep(LATENCY_MS);
  return patchReservation(id, {
    status,
    ...stampsForReservationStatus(status, new Date()),
  });
}

export async function deleteReservation(id: string): Promise<void> {
  await sleep(LATENCY_MS);
  removeReservation(id);
}

export async function cancelReservation(
  id: string,
  reason: string,
): Promise<Reservation> {
  await sleep(LATENCY_MS * 2);

  if (Math.random() < CANCEL_FAILURE_RATE) {
    throw new Error(
      "The guest's card could not be released, so the booking is still live. Try cancelling again.",
    );
  }

  return patchReservation(id, {
    status: "cancelled",
    staffNote: reason,
    ...stampsForReservationStatus("cancelled", new Date()),
  });
}
