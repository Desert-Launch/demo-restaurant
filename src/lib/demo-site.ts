/**
 * What this demo is, in one place. The Desert Launch bar, the share-preview
 * card, the metadata and the structured data all read from here, so they can
 * never disagree about the name, the URL or the language.
 */
export type DemoLang = "en" | "ar";

export const DEMO = {
  /** Short id the landing site uses; also the subdomain and utm_campaign. */
  slug: "restaurant",
  name: "Demo Restaurant",
  /** Latin-only name for the share-preview image, whose default font has no Arabic. */
  latinName: "Demo Restaurant",
  url: "https://restaurant.demos.desertlaunch.dev",
  /** Language of the bar and the metadata. Typed as the union so the shared
   *  code that handles both languages stays identical in every demo. */
  lang: "en" as DemoLang,
  /** Interface languages the demo itself offers. */
  languages: ["en"],
  kind: "restaurant",
  city: "Dubai",
  /** One paragraph for share previews and search snippets. */
  description:
    "A working demo of a restaurant website with its staff view, by Desert Launch: table reservations that show real availability for your party size, online ordering, and the reservation book, the pass and the menu in one place. Fictional restaurant, sample data.",
  /** Plain statement that the business is invented. */
  fiction:
    "A fictional business: the names, prices, address and phone numbers are invented, and the data is sample data that resets on refresh.",
  features: [
      "Table reservations with availability derived per party size and seating time",
      "Online ordering for collection or delivery",
      "Reservation book with a floor view",
      "Order pass as five columns",
      "Menu management including taking a dish off for the night",
      "Optimistic cancellation with a deliberate ~10% failure to show rollback"
  ],
  repo: "https://github.com/Desert-Launch/demo-restaurant",
  /** What the demo is, in the words its buyer searches with. The share-preview
   *  title and the heading of llms.txt. In the demo's own language. */
  headline: "Restaurant website with reservations and online ordering",
  /** Who the demo is for: the owner of this kind of business, not the
   *  business's customers. Emitted as `audience` in the JSON-LD. */
  audience: "Restaurants and lounges",
  /** The Desert Launch page that owns this vertical in search and explains
   *  what a real build adds. The bar's brand link and the JSON-LD point here,
   *  so the demo hands its visitors and its context to one indexed page. */
  industry: {
    url: "https://www.desertlaunch.dev/industries/restaurants-and-cafes/",
    name: "Restaurant and café websites by Desert Launch",
  },
  /** The bar's call to action, in the demo's language. */
  cta: "Want this for your restaurant?",
  /** Routes worth opening, listed in llms.txt. */
  pages: [
    { path: "/", label: "home" },
    { path: "/menu", label: "the menu" },
    { path: "/reserve", label: "table reservations" },
    { path: "/order", label: "online ordering" },
    { path: "/checkout", label: "checkout" },
    { path: "/admin", label: "staff overview" },
    { path: "/admin/reservations", label: "the reservation book" },
    { path: "/admin/orders", label: "the order pass" },
    { path: "/admin/menu", label: "the menu" },
  ],
} as const;
