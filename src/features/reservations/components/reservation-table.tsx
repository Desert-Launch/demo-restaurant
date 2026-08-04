"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { addDays, isSameDay, startOfDay } from "date-fns";
import { CalendarPlus, MoreHorizontal, Search } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTableShell } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNow } from "@/lib/hooks/use-now";
import { RESERVATION_STATUSES, type Reservation } from "@/types";
import {
  cn,
  formatCovers,
  formatRelativeDay,
  formatTime,
  pluralize,
} from "@/lib/utils";
import { buildDayOccupancy } from "../availability";
import {
  useDeleteReservation,
  useReservations,
  useUpdateReservationStatus,
} from "../hooks/use-reservations";
import { OCCASION_LABELS, RESERVATION_STATUS_META } from "../status";
import { CancelReservationDialog } from "./cancel-reservation-dialog";
import { FloorView } from "./floor-view";
import { ReservationFormDialog } from "./reservation-form-dialog";

type StatusFilter = "all" | Reservation["status"];
type DayFilter = "today" | "tomorrow" | "week" | "all";

const DAY_FILTERS: { value: DayFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "Next seven days" },
  { value: "all", label: "Every day" },
];

export function ReservationTable() {
  const now = useNow();
  const { data: reservations, isPending, isError, error, refetch } =
    useReservations();

  const [status, setStatus] = useState<StatusFilter>("all");
  const [day, setDay] = useState<DayFilter>("today");
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState<Reservation | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [cancelling, setCancelling] = useState<Reservation | null>(null);
  const [deleting, setDeleting] = useState<Reservation | null>(null);

  const advance = useUpdateReservationStatus();
  const remove = useDeleteReservation();
  const reduced = useReducedMotion();

  const rows = useMemo(() => {
    if (!reservations || !now) return [];
    const today = startOfDay(now);
    const query = search.trim().toLowerCase();

    return reservations
      .filter((reservation) => {
        if (status !== "all" && reservation.status !== status) return false;

        const seatingAt = new Date(reservation.seatingAt);
        if (day === "today" && !isSameDay(seatingAt, today)) return false;
        if (day === "tomorrow" && !isSameDay(seatingAt, addDays(today, 1)))
          return false;
        if (day === "week" && (seatingAt < today || seatingAt > addDays(today, 7)))
          return false;

        if (query) {
          const haystack =
            `${reservation.guest.name} ${reservation.guest.phone} ${reservation.reference}`.toLowerCase();
          if (!haystack.includes(query)) return false;
        }

        return true;
      })
      .sort(
        (a, b) =>
          new Date(a.seatingAt).getTime() - new Date(b.seatingAt).getTime(),
      );
  }, [reservations, now, status, day, search]);

  // The floor view only makes sense for one day at a time.
  const floorSlots = useMemo(() => {
    if (!reservations || !now) return [];
    const target =
      day === "tomorrow" ? addDays(startOfDay(now), 1) : startOfDay(now);
    return buildDayOccupancy(reservations, target, now);
  }, [reservations, now, day]);

  if (isError) {
    return (
      <EmptyState
        title="The book did not load"
        description={error.message}
        action={
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  const loading = isPending || !now;

  const toolbar = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="relative min-w-56 flex-1">
        <label htmlFor="reservation-search" className="sf-rail">
          Search
        </label>
        <Search
          className="pointer-events-none absolute top-9 left-3 size-4 text-salt-400"
          aria-hidden="true"
        />
        <Input
          id="reservation-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Guest, phone or reference"
          className="mt-2 pl-9"
        />
      </div>

      <div>
        <label htmlFor="reservation-day" className="sf-rail">
          When
        </label>
        <Select
          value={day}
          onValueChange={(value) => setDay(value as DayFilter)}
        >
          <SelectTrigger id="reservation-day" className="mt-2 w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAY_FILTERS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="reservation-status" className="sf-rail">
          Status
        </label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as StatusFilter)}
        >
          <SelectTrigger id="reservation-status" className="mt-2 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            {RESERVATION_STATUSES.map((option) => (
              <SelectItem key={option} value={option}>
                {RESERVATION_STATUS_META[option].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      >
        <CalendarPlus aria-hidden="true" /> Take a booking
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      {day === "today" || day === "tomorrow" ? (
        <FloorView slots={floorSlots} isPending={loading} />
      ) : null}

      <DataTableShell
        toolbar={toolbar}
        count={rows.length}
        countLabel={pluralize(rows.length, "booking", "bookings")}
      >
        {loading ? (
          <div className="space-y-2 p-4" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            className="m-4 border-0"
            title="No bookings match those filters"
            description="Widen the day or the status and the book will fill back up."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setStatus("all");
                  setDay("all");
                  setSearch("");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-32">Seating</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead className="w-20">Party</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-12 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}>
                {rows.map((reservation) => {
                  const meta = RESERVATION_STATUS_META[reservation.status];
                  // Pulled out so the menu item below narrows properly rather
                  // than needing a non-null assertion inside the handler.
                  const nextStatus = meta.next;

                  return (
                    <motion.tr
                      key={reservation.id}
                      layout={!reduced}
                      initial={reduced ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        reduced ? undefined : { opacity: 0, height: 0, y: -6 }
                      }
                      transition={{ duration: reduced ? 0 : 0.2 }}
                      className="border-b border-oud-700 last:border-0 hover:bg-oud-750/60"
                    >
                      <TableCell className="align-top">
                        <span className="tnum block text-salt-50">
                          {formatTime(reservation.seatingAt)}
                        </span>
                        <span className="block text-xs text-salt-400">
                          {formatRelativeDay(reservation.seatingAt)}
                        </span>
                      </TableCell>

                      <TableCell className="align-top">
                        <span className="block text-salt-50">
                          {reservation.guest.name}
                        </span>
                        <span className="tnum block text-xs text-salt-400">
                          {reservation.reference} · {reservation.guest.phone}
                        </span>
                      </TableCell>

                      <TableCell className="tnum align-top text-salt-100">
                        {reservation.partySize}
                      </TableCell>

                      <TableCell className="align-top">
                        <span
                          className={cn(
                            "inline-flex rounded-sm border px-1.5 py-0.5 text-2xs uppercase",
                            meta.className,
                          )}
                        >
                          {meta.label}
                        </span>
                      </TableCell>

                      <TableCell className="max-w-72 align-top text-xs text-salt-400">
                        {reservation.occasion !== "none" ? (
                          <span className="mb-1 block text-saffron-300">
                            {OCCASION_LABELS[reservation.occasion]}
                          </span>
                        ) : null}
                        {reservation.specialRequests ? (
                          <span className="block text-pretty">
                            {reservation.specialRequests}
                          </span>
                        ) : null}
                        {reservation.staffNote ? (
                          <span className="mt-1 block text-pretty text-salt-400">
                            {reservation.staffNote}
                          </span>
                        ) : null}
                      </TableCell>

                      <TableCell className="align-top text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <MoreHorizontal className="size-4" aria-hidden="true" />
                              <span className="sr-only">
                                Actions for {reservation.guest.name}
                              </span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            {nextStatus && meta.advanceLabel ? (
                              <DropdownMenuItem
                                onSelect={() =>
                                  advance.mutate(
                                    {
                                      id: reservation.id,
                                      status: nextStatus,
                                    },
                                    {
                                      onError: (mutationError) =>
                                        toast.error("That did not stick", {
                                          description: mutationError.message,
                                        }),
                                    },
                                  )
                                }
                              >
                                {meta.advanceLabel}
                              </DropdownMenuItem>
                            ) : null}

                            {reservation.status === "booked" ? (
                              <DropdownMenuItem
                                onSelect={() =>
                                  advance.mutate({
                                    id: reservation.id,
                                    status: "no-show",
                                  })
                                }
                              >
                                Mark as a no-show
                              </DropdownMenuItem>
                            ) : null}

                            <DropdownMenuItem
                              onSelect={() => {
                                setEditing(reservation);
                                setFormOpen(true);
                              }}
                            >
                              Edit the booking
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {reservation.status !== "cancelled" ? (
                              <DropdownMenuItem
                                onSelect={() => setCancelling(reservation)}
                                className="text-rumman-300"
                              >
                                Cancel the booking
                              </DropdownMenuItem>
                            ) : null}

                            <DropdownMenuItem
                              onSelect={() => setDeleting(reservation)}
                              className="text-rumman-300"
                            >
                              Delete from the book
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </DataTableShell>

      <ReservationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        reservation={editing}
      />

      <CancelReservationDialog
        open={cancelling !== null}
        onOpenChange={(open) => !open && setCancelling(null)}
        reservation={cancelling}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this booking?"
        description={
          deleting
            ? `${deleting.guest.name}, ${formatCovers(deleting.partySize)} at ${formatTime(deleting.seatingAt)}. It leaves the book entirely — cancel it instead if you want the record.`
            : ""
        }
        confirmLabel="Delete it"
        pending={remove.isPending}
        onConfirm={() => {
          if (!deleting) return;
          const name = deleting.guest.name;
          remove.mutate(deleting.id, {
            onSuccess: () => {
              setDeleting(null);
              toast.success(`${name}'s booking deleted`);
            },
            onError: (mutationError) =>
              toast.error("That did not delete", {
                description: mutationError.message,
              }),
          });
        }}
      />
    </div>
  );
}
