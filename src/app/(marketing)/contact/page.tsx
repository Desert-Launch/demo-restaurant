import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Clock, MapPin, Phone } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/features/contact";
import { HOUSE, OPENING_HOURS } from "@/lib/house";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Ask about a large party, private hire or anything else. Reservations are faster through the booking page.",
};

export default function ContactPage() {
  return (
    <PageContainer className="py-20">
      <p className="sf-rail">Contact</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold text-balance text-salt-50">
        Ask us something
      </h1>
      <p className="mt-5 max-w-xl text-lg text-pretty text-salt-300">
        For a table, the booking page is faster than we are. Everything else —
        a party of twelve, taking the room for an evening, something that went
        wrong — comes here.
      </p>

      <div className="mt-16 grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
        <ContactForm />

        <aside className="space-y-10">
          <div className="rounded-xl border border-oud-700 bg-oud-800 p-6">
            <CalendarCheck
              className="size-5 text-saffron-500"
              aria-hidden="true"
            />
            <h2 className="mt-4 font-display text-xl font-semibold text-salt-50">
              Booking a table?
            </h2>
            <p className="mt-2 text-sm text-salt-300">
              Up to eight people, the booking page confirms straight away and
              you will not need us at all.
            </p>
            <Button asChild className="mt-5 w-full">
              <Link href="/reserve">Reserve a table</Link>
            </Button>
          </div>

          <div>
            <h2 className="sf-rail flex items-center gap-2">
              <Phone className="size-3.5" aria-hidden="true" /> Call the room
            </h2>
            <p className="tnum mt-3 text-lg text-salt-100">{HOUSE.phone}</p>
            <p className="mt-1 text-sm text-salt-400">
              Someone picks up during service. Outside it, leave a message.
            </p>
          </div>

          <div>
            <h2 className="sf-rail flex items-center gap-2">
              <MapPin className="size-3.5" aria-hidden="true" /> Where
            </h2>
            <address className="mt-3 space-y-0.5 text-sm text-salt-200 not-italic">
              <p>{HOUSE.address.line1}</p>
              <p>{HOUSE.address.line2}</p>
              <p>{HOUSE.address.city}</p>
            </address>
            <p className="mt-2 text-sm text-salt-400">{HOUSE.directions}</p>
          </div>

          <div>
            <h2 className="sf-rail flex items-center gap-2">
              <Clock className="size-3.5" aria-hidden="true" /> Hours
            </h2>
            <dl className="mt-3 space-y-2">
              {OPENING_HOURS.map((row) => (
                <div key={row.days}>
                  <dt className="text-xs text-salt-400">{row.days}</dt>
                  <dd className="tnum text-sm text-salt-200">{row.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
