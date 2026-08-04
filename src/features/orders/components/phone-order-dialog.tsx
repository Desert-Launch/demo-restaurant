"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { Field, fieldAria } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COURSE_META, useMenu } from "@/features/menu";
import { computeTotals } from "@/lib/pricing";
import { DELIVERY_AREAS } from "@/lib/house";
import type { CartLine } from "@/types";
import { cn, formatAedWithUnit } from "@/lib/utils";
import { usePlaceOrder } from "../hooks/use-orders";
import { PHONE_ORDER_DEFAULTS, phoneOrderSchema, type PhoneOrderValues } from "../schema";

/**
 * Taking an order over the phone. Same write path as the guest checkout — it
 * goes through placeOrder — it just arrives on the board flagged as a phone
 * order rather than an online one.
 */
export function PhoneOrderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const baseId = useId();
  const ids = {
    name: `${baseId}-name`,
    phone: `${baseId}-phone`,
    type: `${baseId}-type`,
    address: `${baseId}-address`,
    area: `${baseId}-area`,
    note: `${baseId}-note`,
  };

  const { data: menu } = useMenu();
  const [picked, setPicked] = useState<Record<string, number>>({});

  const form = useForm<PhoneOrderValues>({
    resolver: zodResolver(phoneOrderSchema),
    defaultValues: PHONE_ORDER_DEFAULTS,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      form.reset(PHONE_ORDER_DEFAULTS);
      setPicked({});
    }
  }, [open, form]);

  const place = usePlaceOrder();
  const type = form.watch("type");
  const errors = form.formState.errors;

  const available = useMemo(
    () => (menu ?? []).filter((item) => item.available),
    [menu],
  );

  const lines: CartLine[] = useMemo(
    () =>
      available
        .filter((item) => (picked[item.id] ?? 0) > 0)
        .map((item) => ({
          lineId: item.id,
          menuItemId: item.id,
          code: item.code,
          name: item.name,
          course: item.course,
          unitPriceFils: item.priceFils,
          quantity: picked[item.id] ?? 0,
          note: "",
        })),
    [available, picked],
  );

  const totals = computeTotals(lines, type);

  function bump(id: string, by: number) {
    setPicked((current) => {
      const next = Math.max(0, (current[id] ?? 0) + by);
      const copy = { ...current };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }

  function onSubmit(values: PhoneOrderValues) {
    if (lines.length === 0) {
      toast.error("Nothing on the order yet", {
        description: "Add at least one dish before sending it to the kitchen.",
      });
      return;
    }

    place.mutate(
      {
        type: values.type,
        channel: "phone",
        customer: {
          name: values.name,
          phone: values.phone,
          email: "",
          address:
            values.type === "delivery"
              ? {
                  line1: values.addressLine,
                  area: values.area,
                  city: "Dubai",
                  notes: "",
                }
              : null,
        },
        lines,
        scheduledFor: null,
        staffNote: values.staffNote,
      },
      {
        onSuccess: (order) => {
          onOpenChange(false);
          toast.success(`${order.reference} is on the pass`);
        },
        onError: (error) =>
          toast.error("That did not go through", {
            description: error.message,
          }),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Take an order by phone
          </DialogTitle>
          <DialogDescription>
            It lands on the board as a new ticket, exactly like an online one.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor={ids.name} error={errors.name?.message}>
              <Input
                id={ids.name}
                {...fieldAria(ids.name, errors.name?.message)}
                {...form.register("name")}
              />
            </Field>

            <Field label="Phone" htmlFor={ids.phone} error={errors.phone?.message}>
              <Input
                id={ids.phone}
                type="tel"
                {...fieldAria(ids.phone, errors.phone?.message)}
                {...form.register("phone")}
              />
            </Field>

            <Field label="Collecting or delivering" htmlFor={ids.type}>
              <Select
                value={type}
                onValueChange={(value) =>
                  form.setValue("type", value as PhoneOrderValues["type"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id={ids.type} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Collecting</SelectItem>
                  <SelectItem value="delivery">Delivering</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {type === "delivery" ? (
              <>
                <Field
                  label="Area"
                  htmlFor={ids.area}
                  error={errors.area?.message}
                >
                  <Select
                    value={form.watch("area")}
                    onValueChange={(value) =>
                      form.setValue("area", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger id={ids.area} className="w-full">
                      <SelectValue placeholder="Choose an area" />
                    </SelectTrigger>
                    <SelectContent>
                      {DELIVERY_AREAS.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field
                  label="Building, flat or villa"
                  htmlFor={ids.address}
                  error={errors.addressLine?.message}
                  className="sm:col-span-2"
                >
                  <Input
                    id={ids.address}
                    {...fieldAria(ids.address, errors.addressLine?.message)}
                    {...form.register("addressLine")}
                  />
                </Field>
              </>
            ) : null}

            <Field
              label="Note for the pass"
              htmlFor={ids.note}
              error={errors.staffNote?.message}
              className="sm:col-span-2"
            >
              <Textarea
                id={ids.note}
                rows={2}
                {...fieldAria(ids.note, errors.staffNote?.message)}
                {...form.register("staffNote")}
              />
            </Field>
          </div>

          <div>
            <p className="sf-rail">The order</p>
            <div className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-oud-700">
              <ul>
                {available.map((item) => {
                  const quantity = picked[item.id] ?? 0;
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        "sf-seam flex items-center gap-3 px-3 py-2 first:border-t-0",
                        quantity > 0 && "bg-saffron-950/40",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-salt-100">
                          {item.name}
                        </span>
                        <span className="tnum block text-2xs text-salt-400">
                          {COURSE_META[item.course].label} ·{" "}
                          {formatAedWithUnit(item.priceFils)}
                        </span>
                      </span>
                      <span className="flex items-center rounded-md border border-oud-600">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-r-none"
                          onClick={() => bump(item.id, -1)}
                        >
                          <Minus className="size-3" aria-hidden="true" />
                          <span className="sr-only">One fewer {item.name}</span>
                        </Button>
                        <span className="tnum w-7 text-center text-xs text-salt-100">
                          {quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-l-none"
                          onClick={() => bump(item.id, 1)}
                        >
                          <Plus className="size-3" aria-hidden="true" />
                          <span className="sr-only">One more {item.name}</span>
                        </Button>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <p aria-live="polite" className="tnum mt-3 text-sm text-salt-300">
              {lines.length === 0
                ? "Nothing on it yet."
                : `Total ${formatAedWithUnit(totals.totalFils)}`}
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={place.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={place.isPending}>
              {place.isPending ? "Sending…" : "Send it to the kitchen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
