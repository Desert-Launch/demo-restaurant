import type { Metadata } from "next";

import { ReservationTable } from "@/features/reservations";

export const metadata: Metadata = { title: "The book" };

export default function AdminReservationsPage() {
  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-salt-300">
        Every booking in the room. Seating and closing a table move the row
        straight away; cancelling releases the table back into the floor view
        above.
      </p>
      <ReservationTable />
    </div>
  );
}
