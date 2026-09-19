/**
 * The demo's content.
 *
 * Everything here is hand-written rather than randomly generated, so the room
 * looks the same every time the demo is shown. Statuses are the one exception:
 * they are resolved against the clock at seed time, so the board reads
 * correctly whether it is opened at eleven in the morning or ten at night.
 *
 * Nothing in this file is real. The restaurant, the guests, the phone numbers
 * (all in the reserved 555 range) and the addresses are invented.
 */

import { addDays, addMinutes, startOfDay, subDays, subMinutes } from "date-fns";

import { computeTotals } from "@/lib/pricing";
import type {
  DishTag,
  MenuCourse,
  MenuItem,
  Occasion,
  Order,
  OrderLine,
  OrderStatus,
  OrderType,
  Reservation,
  ReservationStatus,
  ServiceId,
} from "@/types";

/* --- Menu ----------------------------------------------------------------- */

interface DishSeed {
  code: string;
  name: string;
  arabicName: string;
  description: string;
  course: MenuCourse;
  priceAed: number;
  tags: DishTag[];
}

const DISHES: readonly DishSeed[] = [
  // Mezze — the table fills up before anything else arrives.
  {
    code: "MZ-01",
    name: "Hummus bil awarma",
    arabicName: "حمص بالقورمة",
    description:
      "Chickpeas beaten with tahini and lemon, lamb confit and pine nuts spooned over the top.",
    course: "mezze",
    priceAed: 38,
    tags: ["signature", "contains-nuts"],
  },
  {
    code: "MZ-02",
    name: "Moutabal",
    arabicName: "متبل",
    description:
      "Aubergine burned whole over the coals, then whipped with tahini, yoghurt and pomegranate.",
    course: "mezze",
    priceAed: 34,
    tags: ["vegetarian", "gluten-free"],
  },
  {
    code: "MZ-03",
    name: "Warak enab",
    arabicName: "ورق عنب",
    description:
      "Vine leaves rolled around short-grain rice, tomato and mint, cooked down in lemon and oil.",
    course: "mezze",
    priceAed: 36,
    tags: ["vegan", "gluten-free"],
  },
  {
    code: "MZ-04",
    name: "Muhammara",
    arabicName: "محمرة",
    description:
      "Roasted red pepper and walnut, pomegranate molasses, Aleppo chilli. Eat it with the hot bread.",
    course: "mezze",
    priceAed: 38,
    tags: ["vegetarian", "spicy", "contains-nuts"],
  },
  {
    code: "MZ-05",
    name: "Labneh bil zaatar",
    arabicName: "لبنة بالزعتر",
    description:
      "Yoghurt hung overnight, wild thyme from the Chouf, a hard pour of olive oil.",
    course: "mezze",
    priceAed: 30,
    tags: ["vegetarian", "gluten-free"],
  },
  {
    code: "MZ-06",
    name: "Fattoush",
    arabicName: "فتوش",
    description:
      "Purslane, tomato and radish under sumac dressing, with khubz toasted in the saj until it shatters.",
    course: "mezze",
    priceAed: 34,
    tags: ["vegan"],
  },
  {
    code: "MZ-07",
    name: "Batata harra",
    arabicName: "بطاطا حارة",
    description:
      "Potatoes fried hard, then tossed through garlic, coriander, chilli and a lot of lemon.",
    course: "mezze",
    priceAed: 32,
    tags: ["vegan", "spicy", "gluten-free"],
  },
  {
    code: "MZ-08",
    name: "Kibbeh nayyeh",
    arabicName: "كبة نية",
    description:
      "Lamb pounded to a paste with fine burghul and mint. Made to order, served cold, gone quickly.",
    course: "mezze",
    priceAed: 62,
    tags: ["signature"],
  },

  // Starters — everything that comes out of the fryer or the saj.
  {
    code: "ST-01",
    name: "Sambousek lahm",
    arabicName: "سمبوسك لحم",
    description: "Pastry folded around minced lamb, onion and pine nuts.",
    course: "starters",
    priceAed: 36,
    tags: ["contains-nuts"],
  },
  {
    code: "ST-02",
    name: "Rakakat jibneh",
    arabicName: "رقاقات جبنة",
    description:
      "Akkawi cheese rolled thin and fried, rolled in nigella seed. Six to a plate.",
    course: "starters",
    priceAed: 34,
    tags: ["vegetarian"],
  },
  {
    code: "ST-03",
    name: "Manakish zaatar",
    arabicName: "مناقيش زعتر",
    description: "Wild thyme, sesame and oil, baked flat on the saj to order.",
    course: "starters",
    priceAed: 28,
    tags: ["vegan"],
  },
  {
    code: "ST-04",
    name: "Arayes kafta",
    arabicName: "عرايس كفتة",
    description:
      "Flatbread pressed around minced lamb and parsley, charred until the bread crisps and the fat runs in.",
    course: "starters",
    priceAed: 44,
    tags: ["signature"],
  },
  {
    code: "ST-05",
    name: "Chicken livers",
    arabicName: "كبد الدجاج",
    description:
      "Seared fast, finished with pomegranate molasses, garlic and coriander.",
    course: "starters",
    priceAed: 40,
    tags: ["spicy", "gluten-free"],
  },
  {
    code: "ST-06",
    name: "Soujouk balady",
    arabicName: "سجق بلدي",
    description: "Spiced beef sausage cooked in its own fat, lemon on the side.",
    course: "starters",
    priceAed: 42,
    tags: ["spicy", "gluten-free"],
  },

  // Grills — the charcoal is the loudest thing in the room.
  {
    code: "GR-01",
    name: "Lamb chops",
    arabicName: "ريش غنم",
    description:
      "A rack cut into four, seven spice, straight onto the coals. Ordered medium unless you say otherwise.",
    course: "grills",
    priceAed: 145,
    tags: ["signature", "gluten-free"],
  },
  {
    code: "GR-02",
    name: "Shish taouk",
    arabicName: "شيش طاووق",
    description:
      "Chicken thigh in garlic cream and lemon overnight, grilled, with pickled turnip.",
    course: "grills",
    priceAed: 78,
    tags: ["gluten-free"],
  },
  {
    code: "GR-03",
    name: "Kafta khashkhash",
    arabicName: "كفتة خشخاش",
    description:
      "Minced lamb worked with chilli and parsley, grilled, finished in tomato and butter.",
    course: "grills",
    priceAed: 82,
    tags: ["spicy", "gluten-free"],
  },
  {
    code: "GR-04",
    name: "Shish kebab",
    arabicName: "شيش كباب",
    description: "Beef fillet, onion and sumac, cooked over a hot corner.",
    course: "grills",
    priceAed: 96,
    tags: ["gluten-free"],
  },
  {
    code: "GR-05",
    name: "Mixed grill",
    arabicName: "مشاوي مشكلة",
    description:
      "Taouk, kafta, kebab and a lamb chop on one board. Built for two, finished by three.",
    course: "grills",
    priceAed: 175,
    tags: ["signature", "gluten-free"],
  },
  {
    code: "GR-06",
    name: "Samak hamour",
    arabicName: "سمك هامور",
    description:
      "Whole hammour in chermoula, grilled until the skin lifts, with burnt lemon.",
    course: "grills",
    priceAed: 130,
    tags: ["gluten-free"],
  },
  {
    code: "GR-07",
    name: "Grilled halloumi",
    arabicName: "حلوم مشوي",
    description: "Halloumi off the coals with watermelon, mint and black pepper.",
    course: "grills",
    priceAed: 48,
    tags: ["vegetarian", "gluten-free"],
  },

  // Mains — the pots, and the rice that takes an hour.
  {
    code: "MN-01",
    name: "Machboos laham",
    arabicName: "مجبوس لحم",
    description:
      "Emirati spiced rice cooked in the lamb stock, shoulder pulled through it, dried loomi on top.",
    course: "mains",
    priceAed: 118,
    tags: ["signature"],
  },
  {
    code: "MN-02",
    name: "Ouzi",
    arabicName: "أوزي",
    description:
      "Lamb cooked six hours, saffron rice, almonds and raisins, wrapped and opened at the table.",
    course: "mains",
    priceAed: 135,
    tags: ["contains-nuts"],
  },
  {
    code: "MN-03",
    name: "Freekeh djaj",
    arabicName: "فريكة دجاج",
    description:
      "Green wheat smoked in the field, cooked with chicken, cinnamon and toasted almond.",
    course: "mains",
    priceAed: 92,
    tags: ["contains-nuts"],
  },
  {
    code: "MN-04",
    name: "Fasolia bil lahm",
    arabicName: "فاصوليا باللحم",
    description:
      "White beans and lamb shank down to nothing in tomato and coriander. Vermicelli rice alongside.",
    course: "mains",
    priceAed: 88,
    tags: [],
  },
  {
    code: "MN-05",
    name: "Salona samak",
    arabicName: "صالونة سمك",
    description:
      "The Emirati stew: fish, tamarind, tomato and a real amount of chilli.",
    course: "mains",
    priceAed: 105,
    tags: ["spicy", "gluten-free"],
  },
  {
    code: "MN-06",
    name: "Maqluba khodar",
    arabicName: "مقلوبة خضار",
    description:
      "Aubergine, cauliflower and rice built in a pot and turned out upside down at the pass.",
    course: "mains",
    priceAed: 76,
    tags: ["vegan"],
  },

  // Desserts.
  {
    code: "DS-01",
    name: "Umm Ali",
    arabicName: "أم علي",
    description:
      "Pastry, milk and pistachio baked until the top blisters, clotted cream folded in.",
    course: "desserts",
    priceAed: 42,
    tags: ["signature", "vegetarian", "contains-nuts"],
  },
  {
    code: "DS-02",
    name: "Knafeh nabulsiyeh",
    arabicName: "كنافة نابلسية",
    description:
      "Akkawi under semolina, soaked in orange-blossom syrup, cut in front of you.",
    course: "desserts",
    priceAed: 46,
    tags: ["vegetarian", "contains-nuts"],
  },
  {
    code: "DS-03",
    name: "Muhallabia",
    arabicName: "مهلبية",
    description: "Cold milk pudding, rosewater, crushed pistachio.",
    course: "desserts",
    priceAed: 34,
    tags: ["vegetarian", "contains-nuts", "gluten-free"],
  },
  {
    code: "DS-04",
    name: "Luqaimat",
    arabicName: "لقيمات",
    description:
      "Dumplings fried to order, date syrup poured over them at the table, sesame.",
    course: "desserts",
    priceAed: 32,
    tags: ["vegetarian"],
  },
  {
    code: "DS-05",
    name: "Aish el saraya",
    arabicName: "عيش السرايا",
    description: "Caramelised bread under ashta and toasted almond.",
    course: "desserts",
    priceAed: 38,
    tags: ["vegetarian", "contains-nuts"],
  },

  // Drinks — no alcohol on this list.
  {
    code: "DR-01",
    name: "Qahwa arabiya",
    arabicName: "قهوة عربية",
    description: "Light roast with cardamom and saffron, poured with dates.",
    course: "drinks",
    priceAed: 22,
    tags: ["vegan", "gluten-free"],
  },
  {
    code: "DR-02",
    name: "Jallab",
    arabicName: "جلاب",
    description: "Date molasses and rosewater over crushed ice, pine nuts floated on top.",
    course: "drinks",
    priceAed: 26,
    tags: ["vegan", "contains-nuts"],
  },
  {
    code: "DR-03",
    name: "Laban ayran",
    arabicName: "لبن عيران",
    description: "Salted yoghurt and dried mint, served very cold.",
    course: "drinks",
    priceAed: 18,
    tags: ["vegetarian", "gluten-free"],
  },
  {
    code: "DR-04",
    name: "Limonana",
    arabicName: "ليمون بالنعناع",
    description: "Lemon and mint blended with ice until it goes pale green.",
    course: "drinks",
    priceAed: 24,
    tags: ["vegan", "gluten-free"],
  },
  {
    code: "DR-05",
    name: "Karak chai",
    arabicName: "كرك",
    description: "Boiled long with evaporated milk and cardamom. One size.",
    course: "drinks",
    priceAed: 16,
    tags: ["vegetarian"],
  },
  {
    code: "DR-06",
    name: "Tamr hindi",
    arabicName: "تمر هندي",
    description: "Tamarind steeped with lemon and cinnamon, not too sweet.",
    course: "drinks",
    priceAed: 24,
    tags: ["vegan", "gluten-free"],
  },
];

