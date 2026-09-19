/**
 * The house facts — address, hours, contact, service times.
 *
 * One place so the footer, the contact page, the reservation rail and the
 * order slots can never drift apart. Everything here is fictional: the phone
 * number sits in the 555 reserved range and nothing is dialled, sent or
 * charged anywhere.
 */

export const HOUSE = {
  name: "Demo Restaurant",
  tagline: "Levantine and Emirati dining",
  /** Deliberately a placeholder — no real address, no map embed. */
  address: {
    line1: "1 Demo Street",
    line2: "Demo District",
    city: "Dubai, United Arab Emirates",
  },
  // Deliberately undialable: a demo must never ring a real line.
  phone: "+971 4 555 0xxx",
  email: "hello@example.com",
  /** Where the room actually is, in words rather than on a map. */
  directions:
    "Off the courtyard behind the old houses, five minutes from the metro. Valet on the corner after 18:00.",
} as const;

export interface ServiceWindow {
  id: "lunch" | "dinner";
  label: string;
  /** Minutes from midnight. */
  opensAt: number;
  lastSeating: number;
  note: string;
}

/** The two services the kitchen runs. Reservation slots are generated from these. */
export const SERVICES: readonly ServiceWindow[] = [
  {
    id: "lunch",
    label: "Lunch",
    opensAt: 12 * 60,
    lastSeating: 15 * 60,
    note: "Mezze and grills, daily",
  },
  {
    id: "dinner",
    label: "Dinner",
    opensAt: 18 * 60 + 30,
    lastSeating: 22 * 60 + 30,
    note: "Full menu, oud after ten",
  },
];

export const OPENING_HOURS = [
  { days: "Sunday to Wednesday", hours: "12:00 – 15:30 · 18:30 – 23:30" },
  { days: "Thursday to Saturday", hours: "12:00 – 15:30 · 18:30 – 00:30" },
  { days: "Kitchen closes", hours: "45 minutes before the room does" },
] as const;

/** Areas the kitchen delivers to. Used by the checkout address step. */
// Generic on purpose — a demo's delivery map should not read as a real one.
export const DELIVERY_AREAS = [
  "Demo District 1",
  "Demo District 2",
  "Demo District 3",
  "Demo District 4",
  "Demo District 5",
  "Demo District 6",
  "Demo District 7",
  "Demo District 8",
] as const;

export type DeliveryArea = (typeof DELIVERY_AREAS)[number];
