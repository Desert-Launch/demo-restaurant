"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCovers, formatRelativeDay, formatTime } from "@/lib/utils";
import { useDayOccupancy } from "../hooks/use-reservations";
import { DayRail } from "./day-rail";
import { SlotRail } from "./slot-rail";

export function TimeStep({
  today,
  partySize,
  day,
  onDayChange,
  seatingAt,
  onSeatingChange,
  onBack,
  onNext,
}: {
  today: Date;
  partySize: number;
  day: string;
  onDayChange: (dayIso: string) => void;
  seatingAt: string | null;
  onSeatingChange: (startsAt: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { data: slots, isPending, isError, error, refetch } = useDayOccupancy(day);

  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-salt-50">
        When would you like the table?
      </h2>
      <p className="mt-3 max-w-lg text-salt-300">
        Each time shows what is still free for {formatCovers(partySize)} — one
        diamond per table that would hold you.
      </p>

      <div className="mt-8">
        <DayRail today={today} selected={day} onSelect={onDayChange} />
      </div>

      <div className="mt-10">
        {isError ? (
          <EmptyState
            title="The book did not load"
            description={error.message}
            action={
              <Button variant="outline" onClick={() => void refetch()}>
                Try again
              </Button>
            }
          />
        ) : (
          <SlotRail
            slots={slots ?? []}
            partySize={partySize}
            selected={seatingAt}
            onSelect={onSeatingChange}
            isPending={isPending}
          />
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button size="lg" onClick={onNext} disabled={!seatingAt}>
          {seatingAt
            ? `Continue with ${formatRelativeDay(seatingAt).toLowerCase()} at ${formatTime(seatingAt)}`
            : "Pick a time to continue"}
        </Button>
      </div>
    </div>
  );
}
