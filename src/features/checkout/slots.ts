import { addMinutes, isSameDay, startOfDay } from "date-fns";

import { SERVICES } from "@/lib/house";
import type { OrderType } from "@/types";

/**
 * Collection and delivery windows.
 *
 * The kitchen only sends food out while it is already cooking, so the windows
 * are generated from the same two services the room runs, in fifteen-minute
 * steps, with a lead time that depends on whether a driver is involved.
 */
export const PICKUP_LEAD_MINUTES = 25;
export const DELIVERY_LEAD_MINUTES = 45;
const STEP_MINUTES = 15;

export interface FulfilmentSlot {
  /** ISO timestamp, or "asap". */
  value: string;
  label: string;
}

export function leadMinutesFor(type: OrderType): number {
  return type === "delivery" ? DELIVERY_LEAD_MINUTES : PICKUP_LEAD_MINUTES;
}

/** Every window still open today, plus the "as soon as you can" option. */
export function fulfilmentSlots(type: OrderType, now: Date): FulfilmentSlot[] {
  const earliest = addMinutes(now, leadMinutesFor(type));
  const day = startOfDay(now);
  const slots: FulfilmentSlot[] = [];

  for (const service of SERVICES) {
    // The kitchen keeps sending for half an hour past the last seating.
    for (
      let minutes = service.opensAt;
      minutes <= service.lastSeating + 30;
      minutes += STEP_MINUTES
    ) {
      const at = addMinutes(day, minutes);
      if (at < earliest || !isSameDay(at, now)) continue;

      slots.push({
        value: at.toISOString(),
        label: at.toTimeString().slice(0, 5),
      });
    }
  }

  return slots;
}
