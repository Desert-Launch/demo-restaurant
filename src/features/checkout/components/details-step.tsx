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
import { DELIVERY_AREAS } from "@/lib/house";
import type { OrderType } from "@/types";
import {
  CHECKOUT_DETAILS_DEFAULTS,
  checkoutDetailsSchema,
  type CheckoutDetailsValues,
} from "../schema";

export function DetailsStep({
  type,
  values,
  onBack,
  onSubmit,
}: {
  type: OrderType;
  values: CheckoutDetailsValues | null;
  onBack: () => void;
  onSubmit: (values: CheckoutDetailsValues) => void;
}) {
  const baseId = useId();
  const ids = {
    name: `${baseId}-name`,
    phone: `${baseId}-phone`,
    email: `${baseId}-email`,
    address: `${baseId}-address`,
    area: `${baseId}-area`,
    notes: `${baseId}-notes`,
  };

  const form = useForm<CheckoutDetailsValues>({
    resolver: zodResolver(checkoutDetailsSchema),
    // `type` is carried by the wizard, not chosen here, but it has to be in the
    // form values so the address rules know whether they apply.
    defaultValues: { ...(values ?? CHECKOUT_DETAILS_DEFAULTS), type },
    mode: "onBlur",
  });

  const errors = form.formState.errors;
  const isDelivery = type === "delivery";

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((submitted) =>
        onSubmit({ ...submitted, type }),
      )}
    >
      <h2 className="font-display text-3xl font-semibold text-salt-50">
        {isDelivery ? "Where is it going?" : "Who is collecting?"}
      </h2>
      <p className="mt-3 max-w-md text-salt-300">
        {isDelivery
          ? "The driver calls when they are outside. Tell us anything that makes finding you easier."
          : "We will have it bagged and waiting under this name."}
      </p>

      <input type="hidden" {...form.register("type")} value={type} readOnly />

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

        {isDelivery ? (
          <>
            <Field
              label="Building, flat or villa"
              htmlFor={ids.address}
              error={errors.addressLine?.message}
              className="sm:col-span-2"
            >
              <Input
                id={ids.address}
                autoComplete="address-line1"
                placeholder="Tower 3, apartment 1204"
                {...fieldAria(ids.address, errors.addressLine?.message)}
                {...form.register("addressLine")}
              />
            </Field>

            <Field
              label="Area"
              htmlFor={ids.area}
              error={errors.area?.message}
              className="sm:col-span-2"
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
              label="Anything that helps the driver"
              htmlFor={ids.notes}
              hint="Gate codes, a landmark, which entrance."
              error={errors.addressNotes?.message}
              className="sm:col-span-2"
            >
              <Textarea
                id={ids.notes}
                rows={3}
                {...fieldAria(
                  ids.notes,
                  errors.addressNotes?.message,
                  "Gate codes, a landmark, which entrance",
                )}
                {...form.register("addressNotes")}
              />
            </Field>
          </>
        ) : null}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" size="lg">
          Choose a time
        </Button>
      </div>
    </form>
  );
}
