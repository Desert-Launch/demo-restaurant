"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, fieldAria } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OCCASIONS } from "@/types";
import { OCCASION_LABELS } from "../status";
import {
  GUEST_DETAILS_DEFAULTS,
  guestDetailsSchema,
  type GuestDetailsValues,
} from "../schema";

export function DetailsStep({
  values,
  onBack,
  onSubmit,
}: {
  values: GuestDetailsValues | null;
  onBack: () => void;
  onSubmit: (values: GuestDetailsValues) => void;
}) {
  const baseId = useId();
  const ids = {
    name: `${baseId}-name`,
    phone: `${baseId}-phone`,
    email: `${baseId}-email`,
    occasion: `${baseId}-occasion`,
    requests: `${baseId}-requests`,
  };

  const form = useForm<GuestDetailsValues>({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: values ?? GUEST_DETAILS_DEFAULTS,
    mode: "onBlur",
  });

  const errors = form.formState.errors;

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <h2 className="font-display text-3xl font-semibold text-salt-50">
        Who is the table for?
      </h2>
      <p className="mt-3 max-w-md text-salt-300">
        We hold the table for fifteen minutes past the booking time. If you are
        running late, call the room.
      </p>

      <div className="mt-8 grid max-w-2xl gap-6 sm:grid-cols-2">
        <Field
          label="Name"
          htmlFor={ids.name}
          error={errors.name?.message}
          className="sm:col-span-2"
        >
          <Input
            id={ids.name}
            autoComplete="name"
            {...fieldAria(ids.name, errors.name?.message)}
            {...form.register("name")}
          />
        </Field>

        <Field label="Phone" htmlFor={ids.phone} error={errors.phone?.message}>
          <Input
            id={ids.phone}
            type="tel"
            autoComplete="tel"
            placeholder="+971 50 123 4567"
            {...fieldAria(ids.phone, errors.phone?.message)}
            {...form.register("phone")}
          />
        </Field>

        <Field label="Email" htmlFor={ids.email} error={errors.email?.message}>
          <Input
            id={ids.email}
            type="email"
            autoComplete="email"
            {...fieldAria(ids.email, errors.email?.message)}
            {...form.register("email")}
          />
        </Field>

        <Field
          label="Occasion"
          htmlFor={ids.occasion}
          hint="Optional. It tells the kitchen whether to send something out."
          className="sm:col-span-2"
        >
          <Select
            value={form.watch("occasion")}
            onValueChange={(value) =>
              form.setValue("occasion", value as GuestDetailsValues["occasion"], {
                shouldValidate: true,
              })
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
          label="Anything we should know"
          htmlFor={ids.requests}
          hint="Allergies, a high chair, somewhere quiet — anything at all."
          error={errors.specialRequests?.message}
          className="sm:col-span-2"
        >
          <Textarea
            id={ids.requests}
            rows={4}
            {...fieldAria(
              ids.requests,
              errors.specialRequests?.message,
              "Allergies, a high chair, somewhere quiet",
            )}
            {...form.register("specialRequests")}
          />
        </Field>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg">
          Review the booking
        </Button>
      </div>
    </form>
  );
}
