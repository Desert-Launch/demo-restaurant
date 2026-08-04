import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  /** One line that says what to do next, never an apology. */
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-oud-600 bg-oud-900/60 px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? <div className="mb-4 text-salt-400">{icon}</div> : null}
      <p className="font-display text-lg text-salt-100">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-salt-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
