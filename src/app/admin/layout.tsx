import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminTopbar } from "@/components/layout/admin-topbar";

export const metadata: Metadata = {
  title: {
    default: "Staff view",
    template: "%s · Staff view · Saffron & Oud",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />
        <main id="main" className="flex-1 p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