/** 86'd tonight. Shown on the public menu, greyed, so the toggle has something to undo. */
const UNAVAILABLE_CODES = new Set(["MZ-08", "GR-06"]);

function dishId(code: string): string {
  return `dish_${code.toLowerCase().replace("-", "_")}`;
}

export function createSeedMenu(now: Date): MenuItem[] {
  return DISHES.map((dish, index) => ({
    id: dishId(dish.code),
    code: dish.code,
    name: dish.name,
    arabicName: dish.arabicName,
    description: dish.description,
    course: dish.course,
    priceFils: dish.priceAed * 100,
    tags: [...dish.tags],
    available: !UNAVAILABLE_CODES.has(dish.code),
    // Spread the "added on" dates so the admin table has something to sort by.
    createdAt: subDays(now, 400 - index * 6).toISOString(),
  }));
}

/* --- Guests --------------------------------------------------------------- */

interface GuestSeed {
  name: string;
  phone: string;
}

function emailFor(name: string): string {
  return `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`;
}

const GUESTS = {
  mariam: { name: "Guest 1", phone: "+971 52 555 1xxx" },
  youssef: { name: "Guest 2", phone: "+971 54 555 2xxx" },
  aisha: { name: "Guest 3", phone: "+971 55 555 3xxx" },
  karim: { name: "Guest 4", phone: "+971 56 555 4xxx" },
  nadia: { name: "Guest 5", phone: "+971 50 555 5xxx" },
  omar: { name: "Guest 6", phone: "+971 52 555 6xxx" },
  layla: { name: "Guest 7", phone: "+971 54 555 7xxx" },
  hassan: { name: "Guest 8", phone: "+971 55 555 8xxx" },
  rana: { name: "Guest 9", phone: "+971 56 555 9xxx" },
  tariq: { name: "Guest 10", phone: "+971 50 555 0xxx" },
  dana: { name: "Guest 11", phone: "+971 52 555 1xxx" },
  fatima: { name: "Guest 12", phone: "+971 54 555 2xxx" },
  sami: { name: "Guest 13", phone: "+971 55 555 3xxx" },
  hind: { name: "Guest 14", phone: "+971 56 555 4xxx" },
  elias: { name: "Guest 15", phone: "+971 50 555 5xxx" },
  noura: { name: "Guest 16", phone: "+971 52 555 6xxx" },
  ziad: { name: "Guest 17", phone: "+971 54 555 7xxx" },
  amal: { name: "Guest 18", phone: "+971 55 555 8xxx" },
  faisal: { name: "Guest 19", phone: "+971 56 555 9xxx" },
  reem: { name: "Guest 20", phone: "+971 50 555 0xxx" },
  james: { name: "Guest 21", phone: "+971 52 555 1xxx" },
  priya: { name: "Guest 22", phone: "+971 54 555 2xxx" },
  elena: { name: "Guest 23", phone: "+971 55 555 3xxx" },
  daniel: { name: "Guest 24", phone: "+971 56 555 4xxx" },
  mei: { name: "Guest 25", phone: "+971 50 555 5xxx" },
  sofia: { name: "Guest 26", phone: "+971 52 555 6xxx" },
  aditya: { name: "Guest 27", phone: "+971 54 555 7xxx" },
  grace: { name: "Guest 28", phone: "+971 55 555 8xxx" },
  rashid: { name: "Guest 29", phone: "+971 56 555 9xxx" },
  yara: { name: "Guest 30", phone: "+971 50 555 0xxx" },
} as const satisfies Record<string, GuestSeed>;

