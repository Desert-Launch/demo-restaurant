import { z } from "zod";

import { PHONE_PATTERN } from "@/lib/patterns";
import { DELIVERY_AREAS } from "@/lib/house";

export const cancelOrderSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(4, "Say why in a few words — it shows on the ticket.")
    .max(160, "Keep it under 160 characters."),
});

export type CancelOrderValues = z.infer<typeof cancelOrderSchema>;

/** The admin's phone-order form. Same shape as checkout, fewer steps. */
export const phoneOrderSchema = z
  .object({
    name: z.string().trim().min(2, "Take a name for the order."),
    phone: z
      .string()
      .trim()
      .regex(PHONE_PATTERN, "Take a number the driver can call."),
    type: z.enum(["pickup", "delivery"]),
    addressLine: z.string().trim(),
    area: z.string().trim(),
    staffNote: z.string().trim().max(200, "Keep the note under 200 characters."),
  })
  .refine(
    (values) => values.type === "pickup" || values.addressLine.length >= 4,
    { path: ["addressLine"], message: "A delivery needs somewhere to go." },
  )
  .refine(
    (values) =>
      values.type === "pickup" ||
      (DELIVERY_AREAS as readonly string[]).includes(values.area),
    { path: ["area"], message: "Pick an area we deliver to." },
  );

export type PhoneOrderValues = z.infer<typeof phoneOrderSchema>;

export const PHONE_ORDER_DEFAULTS: PhoneOrderValues = {
  name: "",
  phone: "",
  type: "pickup",
  addressLine: "",
  area: "",
  staffNote: "",
};
