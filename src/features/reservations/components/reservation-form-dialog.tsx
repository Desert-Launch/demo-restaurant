"use client";

import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import { SERVICES } from "@/lib/house";
import {
  MAX_PARTY_SIZE,
  OCCASIONS,
  RESERVATION_STATUSES,
  SLOT_MINUTES,
  type Reservation,
} from "@/types";
import {
  useBookReservation,
  useUpdateReservation,
} from "../hooks/use-reservations";
import {
  reservationFormSchema,
  type ReservationFormValues,
} from "../schema";
import { OCCASION_LABELS, RESERVATION_STATUS_META } from "../status";

/** Every seating time the room offers, as "HH:MM". */
const SEATING_TIMES = SERVICES.flatMap((service) => {
  const times: string[] = [];
  for (
    let minutes = service.opensAt;
    minutes <= service.lastSeating;
    minutes += SLOT_MINUTES
  ) {
    const hour = Math.floor(minutes / 60);
    times.push(
      `${String(hour).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`,
    );
  }
  return times;
});

function toFormValues(reservation: Reservation | null): ReservationFormValues {
  if (!reservation) {
    return {
      name: "",
      phone: "",
      email: "",
      occasion: "none",
      specialRequests: "",
      partySize: 2,
      date: format(new Date(), "yyyy-MM-dd"),
      time: SEATING_TIMES[SEATING_TIMES.length - 1] ?? "19:30",
      status: "booked",
      staffNote: "",
    };
  }

  const seatingAt = new Date(reservation.seatingAt);
  return {
    name: reservation.guest.name,
    phone: reservation.guest.phone,
    email: reservation.guest.email,
    occasion: reservation.occasion,
    specialRequests: reservation.specialRequests,
    partySize: reservation.partySize,
    date: format(seatingAt, "yyyy-MM-dd"),
    time: format(seatingAt, "HH:mm"),
    status: reservation.status,
    staffNote: reservation.staffNote,
  };
}

