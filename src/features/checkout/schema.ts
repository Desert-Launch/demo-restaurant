import { z } from "zod";

import { DELIVERY_AREAS } from "@/lib/house";
import { PHONE_PATTERN } from "@/lib/patterns";

export const checkoutDetailsSchema = z
  .object({
    name: z.string().trim().min(2, "We need a name for the order."),
    phone: z
      .string()
      .trim()
      .regex(
        PHONE_PATTERN,
        "Use a number the kitchen or driver can reach, like +971 50 123 4567.",
      ),
    email: z.email("That email address does not look right."),
    type: z.enum(["pickup", "delivery"]),
    addressLine: z.string().trim(),
    area: z.string().trim(),
    addressNotes: z
      .string()
      .trim()
      .max(200, "Keep the directions under 200 characters."),
  })
  .refine(
    (values) => values.type === "pickup" || values.addressLine.length >= 4,
    {
      path: ["addressLine"],
      message: "The driver needs a building and a flat or villa number.",
    },
  )
  .refine(
    (values) =>
      values.type === "pickup" ||
      (DELIVERY_AREAS as readonly string[]).includes(values.area),
    { path: ["area"], message: "Pick one of the areas we deliver to." },
  );

export type CheckoutDetailsValues = z.infer<typeof checkoutDetailsSchema>;

export const CHECKOUT_DETAILS_DEFAULTS: CheckoutDetailsValues = {
  name: "",
  phone: "",
  email: "",
  type: "pickup",
  addressLine: "",
  area: "",
  addressNotes: "",
};
