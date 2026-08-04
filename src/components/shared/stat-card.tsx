import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  /** One line of context under the number — never a fake trend arrow. */
  detail?: string;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  detail,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-oud-700 bg-oud-800 p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="sf-rail">{label}</p>
        {icon ? <span className="text-salt-400">{icon}</span> : null}
      </div>
      <p className="tnum mt-3 text-3xl leading-none font-semibold text-salt-50">
        {value}
      </p>
      {detail ? <p className="mt-2 text-xs text-salt-400">{detail}</p> : null}
    </div>
  );
}
