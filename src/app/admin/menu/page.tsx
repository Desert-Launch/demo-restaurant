import type { Metadata } from "next";

import { AdminMenuTable } from "@/features/menu";

export const metadata: Metadata = { title: "The card" };

export default function AdminMenuPage() {
  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-salt-300">
        Everything on the card. The switch 86s a dish for tonight and it shows
        as off on the public menu straight away; taking it off the card removes
        it entirely.
      </p>
      <AdminMenuTable />
    </div>
  );
}
