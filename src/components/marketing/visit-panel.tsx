import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { HOUSE, OPENING_HOURS, SERVICES } from "@/lib/house";

/**
 * Hours, where the room is, and how to get a table. The map is a placeholder
 * on purpose — nothing here loads a third-party embed.
 */
export function VisitPanel() {
  return (
    <section
      aria-labelledby="visit-heading"
      className="border-t border-oud-700 bg-oud-900"
    >
      <PageContainer className="py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <h2
              id="visit-heading"
              className="font-display text-3xl font-semibold text-salt-50"
            >
              Come and eat
            </h2>
            <p className="mt-4 max-w-md text-salt-300">
              Walk-ins take whatever is free, which after eight is usually
              nothing. Book and the table is yours for two hours.
            </p>

            <dl className="mt-10 space-y-7">
              <div className="flex gap-4">
                <Clock
                  className="mt-0.5 size-5 shrink-0 text-saffron-500"
                  aria-hidden="true"
                />
                <div>
                  <dt className="sf-rail">Hours</dt>
                  <dd className="mt-2 space-y-1">
                    {OPENING_HOURS.map((row) => (
                      <p key={row.days} className="text-sm text-salt-200">
                        <span className="text-salt-400">{row.days}</span>{" "}
                        <span className="tnum">{row.hours}</span>
                      </p>
                    ))}
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin
                  className="mt-0.5 size-5 shrink-0 text-saffron-500"
                  aria-hidden="true"
                />
                <div>
                  <dt className="sf-rail">Where</dt>
                  <dd className="mt-2 text-sm text-salt-200">
                    <p>{HOUSE.address.line1}</p>
                    <p>
                      {HOUSE.address.line2}, {HOUSE.address.city}
                    </p>
                    <p className="mt-2 text-salt-400">{HOUSE.directions}</p>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone
                  className="mt-0.5 size-5 shrink-0 text-saffron-500"
                  aria-hidden="true"
                />
                <div>
                  <dt className="sf-rail">Call the room</dt>
                  <dd className="tnum mt-2 text-sm text-salt-200">
                    {HOUSE.phone}
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/reserve">Reserve a table</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact">Ask us something</Link>
              </Button>
            </div>
          </div>

          {/* Location placeholder: the lattice standing in for a map, with the
              two services listed over it. No embed, no tiles, no tracking. */}
          <div className="relative overflow-hidden rounded-xl border border-oud-700 bg-oud-850">
            <div
              aria-hidden="true"
              className="sf-mashrabiya absolute inset-0 opacity-50"
              style={{ ["--sf-lattice-size" as string]: "46px" }}
            />
            <div className="relative flex h-full flex-col justify-between gap-10 p-8">
              <div>
                <p className="sf-rail">Two services, every day</p>
                <ul className="mt-5 space-y-5">
                  {SERVICES.map((service) => (
                    <li key={service.id}>
                      <p className="font-display text-2xl font-semibold text-salt-50">
                        {service.label}
                      </p>
                      <p className="mt-1 text-sm text-salt-400">
                        {service.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-salt-400">
                Map deliberately left out — this is a demo site and the address
                is invented.
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