type GuestKey = keyof typeof GUESTS;

/* --- Reservations --------------------------------------------------------- */

/**
 * The book, as terse tuples: [day offset, time, party size, guest, extras?].
 *
 * Written out slot by slot rather than generated, and deliberately concentrated
 * where a restaurant actually fills: dinner between half past seven and nine.
 * Tomorrow at 20:00 takes every one of the eleven tables, so the booking rail
 * has a genuinely full slot to show, and today at 20:00 leaves exactly one
 * two-top — which means a couple can still book it and a party of three
 * cannot. Those two slots are the demo.
 */
interface ReservationExtras {
  occasion?: Occasion;
  requests?: string;
  staffNote?: string;
  /** Overrides the clock-derived status, for the rows worth showing on purpose. */
  force?: ReservationStatus;
}

type ReservationRow = readonly [
  day: number,
  time: string,
  partySize: number,
  guest: GuestKey,
  extras?: ReservationExtras,
];

const RESERVATIONS: readonly ReservationRow[] = [
  // --- Today, lunch. Steady rather than busy. ---
  [0, "12:00", 2, "priya"],
  [0, "12:00", 4, "rashid", { requests: "A table away from the grill if there is one." }],
  [0, "12:30", 6, "daniel", { occasion: "business", staffNote: "Regular. Splits the bill four ways." }],
  [0, "12:30", 2, "mei"],
  [0, "13:00", 3, "amal", { force: "no-show", staffNote: "Second no-show this month. Card on file next time." }],
  [0, "13:00", 4, "james"],
  [0, "13:30", 2, "sofia", { requests: "One of us is coeliac — no bread at the table please." }],
  [0, "14:00", 5, "hind"],
  [0, "14:30", 2, "aditya"],
  [0, "14:30", 4, "elena"],

  // --- Today, dinner. 19:30 and 20:00 are the crush. ---
  [0, "18:30", 2, "mariam", { occasion: "anniversary", requests: "A quiet corner if you have one." }],
  [0, "18:30", 4, "youssef"],
  [0, "18:30", 2, "grace"],

  [0, "19:00", 6, "aisha", { occasion: "birthday", requests: "Bringing a cake — can it go in the fridge until after?" }],
  [0, "19:00", 2, "karim"],
  [0, "19:00", 4, "nadia"],
  [0, "19:00", 2, "yara"],
  [0, "19:00", 4, "ziad"],

  [0, "19:30", 2, "omar", { force: "cancelled", staffNote: "Cancelled the morning of. Nothing owed." }],
  [0, "19:30", 8, "layla", { occasion: "business", staffNote: "Wants the long table. Confirmed by phone." }],
  [0, "19:30", 4, "hassan"],
  [0, "19:30", 2, "rana"],
  [0, "19:30", 6, "tariq", { requests: "No nuts anywhere near the table — severe allergy." }],
  [0, "19:30", 2, "dana"],
  [0, "19:30", 4, "fatima"],
  [0, "19:30", 2, "sami"],
  [0, "19:30", 4, "elias"],

  // 20:00 — ten of eleven tables, and the only one left is a two-top.
  [0, "20:00", 8, "noura", { occasion: "business" }],
  [0, "20:00", 6, "faisal"],
  [0, "20:00", 4, "reem"],
  [0, "20:00", 4, "james"],
  [0, "20:00", 4, "elena"],
  [0, "20:00", 4, "sofia"],
  [0, "20:00", 2, "aditya"],
  [0, "20:00", 2, "mei"],
  [0, "20:00", 2, "daniel"],
  [0, "20:00", 2, "priya"],

  [0, "20:30", 4, "rashid"],
  [0, "20:30", 2, "mariam"],
  [0, "20:30", 6, "youssef"],
  [0, "20:30", 2, "grace"],
  [0, "20:30", 4, "karim"],

  [0, "21:00", 2, "nadia"],
  [0, "21:00", 4, "yara"],
  [0, "21:00", 2, "ziad"],

  [0, "21:30", 2, "hassan"],
  [0, "21:30", 4, "rana"],

  [0, "22:00", 2, "tariq"],

  // --- Tomorrow. Lunch is light; 20:00 is the slot that has gone. ---
  [1, "12:30", 4, "elena"],
  [1, "13:00", 2, "aditya"],
  [1, "13:30", 6, "daniel", { occasion: "business" }],
  [1, "14:00", 2, "mei"],
  [1, "14:30", 4, "james"],

  [1, "19:00", 6, "ziad", { occasion: "anniversary" }],
  [1, "19:00", 2, "faisal"],
  [1, "19:00", 4, "reem"],

  // 20:00 — every table in the house. Nothing bookable at any party size.
  [1, "20:00", 8, "hassan", { occasion: "business", staffNote: "Long table. Set for eight, may be nine." }],
  [1, "20:00", 6, "mariam"],
  [1, "20:00", 4, "grace"],
  [1, "20:00", 4, "yara"],
  [1, "20:00", 4, "sofia"],
  [1, "20:00", 4, "priya"],
  [1, "20:00", 2, "dana"],
  [1, "20:00", 2, "sami"],
  [1, "20:00", 2, "elias"],
  [1, "20:00", 2, "noura"],
  [1, "20:00", 2, "amal"],

  [1, "21:00", 4, "james"],
  [1, "21:00", 2, "rashid"],
  [1, "21:30", 2, "fatima"],
  [1, "21:30", 4, "layla"],

  // --- The days after, thinning out. ---
  [2, "19:30", 2, "sofia", { occasion: "anniversary" }],
  [2, "19:30", 4, "rashid"],
  [2, "20:00", 6, "tariq", { occasion: "birthday" }],
  [2, "20:00", 2, "dana"],
  [2, "20:30", 5, "hind"],

  [3, "13:00", 3, "priya"],
  [3, "19:30", 2, "mariam"],
  [3, "20:00", 4, "karim"],

  [4, "19:30", 2, "dana"],
  [4, "20:00", 4, "faisal"],
];

