import Link from "next/link";

import { HOUSE, OPENING_HOURS } from "@/lib/house";
import { PageContainer } from "./page-container";
import { Khatim } from "./wordmark";

const COLUMNS = [
  {
    heading: "Eat",
    links: [
      { href: "/menu", label: "Menu" },
      { href: "/reserve", label: "Reserve a table" },
      { href: "/order", label: "Your order" },
    ],
  },
  {
    heading: "House",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/admin", label: "Staff view" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-oud-700 bg-oud-900">
      <PageContainer className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Khatim className="size-6 text-saffron-500" />
              <span className="font-display text-lg font-semibold tracking-tight text-salt-50">
                Saffron <span className="text-saffron-500">&amp;</span> Oud
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-salt-400">
              Charcoal grills, cold mezze and saffron rice, served in a
              courtyard house in Al Fahidi.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="sf-rail">{column.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-sm text-sm text-salt-300 transition-colors hover:text-saffron-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="sf-rail">Find us</h2>
            <address className="mt-4 space-y-1 text-sm text-salt-300 not-italic">
              <p>{HOUSE.address.line1}</p>
              <p>{HOUSE.address.line2}</p>
              <p>{HOUSE.address.city}</p>
              <p className="tnum pt-2 text-salt-400">{HOUSE.phone}</p>
            </address>
            <dl className="mt-6 space-y-2">
              {OPENING_HOURS.map((row) => (
                <div key={row.days}>
                  <dt className="text-xs text-salt-400">{row.days}</dt>
                  <dd className="tnum text-sm text-salt-200">{row.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <p className="sf-seam mt-14 pt-6 text-xs text-salt-600">
          A fictional restaurant, built as a demo. Nothing here is emailed,
          charged or sent anywhere, and the data resets when you refresh.
        </p>
      </PageContainer>
    </footer>
  );
}
