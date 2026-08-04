import type { ReservationStatus } from "@/types";

export interface ReservationStatusMeta {
  label: string;
  /** What the staff member is about to do, used on the advance button. */
  advanceLabel?: string;
  next?: ReservationStatus;
  className: string;
  dotClassName: string;
}

export const RESERVATION_STATUS_META: Record<
  ReservationStatus,
  ReservationStatusMeta
> = {
  booked: {
    label: "Booked",
    advanceLabel: "Seat the table",
    next: "seated",
    className: "border-steel-700 bg-steel-950 text-steel-300",
    dotClassName: "bg-steel-500",
  },
  seated: {
    label: "Seated",
    advanceLabel: "Close the table",
    next: "completed",
    className: "border-saffron-800 bg-saffron-950 text-saffron-300",
    dotClassName: "bg-saffron-500",
  },
  completed: {
    label: "Completed",
    className: "border-mint-700 bg-mint-950 text-mint-300",
    dotClassName: "bg-mint-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-oud-600 bg-oud-850 text-salt-400",
    dotClassName: "bg-salt-600",
  },
  "no-show": {
    label: "No-show",
    className: "border-rumman-700 bg-rumman-950 text-rumman-300",
    dotClassName: "bg-rumman-500",
  },
};

export const OCCASION_LABELS = {
  none: "No occasion",
  birthday: "Birthday",
  anniversary: "Anniversary",
  business: "Business",
  other: "Something else",
} as const;
