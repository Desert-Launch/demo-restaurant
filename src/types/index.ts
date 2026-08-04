/**
 * Cross-feature domain types.
 *
 * Money is stored as an integer number of fils (1 AED = 100 fils) everywhere in
 * the app. Formatting to "AED 84.00" happens only at the edge, in `formatAed`.
 */

/* --- Menu ----------------------------------------------------------------- */

export const MENU_COURSES = [
  "mezze",
  "starters",
  "grills",
  "mains",
  "desserts",
  "drinks",
] as const;
export type MenuCourse = (typeof MENU_COURSES)[number];

export const DISH_TAGS = [
  "signature",
  "vegetarian",
  "vegan",
  "spicy",
  "contains-nuts",
  "gluten-free",
] as const;
export type DishTag = (typeof DISH_TAGS)[number];

export interface MenuItem {
  id: string;
  /** Kitchen code printed on the ticket and the menu card, e.g. "MZ-04". */
  code: string;
  name: string;
  /** The dish as it is written on the Arabic side of the card. */
  arabicName: string;
  description: string;
  course: MenuCourse;
  priceFils: number;
  /**
   * Dietary and kitchen flags. "signature" lives here rather than in its own
   * boolean so a dish's badges have exactly one source of truth.
   */
  tags: DishTag[];
  /** False means 86'd — off tonight. The public menu shows it, greyed. */
  available: boolean;
  createdAt: string;
}

/* --- Reservations --------------------------------------------------------- */

export const RESERVATION_STATUSES = [
  "booked",
  "seated",
  "completed",
  "cancelled",
  "no-show",
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const OCCASIONS = [
  "none",
  "birthday",
  "anniversary",
  "business",
  "other",
] as const;
export type Occasion = (typeof OCCASIONS)[number];

export interface ReservationGuest {
  name: string;
  phone: string;
  email: string;
}

export interface Reservation {
  id: string;
  /** What the guest is given at the end of the flow, e.g. "SO-4821". */
  reference: string;
  guest: ReservationGuest;
  partySize: number;
  /** ISO timestamp of the slot the party is seated in. */
  seatingAt: string;
  service: ServiceId;
  status: ReservationStatus;
  occasion: Occasion;
  specialRequests: string;
  staffNote: string;
  createdAt: string;
  seatedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export type ServiceId = "lunch" | "dinner";

/**
 * What the room actually holds. Availability is derived from this and the
 * reservations already in the store — never stored alongside them.
 */
export interface TableClass {
  /** Covers the table seats. */
  seats: number;
  count: number;
  label: string;
}

/**
 * Eleven tables, forty covers — the courtyard room as the About page describes
 * it. Kept small on purpose: a party of six has two tables in the whole house
 * that will hold them, so the booking rail has something real to say.
 */
export const TABLE_STOCK: readonly TableClass[] = [
  { seats: 2, count: 5, label: "Two-top" },
  { seats: 4, count: 4, label: "Four-top" },
  { seats: 6, count: 1, label: "Six-top" },
  { seats: 8, count: 1, label: "The long table" },
];

/** Largest party the room can take without a call to the manager. */
export const MAX_PARTY_SIZE = 8;

/** Reservations are taken on the half hour. */
export const SLOT_MINUTES = 30;

/** How far ahead the public booking rail runs. */
export const BOOKING_HORIZON_DAYS = 14;

/* --- Orders --------------------------------------------------------------- */

export const ORDER_STATUSES = [
  "new",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Columns on the pass board, in service order. */
export const ORDER_BOARD_STATUSES = [
  "new",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const satisfies readonly OrderStatus[];

export type OrderType = "pickup" | "delivery";
export type OrderChannel = "online" | "phone";

export interface OrderLine {
  id: string;
  menuItemId: string;
  code: string;
  name: string;
  course: MenuCourse;
  quantity: number;
  unitPriceFils: number;
  note: string;
}

export interface DeliveryAddress {
  line1: string;
  area: string;
  city: string;
  notes: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string;
  address: DeliveryAddress | null;
}

export interface Order {
  id: string;
  /** Human reference on the ticket and the confirmation screen, e.g. "SO-3184". */
  reference: string;
  type: OrderType;
  channel: OrderChannel;
  status: OrderStatus;
  lines: OrderLine[];
  customer: OrderCustomer;
  subtotalFils: number;
  vatFils: number;
  deliveryFeeFils: number;
  totalFils: number;
  placedAt: string;
  /** null means "as soon as the kitchen can". */
  scheduledFor: string | null;
  readyAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string;
  staffNote: string;
}

export interface OrderTotals {
  subtotalFils: number;
  vatFils: number;
  deliveryFeeFils: number;
  totalFils: number;
}

/** A line in the client-side cart. Lives in Zustand, never in the store. */
export interface CartLine {
  lineId: string;
  menuItemId: string;
  code: string;
  name: string;
  course: MenuCourse;
  unitPriceFils: number;
  quantity: number;
  note: string;
}

/* --- Staff ---------------------------------------------------------------- */

/** The demo's fake staff identity, held in Zustand. Nothing is authenticated. */
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  initials: string;
}

/* --- Money ---------------------------------------------------------------- */

export const VAT_RATE = 0.05;
export const DELIVERY_FEE_FILS = 1500;
