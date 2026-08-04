import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The shell every admin table sits in: a toolbar above, a bordered scroll
 * container around, and a live count underneath so filtering says out loud
 * what it did.
 */
export function DataTableShell({
  toolbar,
  count,
  countLabel,
  children,
  className,
}: {
  toolbar?: ReactNode;
  count: number;
  /** e.g. "bookings" — pluralised by the caller. */
  countLabel: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {toolbar}
      <p aria-live="polite" className="text-sm text-salt-400">
        {count} {countLabel}
      </p>
      <div className="overflow-x-auto rounded-lg border border-oud-700 bg-oud-800">
        {children}
      </div>
    </div>
  );
}
