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
import type { Order } from "@/types";
import { useCancelOrder } from "../hooks/use-orders";
import { cancelOrderSchema, type CancelOrderValues } from "../schema";

/**
 * Cancelling refunds a card in the real product, so it is the one write on the
 * board allowed to fail — see CANCEL_FAILURE_RATE in the orders api. The ticket
 * moves to Cancelled optimistically and comes back with an error toast roughly
 * one time in ten.
 */
export function CancelOrderDialog({
  order,
  onOpenChange,
}: {
  order: Order | null;
  onOpenChange: (open: boolean) => void;
}) {
  const reasonId = useId();
  const form = useForm<CancelOrderValues>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: { reason: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    if (order) form.reset({ reason: "" });
  }, [order, form]);

  const cancel = useCancelOrder();

  if (!order) return null;

  function onSubmit(values: CancelOrderValues) {
    if (!order) return;
    const reference = order.reference;

    onOpenChange(false);
    cancel.mutate(
      { id: order.id, reason: values.reason },
      {
        onSuccess: () => toast.success(`${reference} cancelled`),
        onError: (error) =>
          toast.error(`${reference} is still open`, {
            description: error.message,
          }),
      },
    );
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Cancel {order.reference}?
          </DialogTitle>
          <DialogDescription>
            {order.customer.name}&rsquo;s order comes off the pass. The kitchen
            stops whatever is still on it.
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
            hint="Saved on the ticket so the next person to look knows."
            error={form.formState.errors.reason?.message}
          >
            <Textarea
              id={reasonId}
              rows={3}
              placeholder="Hammour sold out and the guest did not want a substitute."
              {...fieldAria(
                reasonId,
                form.formState.errors.reason?.message,
                "Saved on the ticket",
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
              className="bg-rumman-500 text-salt-50 hover:bg-rumman-600"
            >
              Cancel the order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
