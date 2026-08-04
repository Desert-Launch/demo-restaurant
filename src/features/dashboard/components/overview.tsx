"use client";

import Link from "next/link";
import {
  Armchair,
  BookOpen,
  CircleDollarSign,
  UtensilsCrossed,
} from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDER_STATUS_META, ORDER_TYPE_LABELS } from "@/features/orders";
import { RESERVATION_STATUS_META } from "@/features/reservations";
import { useStaffStore } from "@/features/staff";
import { TOTAL_COVERS } from "@/features/reservations";
import {
  cn,
  formatAedWithUnit,
  formatCovers,
  formatTime,
  pluralize,
} from "@/lib/utils";
import { useDashboard } from "../hooks/use-dashboard";
import { CoversChart } from "./covers-chart";

export function Overview() {
  const { data, isPending, isError, error, refetch } = useDashboard();
  const staff = useStaffStore((state) => state.current);

  if (isError) {
    return (
      <EmptyState
        title="Tonight did not load"
        description={error.message}
        action={
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (isPending || !data) {
    return (
      <div className="space-y-8" aria-hidden="true">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-lg" />
      </div>
    );
  }

  const turns = (data.coversToday / TOTAL_COVERS).toFixed(1);

  return (
    <div className="space-y-8">
      <div>
        <p className="sf-rail">Evening, {staff.name.split(" ")[0]}</p>
        <p className="mt-2 max-w-2xl text-salt-300">
          {data.reservationsToday}{" "}
          {pluralize(data.reservationsToday, "booking", "bookings")} in the book
          for today and {data.openOrders}{" "}
          {pluralize(data.openOrders, "ticket", "tickets")} still moving on the
          pass.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Covers today"
          value={data.coversToday}
          detail={`${turns} turns of the room's ${TOTAL_COVERS} seats`}
          icon={<Armchair className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Bookings"
          value={data.reservationsToday}
          detail={`${data.seatedNow} seated right now`}
          icon={<BookOpen className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Orders today"
          value={data.ordersToday}
          detail={`${data.openOrders} still open`}
          icon={<UtensilsCrossed className="size-4" aria-hidden="true" />}
        />
        <StatCard
          label="Taken today"
          value={formatAedWithUnit(data.revenueTodayFils)}
          detail={`${formatAedWithUnit(data.averageSpendFils)} average per order`}
          icon={<CircleDollarSign className="size-4" aria-hidden="true" />}
        />
      </div>

      <section
        aria-labelledby="covers-chart-heading"
        className="rounded-lg border border-oud-700 bg-oud-800 p-5"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="covers-chart-heading" className="sf-rail">
            Covers per seating
          </h2>
          <p className="flex items-center gap-4 text-xs text-salt-400">
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2 rounded-xs bg-steel-500"
              />
              Lunch
            </span>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2 rounded-xs bg-saffron-500"
              />
              Dinner
            </span>
          </p>
        </div>
        <div className="mt-5">
          <CoversChart data={data.coversBySlot} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section
          aria-labelledby="upcoming-heading"
          className="rounded-lg border border-oud-700 bg-oud-800"
        >
          <div className="flex items-center justify-between gap-3 p-5">
            <h2 id="upcoming-heading" className="sf-rail">
              Still to arrive
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/reservations">Open the book</Link>
            </Button>
          </div>

          {data.upcoming.length === 0 ? (
            <p className="px-5 pb-6 text-sm text-salt-400">
              Everyone booked for today is either seated or done. The book opens
              again tomorrow.
            </p>
          ) : (
            <ul className="px-5 pb-3">
              {data.upcoming.map((reservation) => {
                const meta = RESERVATION_STATUS_META[reservation.status];
                return (
                  <li
                    key={reservation.id}
                    className="sf-seam flex items-center gap-4 py-3 first:border-t-0"
                  >
                    <span className="tnum w-12 shrink-0 text-salt-100">
                      {formatTime(reservation.seatingAt)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-salt-100">
                        {reservation.guest.name}
                      </span>
                      <span className="block text-xs text-salt-400">
                        {formatCovers(reservation.partySize)}
                        {reservation.specialRequests
                          ? ` · ${reservation.specialRequests}`
                          : ""}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-sm border px-1.5 py-0.5 text-2xs uppercase",
                        meta.className,
                      )}
                    >
                      {meta.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section
          aria-labelledby="live-orders-heading"
          className="rounded-lg border border-oud-700 bg-oud-800"
        >
          <div className="flex items-center justify-between gap-3 p-5">
            <h2 id="live-orders-heading" className="sf-rail">
              On the pass
            </h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">Open the board</Link>
            </Button>
          </div>

          {data.liveOrders.length === 0 ? (
            <p className="px-5 pb-6 text-sm text-salt-400">
              Nothing waiting. Every ticket that came in has gone out.
            </p>
          ) : (
            <ul className="px-5 pb-3">
              {data.liveOrders.map((order) => {
                const meta = ORDER_STATUS_META[order.status];
                const dishes = order.lines.reduce(
                  (sum, line) => sum + line.quantity,
                  0,
                );

                return (
                  <li
                    key={order.id}
                    className="sf-seam flex items-center gap-4 py-3 first:border-t-0"
                  >
                    <span className="tnum w-20 shrink-0 text-sm text-salt-100">
                      {order.reference}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-salt-100">
                        {order.customer.name}
                      </span>
                      <span className="block text-xs text-salt-400">
                        {ORDER_TYPE_LABELS[order.type]} · {dishes}{" "}
                        {pluralize(dishes, "dish", "dishes")}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-sm border px-1.5 py-0.5 text-2xs uppercase",
                        meta.className,
                      )}
                    >
                      {meta.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {data.dishesOffTonight > 0 ? (
        <p className="text-sm text-salt-400">
          {data.dishesOffTonight}{" "}
          {pluralize(data.dishesOffTonight, "dish is", "dishes are")} 86&rsquo;d
          tonight and showing as off on the public menu.{" "}
          <Link
            href="/admin/menu"
            className="rounded-sm text-saffron-300 underline underline-offset-4"
          >
            Open the card
          </Link>
        </p>
      ) : null}
    </div>
  );
}
