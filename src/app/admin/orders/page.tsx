import type { Metadata } from "next";

import { OrderBoard } from "@/features/orders";

export const metadata: Metadata = { title: "The pass" };

export default function AdminOrdersPage() {
  return <OrderBoard />;
}
