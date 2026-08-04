import type { MenuCourse } from "@/types";
import { cn } from "@/lib/utils";
import { COURSE_META, plateStyle } from "../taxonomy";

/**
 * There is no photography in this app. A dish is a plate: a dressed surface lit
 * from the upper left, sitting in its own shadow, coloured from the two tokens
 * its course carries. Grills get sear marks over the top.
 */
export function Plate({
  course,
  className,
  unavailable = false,
}: {
  course: MenuCourse;
  className?: string;
  unavailable?: boolean;
}) {
  const meta = COURSE_META[course];

  return (
    <span
      aria-hidden="true"
      style={plateStyle(course)}
      className={cn(
        "sf-plate relative block shrink-0 rounded-full",
        meta.seared && "sf-plate-seared",
        unavailable && "opacity-30 saturate-[0.35]",
        className,
      )}
    />
  );
}
