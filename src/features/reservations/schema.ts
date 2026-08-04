import { z } from "zod";

import { PHONE_PATTERN } from "@/lib/patterns";
import { MAX_PARTY_SIZE, OCCASIONS, RESERVATION_STATUSES } from "@/types";

/** Step 3 of the booking flow: who the table is for. */
export const guestDetailsSchema = z.object({
  name: z.string().trim().min(2, "We need a name for the table."),
  phone: z
    .string()
    .trim()
    .regex(
      PHONE_PATTERN,
      "Use a number we can reach you on, like +971 50 123 4567.",
    ),
  email: z.email("That email address does not look right."),
  occasion: z.enum(OCCASIONS),
  specialRequests: z
    .string()
    .trim()
    .max(400, "Keep it under 400 characters — you can tell us the rest at the table."),
});

export type GuestDetailsValues = z.infer<typeof guestDetailsSchema>;

export const GUEST_DETAILS_DEFAULTS: GuestDetailsValues = {
  name: "",
  phone: "",
  email: "",
  occasion: "none",
  specialRequests: "",
};

/** The admin's create / edit form, which can also set a status and a note. */
export const reservationFormSchema = guestDetailsSchema.extend({
  partySize: z
    .number()
    .int()
    .min(1, "A table is for at least one person.")
    .max(MAX_PARTY_SIZE, `Parties over ${MAX_PARTY_SIZE} are arranged by phone.`),
  /** "2026-08-04" */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date."),
  /** "19:30" */
  time: z.string().regex(/^\d{2}:\d{2}$/, "Pick a seating time."),
  status: z.enum(RESERVATION_STATUSES),
  staffNote: z.string().trim().max(400, "Keep the note under 400 characters."),
});

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;

export const cancelReservationSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(4, "Say why in a few words — it shows on the booking.")
    .max(160, "Keep it under 160 characters."),
});

export type CancelReservationValues = z.infer<typeof cancelReservationSchema>;
