"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { STAFF_ROSTER, useStaffStore } from "@/features/staff";
import { AdminNav, ResetDemoData } from "./admin-sidebar";

/** The layout renders one topbar for every admin page, so it names itself. */
const TITLES: Record<string, string> = {
  "/admin": "Tonight",
  "/admin/reservations": "The book",
  "/admin/orders": "The pass",
  "/admin/menu": "The card",
};

export function AdminTopbar() {
  const pathname = usePathname();
  const current = useStaffStore((state) => state.current);
  const setCurrent = useStaffStore((state) => state.setCurrent);
  const [navOpen, setNavOpen] = useState(false);

  const title = TITLES[pathname] ?? "Staff view";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-oud-700 bg-oud-950/90 px-5 backdrop-blur-md">
      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Menu aria-hidden="true" />
            <span className="sr-only">Open staff sections</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="font-display text-xl">
              Staff view
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-6 px-4">
            <AdminNav onNavigate={() => setNavOpen(false)} />
            <ResetDemoData />
          </div>
        </SheetContent>
      </Sheet>

      <h1 className="font-display text-xl font-semibold text-salt-50">
        {title}
      </h1>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 pr-2 pl-2">
              <Avatar className="size-7">
                <AvatarFallback className="bg-saffron-950 text-2xs text-saffron-300">
                  {current.initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-left sm:block">
                <span className="block text-sm leading-tight text-salt-100">
                  {current.name}
                </span>
                <span className="block text-2xs leading-tight text-salt-400">
                  {current.role}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-salt-400">
              Signed in as — nothing is authenticated
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STAFF_ROSTER.map((member) => (
              <DropdownMenuItem
                key={member.id}
                onSelect={() => setCurrent(member.id)}
              >
                <span className="flex flex-col">
                  <span className="text-salt-100">{member.name}</span>
                  <span className="text-2xs text-salt-400">{member.role}</span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
