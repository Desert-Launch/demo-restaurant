import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * The house mark: a khatim — the eight-point star you get from two squares at
 * 45° to each other, which is the unit the mashrabiya lattice repeats. Drawn
 * as strokes so it reads as screen rather than as a solid badge.
 */
export function Khatim({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      className={className}
    >
      <rect x="4.6" y="4.6" width="14.8" height="14.8" />
      <rect
        x="4.6"
        y="4.6"
        width="14.8"
        height="14.8"
        transform="rotate(45 12 12)"
      />
    </svg>
  );
}

export function Wordmark({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-sm text-salt-50",
        className,
      )}
    >
      <Khatim className="size-6 shrink-0 text-saffron-500 transition-transform duration-(--sf-duration-base) ease-(--sf-ease-out) group-hover:rotate-45" />
      <span className="font-display text-[1.0625rem] leading-none font-semibold tracking-tight">
        Saffron <span className="text-saffron-500">&amp;</span> Oud
      </span>
    </Link>
  );
}
