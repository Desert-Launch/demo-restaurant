"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ExternalLink,
  LayoutDashboard,
  RotateCcw,
  ScrollText,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useResetDemoData } from "@/features/dashboard";
import { cn } from "@/lib/utils";
import { Khatim } from "./wordmark";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Overview would otherwise match every admin route as a prefix. */
  exact?: boolean;
}

const NAV: readonly NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservations", label: "Reservations", icon: BookOpen },
  { href: "/admin/orders", label: "Orders", icon: UtensilsCrossed },
  { href: "/admin/menu", label: "Menu", icon: ScrollText },
];

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Staff sections" className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-oud-800 text-saffron-300"
                : "text-salt-300 hover:bg-oud-850 hover:text-salt-50",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function ResetDemoData() {
  const reset = useResetDemoData();

  return (
    <div className="rounded-lg border border-oud-700 bg-oud-850 p-4">
      <p className="sf-rail">Demo data</p>
      <p className="mt-2 text-xs text-salt-400">
        Everything you change lives in memory for this tab. Reset puts the book,
        the board and the menu back to the seed.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-3 w-full"
        onClick={() => reset.mutate()}
        disabled={reset.isPending}
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        {reset.isPending ? "Resetting…" : "Reset demo data"}
      </Button>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-oud-700 bg-oud-900 lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-oud-700 px-5">
        <Link href="/admin" className="flex items-center gap-2.5 rounded-sm">
          <Khatim className="size-5 text-saffron-500" />
          <span className="font-display text-base font-semibold text-salt-50">
            Demo <span className="text-saffron-500">Restaurant</span>
          </span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-8 overflow-y-auto p-4">
        <AdminNav />

        <div className="space-y-4">
          <ResetDemoData />
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm px-3 text-xs text-salt-400 hover:text-salt-100"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            Back to the public site
          </Link>
        </div>
      </div>
    </aside>
  );
}