function serviceFor(hour: number): ServiceId {
  return hour < 16 ? "lunch" : "dinner";
}

/**
 * Statuses for seeded reservations follow the clock: anything past is finished,
 * the slot currently running is on the floor, the rest is still to come. The
 * seated window is deliberately narrow — an eleven-table room cannot have four
 * services sitting at once. Explicit `force` values win, so the cancelled and
 * no-show rows are always there for the status filter.
 */
function statusFor(seatingAt: Date, now: Date): ReservationStatus {
  const minutesAway = (seatingAt.getTime() - now.getTime()) / 60_000;
  if (minutesAway < -45) return "completed";
  if (minutesAway < 15) return "seated";
  return "booked";
}

export function createSeedReservations(now: Date): Reservation[] {
  const today = startOfDay(now);

  return RESERVATIONS.map((row, index) => {
    const [day, time, partySize, guestKey, extras = {}] = row;
    const [hour, minute] = time.split(":").map(Number);

    const seatingAt = addMinutes(addDays(today, day), hour * 60 + minute);
    const status = extras.force ?? statusFor(seatingAt, now);
    const guest = GUESTS[guestKey];

    return {
      id: `res_seed_${index.toString().padStart(3, "0")}`,
      reference: `SO-${4100 + index * 7}`,
      guest: {
        name: guest.name,
        phone: guest.phone,
        email: emailFor(guest.name),
      },
      partySize,
      seatingAt: seatingAt.toISOString(),
      service: serviceFor(hour),
      status,
      occasion: extras.occasion ?? "none",
      specialRequests: extras.requests ?? "",
      staffNote: extras.staffNote ?? "",
      createdAt: subDays(seatingAt, 3 + (index % 9)).toISOString(),
      seatedAt:
        status === "seated" || status === "completed"
          ? seatingAt.toISOString()
          : null,
      completedAt:
        status === "completed" ? addMinutes(seatingAt, 95).toISOString() : null,
      cancelledAt:
        status === "cancelled" || status === "no-show"
          ? subDays(seatingAt, 1).toISOString()
          : null,
    } satisfies Reservation;
  });
}

