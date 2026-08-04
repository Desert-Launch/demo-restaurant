import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { ReserveWizard } from "@/features/reservations";

export const metadata: Metadata = {
  title: "Reserve a table",
  description:
    "Pick a party size and a seating time. Availability updates live against the tables actually left in the room.",
};

export default function ReservePage() {
  return (
    <PageContainer className="py-16 sm:py-20">
      <p className="sf-rail">Reservations</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold text-balance text-salt-50">
        Book the table
      </h1>
      <p className="mt-5 max-w-xl text-lg text-pretty text-salt-300">
        Eleven tables, two services, no deposit. What you see is what is
        actually left — and the big tables go first.
      </p>

      <div className="mt-14">
        <ReserveWizard />
      </div>
    </PageContainer>
  );
}
