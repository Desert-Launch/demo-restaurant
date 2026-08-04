"use client";

import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { formatCovers, formatTime } from "@/lib/utils";
import type { Reservation } from "@/types";
import { useCancelReservation } from "../hooks/use-reservations";
import {
  cancelReservationSchema,
  type CancelReservationValues,
} from "../schema";

/**
 * Cancelling is the one write in this demo allowed to fail. The row moves to
 * Cancelled straight away and comes back with an error toast roughly one time
 * in ten — see CANCEL_FAILURE_RATE in the reservations api.
 */
export function CancelReservationDialog({
  open,
  onOpenChange,
  reservation,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
}) {
  const reasonId = useId();
  const form = useForm<CancelReservationValues>({
    resolver: zodResolver(cancelReservationSchema),
    defaultValues: { reason: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) form.reset({ reason: "" });
  }, [open, form]);

  const cancel = useCancelReservation();

  if (!reservation) return null;

  function onSubmit(values: CancelReservationValues) {
    if (!reservation) return;
    const { guest } = reservation;

    onOpenChange(false);
    cancel.mutate(
      { id: reservation.id, reason: values.reason },
      {
        onSuccess: () =>
          toast.success(`${guest.name}'s table is back in the room`),
        onError: (error) =>
          toast.error("The booking is still live", {
            description: error.message,
          }),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Cancel this booking?
          </DialogTitle>
          <DialogDescription>
            {reservation.guest.name}, {formatCovers(reservation.partySize)} at{" "}
            {formatTime(reservation.seatingAt)}. The table goes straight back
            into the room.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <Field
            label="Why"
            htmlFor={reasonId}
            hint="Saved on the booking so the next person to look knows."
            error={form.formState.errors.reason?.message}
          >
            <Textarea
              id={reasonId}
              rows={3}
              placeholder="Guest called, plans changed."
              {...fieldAria(
                reasonId,
                form.formState.errors.reason?.message,
                "Saved on the booking",
              )}
              {...form.register("reason")}
            />
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Keep it
            </Button>
            <Button
              type="submit"
              className="bg-rumman-600 text-salt-50 hover:bg-rumman-700"
            >
              Cancel the booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
