# Saffron & Oud

A frontend-only demo for a fictional Levantine and Emirati restaurant in Al Fahidi, Dubai. It covers the public site, table reservations, online ordering, and the staff view the room is run from.

There is no backend, no database and no auth. Everything is in memory.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

`npm run typecheck` and `npm run lint` both pass clean, as does a production build.

## What to show

**Guest side**

- `/` — the hero states the thesis: one charcoal fire, lit at four, and a card built around what comes off it. Signature dishes, the story, the chef's note, hours and where the room is.
- `/menu` — 38 dishes across six courses, set like a printed card with leader dots between each dish and its price. Four dietary filters. Anything can go into an order.
- `/reserve` — **the money feature.** Party size → day and time → your details → review → a reference. See the slot rail below.
- `/order`, `/checkout` — collection or delivery, your details, a time window, review, then an order number and an ETA.
- `/about`, `/contact` — the story, and a form that validates properly and sends nothing.

**Staff side**

- `/admin` — covers booked, how many are sitting down, tickets still open, money taken, and covers per seating time across the day.
- `/admin/reservations` — the book, filtered by day, status or guest. Full CRUD, every status the floor actually uses, and a floor view showing which table classes have gone in which slot.
- `/admin/orders` — the pass, as five columns. Move a ticket with the button on it, or open it to change quantities, leave a note or cancel. Phone orders go in from here.
- `/admin/menu` — create, edit and delete dishes, change prices, and 86 anything for tonight.

**The two loops worth demoing**

1. Book a table at `/reserve`, then open `/admin/reservations` — it is in the book, and the floor view above it has one fewer table free in that slot.
2. 86 a dish in `/admin/menu` and it shows as off on `/menu` straight away.

**The slot rail** is the signature piece. Every seating time shows what is left *for your party*: one diamond per table that could actually hold them, filled as the slot books out. A party of two sees eleven diamonds; a party of six sees two, because there are only two tables in the house that size. Availability is worked out from the bookings already in the book, so it moves on its own — pick a party of six and tomorrow at 20:00 is already gone.

## Where the data lives

`src/lib/store/` is the demo's "backend": a module-level singleton with no React in it.

- `db.ts` — the singleton plus typed read/write functions for the menu, the reservation book and the order board. Reads return structured clones, so nothing outside can mutate state by holding a reference.
- `seed.ts` — 38 dishes, 81 reservations across five days, 26 orders today. Hand-written rather than generated so the room looks the same every time it is shown. Statuses are the one thing resolved against the clock at seed time, so the board reads correctly whether the demo opens at eleven in the morning or ten at night.

Money is an integer number of fils (1 AED = 100 fils) everywhere, formatted only at the edge in `formatAed`. `computeTotals` in `src/lib/pricing.ts` is the single place subtotal, 5% VAT and the AED 15 delivery fee are worked out, so a total can never disagree with itself.

**Availability is derived, never stored.** A reservation records only a party size and a seating time. Which table it occupies is worked out at read time in `src/features/reservations/availability.ts`, by seating the largest parties first into the smallest table that holds them. `bookReservation` re-checks the slot before it writes, the way a real endpoint would — someone else may have taken the last table while the guest was typing their name.

The room is eleven tables and forty covers, and the seed concentrates bookings where a restaurant actually fills. Tomorrow at 20:00 takes every table; today at 20:00 leaves exactly one two-top, so a couple can still book it and a party of three cannot.

**Persistence:** add / edit / delete survive navigation for the whole browser session. A hard refresh re-evaluates the module and reseeds the day.

**Resetting:** the admin sidebar footer has a **Reset demo data** button. It calls `resetStore()`, clears the cart and drops every cached query.

**The deliberate failure:** `cancelReservation` and `cancelOrder` each throw roughly 10% of the time (`CANCEL_FAILURE_RATE` in the respective `api.ts`). The row or ticket moves to Cancelled optimistically, then rolls back with an error toast when the write fails. Raise the constant to `1` to demo the rollback on purpose.

## Architecture

Feature-sliced, with one direction of travel:

```
component → feature hook (TanStack) → feature api.ts → lib/store
```

`src/app/` holds routes only and stays thin — no business logic. `src/features/<domain>/` is where the real code lives, each with `schema.ts` (zod, types derived via `z.infer`), `api.ts` (async functions over the store, each with a small `sleep` so loading and skeleton states are real), `hooks/` (TanStack queries and mutations that invalidate on success) and `components/`. Every feature exposes a barrel `index.ts` and cross-feature imports go through the barrel rather than deep paths. Features never import from `app/`, and UI components never touch `lib/store` directly.

`package.json` declares `"sideEffects": ["*.css"]` so those barrels tree-shake — without it the admin-only code (recharts, the form dialogs) rides along into the public bundles.

Every read goes through TanStack Query and every write is a mutation that invalidates, so the demo behaves like a real app: loading skeletons, error states, optimistic status changes with rollback. Zustand holds only client selection state — the cart (`features/cart`) and the fake "signed in as" staff member (`features/staff`). A cart becomes an `Order` only when checkout writes it through `features/orders/api.ts`.

Every page is statically prerendered, so nothing reads the clock during render — `useNow` in `src/lib/hooks/` returns `null` until mount, and callers show a skeleton until it does. Without that, the build time would be baked into the HTML and then disagree with the browser on hydration.

## Design

Dark, and committed to one look: the dining room at nine. The canvas is a deep green-black — the colour of the room, not of the food — so the two warm accents read as candlelight and spice rather than washing warm-on-warm. Saffron is a true marigold rather than an orange; pomegranate carries heat, marks chilli on the menu, and is the destructive colour in the admin. Deliberately not the cream + serif + terracotta that restaurant sites get pushed toward.

Type is Fraunces for display — a variable serif with soft, slightly wonky terminals — Hanken Grotesk for body, and IBM Plex Mono for every price, cover count, code and timestamp.

Structure borrows from two places: printed menu cards (course headings in both scripts, a real dotted leader rule between a dish and its price) and mashrabiya latticework, which appears as a faint octagram grid behind the hero, as the tile standing in for a map, and as the diamond that fills in on the slot rail and the floor view.

All colour, spacing, radius, shadow and type values are CSS variables in `src/styles/tokens.css`. `src/app/globals.css` maps them onto Tailwind utilities and onto the shadcn semantic names, so the generated primitives inherit the identity. There are no hardcoded hex values in components.

**No photography anywhere.** A dish is a CSS "plate": a dressed surface lit from the upper left, sitting in its own shadow, coloured from the two tokens its course carries. Grills get sear marks.

Motion is deliberate and limited to three places: the hero reveal, the step transitions in both wizards, and list enter/exit on the admin table and the order board. Everything respects `prefers-reduced-motion`, both through `useReducedMotion` and a global CSS media query.

Contrast was measured rather than eyeballed: every text colour clears WCAG AA against the surface it sits on. `--sf-salt-600` is 3.6:1 and is therefore a status-dot and rule colour only, never text — the token comments record which is which.

## Not real

Fictional restaurant, fictional guests, fictional address. Phone numbers are in the reserved 555 range. No real people, brands or photographs, no map embed, and nothing is emailed, charged or sent anywhere.
