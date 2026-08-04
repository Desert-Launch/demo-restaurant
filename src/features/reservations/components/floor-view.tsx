"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TABLE_STOCK } from "@/types";
import { cn, formatTime } from "@/lib/utils";
import { TOTAL_TABLES, type SlotOccupancy } from "../availability";

/**
 * Which slots are full, broken down by table class — the view the guest rail
 * deliberately does not show. Each column is a seating time; each row is a
 * size of table; a filled diamond is a table that is spoken for.
 */
export function FloorView({
  slots,
  isPending,
}: {
  slots: SlotOccupancy[];
  isPending?: boolean;
}) {
  if (isPending) {
    return <Skeleton className="h-56 rounded-lg" aria-hidden="true" />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-oud-700 bg-oud-800 p-5">
      <table className="w-full min-w-[44rem] border-separate border-spacing-0">
        <caption className="sf-rail mb-4 text-left">
          The floor, slot by slot — {TOTAL_TABLES} tables
        </caption>
        <thead>
          <tr>
            <th scope="col" className="w-28 pb-3 text-left text-xs font-normal text-salt-400">
              Table
            </th>
            {slots.map((slot) => (
              <th
                key={slot.startsAt}
                scope="col"
                className="tnum pb-3 text-center text-xs font-normal text-salt-400"
              >
                {formatTime(slot.startsAt)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_STOCK.map((table) => (
            <tr key={table.seats}>
              <th
                scope="row"
                className="py-1.5 text-left text-xs font-normal text-salt-300"
              >
                {table.label}
                <span className="tnum ml-1 text-salt-400">×{table.count}</span>
              </th>
              {slots.map((slot) => {
                const usage = slot.usage.find(
                  (entry) => entry.seats === table.seats,
                );
                const taken = usage?.taken ?? 0;

                return (
                  <td key={slot.startsAt} className="py-1.5 text-center">
                    <span className="inline-flex justify-center gap-0.5">
                      {Array.from({ length: table.count }).map((_, index) => (
                        <span
                          key={index}
                          className={cn(
                            "size-2 rotate-45",
                            index < taken
                              ? "bg-saffron-500"
                              : "ring-1 ring-oud-600 ring-inset",
                          )}
                        />
                      ))}
                    </span>
                    <span className="sr-only">
                      {formatTime(slot.startsAt)}, {table.label}: {taken} of{" "}
                      {table.count} taken
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}

          <tr>
            <th
              scope="row"
              className="sf-seam pt-3 text-left text-xs font-normal text-salt-400"
            >
              Covers
            </th>
            {slots.map((slot) => (
              <td
                key={slot.startsAt}
                className={cn(
                  "sf-seam tnum pt-3 text-center text-xs",
                  slot.tablesTaken >= TOTAL_TABLES
                    ? "text-rumman-300"
                    : "text-salt-300",
                )}
              >
                {slot.coversBooked || "—"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
