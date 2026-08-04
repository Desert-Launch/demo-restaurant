"use client";

import { addDays, format, isSameDay, startOfDay } from "date-fns";

import { BOOKING_HORIZON_DAYS } from "@/types";
import { cn } from "@/lib/utils";

/** The next fortnight, as a scrollable strip of days. */
export function DayRail({
  today,
  selected,
  onSelect,
}: {
  today: Date;
  selected: string;
  onSelect: (dayIso: string) => void;
}) {
  const days = Array.from({ length: BOOKING_HORIZON_DAYS }, (_, index) =>
    startOfDay(addDays(today, index)),
  );
  const selectedDate = new Date(selected);

  return (
    <div
      role="group"
      aria-label="Choose a day"
      className="flex gap-2 overflow-x-auto pb-2"
    >
      {days.map((day, index) => {
        const active = isSameDay(day, selectedDate);
        return (
          <button
            key={day.toISOString()}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(day.toISOString())}
            className={cn(
              "flex min-w-18 flex-col items-center gap-1 rounded-lg border px-3 py-2.5 transition-colors",
              active
                ? "border-saffron-500 bg-saffron-950 text-saffron-200"
                : "border-oud-600 bg-oud-850 text-salt-300 hover:border-oud-500 hover:text-salt-50",
            )}
          >
            <span className="text-2xs tracking-widest uppercase">
              {index === 0 ? "Today" : format(day, "EEE")}
            </span>
            <span className="tnum text-lg leading-none">
              {format(day, "d")}
            </span>
            <span className="text-2xs text-salt-400">{format(day, "MMM")}</span>
            <span className="sr-only">{format(day, "EEEE d MMMM")}</span>
          </button>
        );
      })}
    </div>
  );
}