/* --- Orders --------------------------------------------------------------- */

interface OrderSeed {
  /** How long ago it was placed, in minutes. */
  minutesAgo: number;
  type: OrderType;
  guest: GuestKey;
  lines: readonly { code: string; quantity: number; note?: string }[];
  area?: string;
  addressLine?: string;
  addressNote?: string;
  staffNote?: string;
  force?: OrderStatus;
  cancellationReason?: string;
}

const ORDERS: readonly OrderSeed[] = [
  // Just in — the top of the New column.
  { minutesAgo: 2, type: "delivery", guest: "yara", lines: [{ code: "GR-05", quantity: 1 }, { code: "MZ-01", quantity: 1 }, { code: "DR-05", quantity: 2 }], area: "Demo District 4", addressLine: "Demo Building 1, unit 1", addressNote: "Call from the lobby, the intercom is broken." },
  { minutesAgo: 4, type: "pickup", guest: "sami", lines: [{ code: "ST-04", quantity: 2 }, { code: "MZ-07", quantity: 1 }] },
  { minutesAgo: 6, type: "delivery", guest: "grace", lines: [{ code: "MN-01", quantity: 1 }, { code: "MZ-02", quantity: 1 }, { code: "DS-04", quantity: 1 }], area: "Demo District 3", addressLine: "Demo Building 2, unit 2" },
  { minutesAgo: 8, type: "pickup", guest: "aditya", lines: [{ code: "MN-06", quantity: 1 }, { code: "MZ-06", quantity: 1 }, { code: "DR-04", quantity: 1 }], staffNote: "Regular — no coriander anywhere." },
  { minutesAgo: 9, type: "delivery", guest: "elena", lines: [{ code: "GR-02", quantity: 2 }, { code: "MZ-05", quantity: 1 }], area: "Demo District 5", addressLine: "Demo Building 3, unit 3" },

  // On the pass.
  { minutesAgo: 13, type: "pickup", guest: "faisal", lines: [{ code: "GR-01", quantity: 1 }, { code: "MN-04", quantity: 1 }, { code: "DR-01", quantity: 2 }] },
  { minutesAgo: 15, type: "delivery", guest: "reem", lines: [{ code: "MZ-01", quantity: 1 }, { code: "MZ-04", quantity: 1 }, { code: "ST-02", quantity: 1 }, { code: "DR-02", quantity: 2 }], area: "Demo District 7", addressLine: "Demo Building 4, unit 4" },
  { minutesAgo: 17, type: "pickup", guest: "noura", lines: [{ code: "GR-03", quantity: 1 }, { code: "MZ-03", quantity: 1, note: "Extra lemon." }] },
  { minutesAgo: 19, type: "delivery", guest: "ziad", lines: [{ code: "MN-02", quantity: 1 }, { code: "DS-01", quantity: 2 }], area: "Demo District 6", addressLine: "Demo Building 5, unit 5" },
  { minutesAgo: 21, type: "pickup", guest: "amal", lines: [{ code: "ST-03", quantity: 3 }, { code: "DR-05", quantity: 3 }] },
  { minutesAgo: 23, type: "delivery", guest: "mei", lines: [{ code: "GR-04", quantity: 1 }, { code: "MZ-02", quantity: 1 }, { code: "DS-03", quantity: 1 }], area: "Demo District 8", addressLine: "Demo Building 6, unit 6", addressNote: "Leave with the concierge." },

  // Ready, waiting to be collected or picked up by the driver.
  { minutesAgo: 28, type: "pickup", guest: "daniel", lines: [{ code: "GR-05", quantity: 1 }, { code: "MZ-06", quantity: 1 }] },
  { minutesAgo: 31, type: "delivery", guest: "sofia", lines: [{ code: "MN-05", quantity: 1 }, { code: "MZ-07", quantity: 1 }, { code: "DR-06", quantity: 2 }], area: "Demo District 2", addressLine: "Demo Building 7, unit 7" },
  { minutesAgo: 34, type: "pickup", guest: "james", lines: [{ code: "ST-01", quantity: 2 }, { code: "ST-05", quantity: 1 }] },
  { minutesAgo: 38, type: "delivery", guest: "priya", lines: [{ code: "MN-06", quantity: 2 }, { code: "MZ-03", quantity: 1 }], area: "Demo District 1", addressLine: "Demo Building 8, unit 8" },
  { minutesAgo: 41, type: "pickup", guest: "rashid", lines: [{ code: "GR-01", quantity: 2 }, { code: "MN-01", quantity: 1 }, { code: "DS-02", quantity: 2 }] },

  // Done.
  { minutesAgo: 55, type: "delivery", guest: "hind", lines: [{ code: "MZ-01", quantity: 2 }, { code: "ST-04", quantity: 1 }], area: "Demo District 3", addressLine: "Demo Building 9, unit 9" },
  { minutesAgo: 68, type: "pickup", guest: "elias", lines: [{ code: "GR-02", quantity: 1 }, { code: "DR-03", quantity: 1 }] },
  { minutesAgo: 74, type: "delivery", guest: "fatima", lines: [{ code: "MN-03", quantity: 1 }, { code: "MZ-05", quantity: 1 }, { code: "DS-05", quantity: 1 }], area: "Demo District 5", addressLine: "Demo Building 10, unit 10" },
  { minutesAgo: 86, type: "pickup", guest: "dana", lines: [{ code: "ST-02", quantity: 2 }, { code: "MZ-04", quantity: 1 }] },
  { minutesAgo: 95, type: "delivery", guest: "tariq", lines: [{ code: "GR-05", quantity: 2 }, { code: "MN-02", quantity: 1 }, { code: "DR-01", quantity: 4 }], area: "Demo District 4", addressLine: "Demo Building 11, unit 11" },
  { minutesAgo: 112, type: "pickup", guest: "rana", lines: [{ code: "MZ-06", quantity: 1 }, { code: "GR-07", quantity: 1 }] },
  { minutesAgo: 128, type: "delivery", guest: "hassan", lines: [{ code: "MN-01", quantity: 2 }, { code: "MZ-01", quantity: 1 }], area: "Demo District 6", addressLine: "Demo Building 12, unit 12" },
  { minutesAgo: 141, type: "pickup", guest: "layla", lines: [{ code: "ST-06", quantity: 1 }, { code: "DR-04", quantity: 2 }] },

  // Cancelled, so the filter and the status colour both have a real example.
  { minutesAgo: 47, type: "delivery", guest: "omar", lines: [{ code: "GR-06", quantity: 1 }, { code: "MZ-02", quantity: 1 }], area: "Demo District 7", addressLine: "Demo Building 13, unit 13", force: "cancelled", cancellationReason: "Hammour sold out and the guest did not want a substitute." },
  { minutesAgo: 63, type: "pickup", guest: "karim", lines: [{ code: "MN-04", quantity: 1 }], force: "cancelled", cancellationReason: "Guest could not make the collection window." },
];

