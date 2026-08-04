import type { DishTag } from "@/types";
import { cn } from "@/lib/utils";
import { TAG_CLASSNAMES, TAG_LABELS } from "../taxonomy";

export function TagChip({
  tag,
  className,
}: {
  tag: DishTag;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-2xs tracking-wide uppercase",
        TAG_CLASSNAMES[tag],
        className,
      )}
    >
      {TAG_LABELS[tag]}
    </span>
  );
}
