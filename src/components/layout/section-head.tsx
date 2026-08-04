import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Section heading in the house pattern: a mono rail above a display line, with
 * an optional action pinned to the right on wide screens.
 */
export function SectionHead({
  rail,
  title,
  lede,
  action,
  className,
  as: Heading = "h2",
}: {
  rail: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-measure">
        <p className="sf-rail">{rail}</p>
        <Heading className="mt-3 text-3xl font-semibold text-balance text-salt-50 sm:text-4xl">
          {title}
        </Heading>
        {lede ? (
          <p className="mt-4 text-lg text-pretty text-salt-300">{lede}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