/** Older orders have moved further along the pass. */
function orderStatusFor(minutesAgo: number): OrderStatus {
  if (minutesAgo >= 50) return "completed";
  if (minutesAgo >= 25) return "ready";
  if (minutesAgo >= 11) return "preparing";
  return "new";
}

export function createSeedOrders(menu: readonly MenuItem[], now: Date): Order[] {
  const byCode = new Map(menu.map((item) => [item.code, item]));

  return ORDERS.map((seed, index) => {
    const placedAt = subMinutes(now, seed.minutesAgo);
    const status = seed.force ?? orderStatusFor(seed.minutesAgo);
    const guest = GUESTS[seed.guest];

    const lines: OrderLine[] = seed.lines.map((line, lineIndex) => {
      const item = byCode.get(line.code);
      if (!item) throw new Error(`Seed order references unknown dish ${line.code}`);

      return {
        id: `ordline_${index}_${lineIndex}`,
        menuItemId: item.id,
        code: item.code,
        name: item.name,
        course: item.course,
        quantity: line.quantity,
        unitPriceFils: item.priceFils,
        note: line.note ?? "",
      };
    });

    const totals = computeTotals(lines, seed.type);

    return {
      id: `order_seed_${index.toString().padStart(2, "0")}`,
      reference: `SO-${3100 + index * 13}`,
      type: seed.type,
      channel: "online",
      status,
      lines,
      customer: {
        name: guest.name,
        phone: guest.phone,
        email: emailFor(guest.name),
        address:
          seed.type === "delivery"
            ? {
                line1: seed.addressLine ?? "",
                area: seed.area ?? "",
                city: "Dubai",
                notes: seed.addressNote ?? "",
              }
            : null,
      },
      ...totals,
      placedAt: placedAt.toISOString(),
      scheduledFor: null,
      readyAt:
        status === "ready" || status === "completed"
          ? addMinutes(placedAt, 22).toISOString()
          : null,
      completedAt:
        status === "completed" ? addMinutes(placedAt, 34).toISOString() : null,
      cancelledAt:
        status === "cancelled" ? addMinutes(placedAt, 9).toISOString() : null,
      cancellationReason: seed.cancellationReason ?? "",
      staffNote: seed.staffNote ?? "",
    } satisfies Order;
  });
}
