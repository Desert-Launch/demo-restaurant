import type { Metadata } from "next";

import { Overview } from "@/features/dashboard";

export const metadata: Metadata = { title: "Tonight" };

export default function AdminOverviewPage() {
  return <Overview />;
}