export function ReservationFormDialog({
  open,
  onOpenChange,
  reservation,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null opens the dialog as a create form. */
  reservation: Reservation | null;
}) {
  const baseId = useId();
  const ids = {
    name: `${baseId}-name`,
    phone: `${baseId}-phone`,
    email: `${baseId}-email`,
    party: `${baseId}-party`,
    date: `${baseId}-date`,
    time: `${baseId}-time`,
    status: `${baseId}-status`,
    occasion: `${baseId}-occasion`,
    requests: `${baseId}-requests`,
    note: `${baseId}-note`,
  };

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: toFormValues(reservation),
    mode: "onBlur",
  });

  // The dialog is mounted once and reused for every row, so the form has to be
  // refilled whenever it is opened against a different booking.
  useEffect(() => {
    if (open) form.reset(toFormValues(reservation));
  }, [open, reservation, form]);

  const create = useBookReservation();
  const update = useUpdateReservation();
  const pending = create.isPending || update.isPending;
  const errors = form.formState.errors;

  function onSubmit(values: ReservationFormValues) {
    const seatingAt = new Date(`${values.date}T${values.time}:00`).toISOString();
    const guest = {
      name: values.name,
      phone: values.phone,
      email: values.email,
    };

    if (reservation) {
      update.mutate(
        {
          id: reservation.id,
          input: {
            guest,
            partySize: values.partySize,
            seatingAt,
            occasion: values.occasion,
            specialRequests: values.specialRequests,
            staffNote: values.staffNote,
            status: values.status,
          },
        },
        {
          onSuccess: (saved) => {
            onOpenChange(false);
            toast.success(`${saved.guest.name}'s booking updated`);
          },
          onError: (error) =>
            toast.error("That did not save", { description: error.message }),
        },
      );
      return;
    }

    create.mutate(
      {
        guest,
        partySize: values.partySize,
        seatingAt,
        occasion: values.occasion,
        specialRequests: values.specialRequests,
        staffNote: values.staffNote,
        status: values.status,
      },
      {
        onSuccess: (saved) => {
          onOpenChange(false);
          toast.success(`Booked — ${saved.reference}`, {
            description: `${saved.guest.name}, ${saved.partySize} at ${values.time}.`,
          });
        },
        onError: (error) =>
          toast.error("That did not book", { description: error.message }),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {reservation ? "Edit the booking" : "Take a booking"}
          </DialogTitle>
          <DialogDescription>
            {reservation
              ? `${reservation.reference} — changes land everywhere straight away.`
              : "For a call or a walk-in. The room is re-checked before it saves."}
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Guest name"
              htmlFor={ids.name}
              error={errors.name?.message}
              className="sm:col-span-2"
            >
              <Input id={ids.name} {...fieldAria(ids.name, errors.name?.message)} {...form.register("name")} />
            </Field>

            <Field label="Phone" htmlFor={ids.phone} error={errors.phone?.message}>
              <Input id={ids.phone} type="tel" {...fieldAria(ids.phone, errors.phone?.message)} {...form.register("phone")} />
            </Field>

            <Field label="Email" htmlFor={ids.email} error={errors.email?.message}>
              <Input id={ids.email} type="email" {...fieldAria(ids.email, errors.email?.message)} {...form.register("email")} />
            </Field>

            <Field
              label="Party size"
              htmlFor={ids.party}
              error={errors.partySize?.message}
            >
              <Input
                id={ids.party}
                type="number"
                min={1}
                max={MAX_PARTY_SIZE}
                {...fieldAria(ids.party, errors.partySize?.message)}
                {...form.register("partySize", { valueAsNumber: true })}
              />
            </Field>

            <Field label="Date" htmlFor={ids.date} error={errors.date?.message}>
              <Input id={ids.date} type="date" {...fieldAria(ids.date, errors.date?.message)} {...form.register("date")} />
            </Field>

            <Field label="Seating" htmlFor={ids.time} error={errors.time?.message}>
              <Select
                value={form.watch("time")}
                onValueChange={(value) =>
                  form.setValue("time", value, { shouldValidate: true })
                }
              >
                <SelectTrigger id={ids.time} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEATING_TIMES.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Status" htmlFor={ids.status}>
              <Select
                value={form.watch("status")}
                onValueChange={(value) =>
                  form.setValue(
                    "status",
                    value as ReservationFormValues["status"],
                    { shouldValidate: true },
                  )
                }
              >
                <SelectTrigger id={ids.status} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESERVATION_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {RESERVATION_STATUS_META[status].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Occasion" htmlFor={ids.occasion}>
              <Select
                value={form.watch("occasion")}
                onValueChange={(value) =>
                  form.setValue(
                    "occasion",
                    value as ReservationFormValues["occasion"],
                    { shouldValidate: true },
                  )
                }
              >
                <SelectTrigger id={ids.occasion} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OCCASIONS.map((occasion) => (
                    <SelectItem key={occasion} value={occasion}>
                      {OCCASION_LABELS[occasion]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Guest requests"
              htmlFor={ids.requests}
              error={errors.specialRequests?.message}
              className="sm:col-span-2"
            >
              <Textarea
                id={ids.requests}
                rows={2}
                {...fieldAria(ids.requests, errors.specialRequests?.message)}
                {...form.register("specialRequests")}
              />
            </Field>

            <Field
              label="Note for the floor"
              htmlFor={ids.note}
              hint="Only staff see this."
              error={errors.staffNote?.message}
              className="sm:col-span-2"
            >
              <Textarea
                id={ids.note}
                rows={2}
                {...fieldAria(ids.note, errors.staffNote?.message, "Only staff see this")}
                {...form.register("staffNote")}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending
                ? "Saving…"
                : reservation
                  ? "Save the booking"
                  : "Take the booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
