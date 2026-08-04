"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MoreHorizontal, Plus, Search } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MENU_COURSES, type MenuCourse, type MenuItem } from "@/types";
import { formatAedWhole, pluralize } from "@/lib/utils";
import {
  useDeleteMenuItem,
  useMenu,
  useSetMenuItemAvailability,
} from "../hooks/use-menu";
import { COURSE_META } from "../taxonomy";
import { MenuItemFormDialog } from "./menu-item-form-dialog";
import { Plate } from "./plate";
import { TagChip } from "./tag-chip";

type CourseFilter = "all" | MenuCourse;

export function AdminMenuTable() {
  const { data: menu, isPending, isError, error, refetch } = useMenu();
  const [course, setCourse] = useState<CourseFilter>("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<MenuItem | null>(null);

  const toggle = useSetMenuItemAvailability();
  const remove = useDeleteMenuItem();
  const reduced = useReducedMotion();

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (menu ?? [])
      .filter((item) => {
        if (course !== "all" && item.course !== course) return false;
        if (!query) return true;
        return `${item.name} ${item.code} ${item.arabicName}`
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        const byCourse =
          MENU_COURSES.indexOf(a.course) - MENU_COURSES.indexOf(b.course);
        return byCourse !== 0 ? byCourse : a.code.localeCompare(b.code);
      });
  }, [menu, course, search]);

  if (isError) {
    return (
      <EmptyState
        title="The card did not load"
        description={error.message}
        action={
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  const toolbar = (
    <div className="flex flex-wrap items-end gap-3">
      <div className="relative min-w-56 flex-1">
        <label htmlFor="menu-search" className="sf-rail">
          Search
        </label>
        <Search
          className="pointer-events-none absolute top-9 left-3 size-4 text-salt-400"
          aria-hidden="true"
        />
        <Input
          id="menu-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Dish or code"
          className="mt-2 pl-9"
        />
      </div>

      <div>
        <label htmlFor="menu-course" className="sf-rail">
          Course
        </label>
        <Select
          value={course}
          onValueChange={(value) => setCourse(value as CourseFilter)}
        >
          <SelectTrigger id="menu-course" className="mt-2 w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Every course</SelectItem>
            {MENU_COURSES.map((option) => (
              <SelectItem key={option} value={option}>
                {COURSE_META[option].label}
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
        <Plus aria-hidden="true" /> Add a dish
      </Button>
    </div>
  );

  return (
    <div>
      <DataTableShell
        toolbar={toolbar}
        count={rows.length}
        countLabel={pluralize(rows.length, "dish", "dishes")}
      >
        {isPending ? (
          <div className="space-y-2 p-4" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            className="m-4 border-0"
            title="Nothing on the card matches"
            description="Clear the search or pick another course."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setCourse("all");
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
                <TableHead className="w-16">Dish</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-28">Course</TableHead>
                <TableHead className="w-24 text-right">Price</TableHead>
                <TableHead className="w-28">On tonight</TableHead>
                <TableHead className="w-12 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}>
                {rows.map((item) => (
                  <motion.tr
                    key={item.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, height: 0, y: -6 }}
                    transition={{ duration: reduced ? 0 : 0.2 }}
                    className="border-b border-oud-700 last:border-0 hover:bg-oud-750/60"
                  >
                    <TableCell className="align-top">
                      <Plate
                        course={item.course}
                        unavailable={!item.available}
                        className="size-9"
                      />
                    </TableCell>

                    <TableCell className="align-top">
                      <span className="block text-salt-50">{item.name}</span>
                      <span className="tnum block text-xs text-salt-400">
                        {item.code}
                      </span>
                      {item.tags.length > 0 ? (
                        <span className="mt-1.5 flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <TagChip key={tag} tag={tag} />
                          ))}
                        </span>
                      ) : null}
                    </TableCell>

                    <TableCell className="align-top text-sm text-salt-300">
                      {COURSE_META[item.course].label}
                    </TableCell>

                    <TableCell className="tnum align-top text-right text-salt-100">
                      {formatAedWhole(item.priceFils)}
                    </TableCell>

                    <TableCell className="align-top">
                      <Switch
                        checked={item.available}
                        onCheckedChange={(checked) =>
                          toggle.mutate(
                            { id: item.id, available: checked },
                            {
                              onSuccess: () =>
                                toast.success(
                                  checked
                                    ? `${item.name} is back on`
                                    : `${item.name} is 86'd`,
                                  {
                                    description: checked
                                      ? "It is orderable again on the public menu."
                                      : "It now shows as off on the public menu.",
                                  },
                                ),
                              onError: (mutationError) =>
                                toast.error("That did not stick", {
                                  description: mutationError.message,
                                }),
                            },
                          )
                        }
                        aria-label={`${item.name} is ${item.available ? "on" : "off"} tonight`}
                      />
                    </TableCell>

                    <TableCell className="align-top text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal
                              className="size-4"
                              aria-hidden="true"
                            />
                            <span className="sr-only">
                              Actions for {item.name}
                            </span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onSelect={() => {
                              setEditing(item);
                              setFormOpen(true);
                            }}
                          >
                            Edit the dish
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={() => setDeleting(item)}
                            className="text-rumman-300"
                          >
                            Take it off the card
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
      </DataTableShell>

      <MenuItemFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editing}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Take this dish off the card?"
        description={
          deleting
            ? `${deleting.name} disappears from the public menu entirely. If it is just off tonight, use the switch instead.`
            : ""
        }
        confirmLabel="Take it off"
        pending={remove.isPending}
        onConfirm={() => {
          if (!deleting) return;
          const name = deleting.name;
          remove.mutate(deleting.id, {
            onSuccess: () => {
              setDeleting(null);
              toast.success(`${name} is off the card`);
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
