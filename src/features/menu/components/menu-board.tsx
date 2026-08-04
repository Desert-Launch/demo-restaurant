"use client";

import { useMemo, useState } from "react";
import { UtensilsCrossed } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { MenuItem } from "@/types";
import { cn, pluralize } from "@/lib/utils";
import { useMenu } from "../hooks/use-menu";
import {
  COURSE_META,
  COURSE_ORDER,
  DIETARY_FILTERS,
  type DietaryFilterId,
} from "../taxonomy";
import { DishRow } from "./dish-row";

function matchesFilters(item: MenuItem, active: readonly DietaryFilterId[]) {
  return active.every((id) => {
    const filter = DIETARY_FILTERS.find((entry) => entry.id === id);
    if (!filter) return true;
    if ("requires" in filter) return item.tags.includes(filter.requires);
    return !item.tags.includes(filter.excludes);
  });
}

export function MenuBoard() {
  const { data: menu, isPending, isError, error, refetch } = useMenu();
  const [active, setActive] = useState<DietaryFilterId[]>([]);

  const byCourse = useMemo(() => {
    const filtered = (menu ?? []).filter((item) => matchesFilters(item, active));
    return COURSE_ORDER.map((course) => ({
      course,
      items: filtered.filter((item) => item.course === course),
    }));
  }, [menu, active]);

  const matchCount = byCourse.reduce((sum, group) => sum + group.items.length, 0);

  function toggle(id: DietaryFilterId) {
    setActive((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="The menu did not load"
        description={error.message}
        action={
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Dietary filters"
        className="flex flex-wrap items-center gap-2"
      >
        {DIETARY_FILTERS.map((filter) => {
          const on = active.includes(filter.id);
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(filter.id)}
              className={cn(
                "rounded-pill border px-3.5 py-1.5 text-sm transition-colors",
                on
                  ? "border-saffron-500 bg-saffron-950 text-saffron-200"
                  : "border-oud-600 text-salt-300 hover:border-oud-500 hover:text-salt-50",
              )}
            >
              {filter.label}
            </button>
          );
        })}
        {active.length > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActive([])}
            className="text-salt-400"
          >
            Clear
          </Button>
        ) : null}
      </div>

      <p aria-live="polite" className="mt-4 text-sm text-salt-400">
        {isPending
          ? "Loading the card…"
          : `${matchCount} ${pluralize(matchCount, "dish", "dishes")}${
              active.length > 0 ? " match your filters" : " on tonight"
            }.`}
      </p>

      {isPending ? <MenuSkeleton /> : null}

      {!isPending && matchCount === 0 ? (
        <EmptyState
          className="mt-10"
          icon={<UtensilsCrossed className="size-6" aria-hidden="true" />}
          title="Nothing matches all of those"
          description="Drop a filter and the card will fill back up. Tell us at the table and the kitchen will adapt most dishes."
          action={
            <Button variant="outline" onClick={() => setActive([])}>
              Clear filters
            </Button>
          }
        />
      ) : null}

      <div className="mt-10 space-y-20">
        {byCourse.map(({ course, items }) => {
          if (items.length === 0) return null;
          const meta = COURSE_META[course];

          return (
            <section
              key={course}
              id={course}
              aria-labelledby={`${course}-heading`}
              className="scroll-mt-24"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-oud-600 pb-4">
                <h2
                  id={`${course}-heading`}
                  className="font-display text-3xl font-semibold text-salt-50"
                >
                  {meta.label}
                </h2>
                <p
                  lang="ar"
                  dir="rtl"
                  aria-hidden="true"
                  className="font-display text-2xl text-saffron-500/70"
                >
                  {meta.arabicLabel}
                </p>
                <p className="w-full text-sm text-salt-400">{meta.blurb}</p>
              </div>

              <ul className="mt-2">
                {items.map((item) => (
                  <DishRow key={item.id} item={item} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="mt-10 space-y-6" aria-hidden="true">
      <Skeleton className="h-9 w-40" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex gap-5 py-4">
          <Skeleton className="size-14 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
