import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** The page gutter. Everything on the public site sits inside one of these. */
export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-page px-5 sm:px-8", className)}
    >
      {children}
    </div>
  );
}

/** The menu-card column: a ~62-character measure for reading copy. */
export function Measure({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-measure", className)}>{children}</div>
  );
}
