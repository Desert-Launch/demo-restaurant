import { z } from "zod";

import { DISH_TAGS, MENU_COURSES } from "@/types";

/**
 * The admin's dish form. Prices are entered in whole dirhams because that is
 * how the kitchen thinks about them; the api layer converts to fils.
 */
export const menuItemFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Give the dish a name.")
    .max(60, "Keep the name under 60 characters."),
  arabicName: z
    .string()
    .trim()
    .max(60, "Keep the Arabic name under 60 characters."),
  code: z
    .string()
    .trim()
    .regex(
      /^[A-Z]{2}-[0-9]{2}$/,
      "Codes look like MZ-04: two letters, a dash, two digits.",
    ),
  description: z
    .string()
    .trim()
    .min(10, "Say what is in it — at least ten characters.")
    .max(220, "Keep it under 220 characters so it fits the card."),
  course: z.enum(MENU_COURSES),
  priceAed: z
    .number({ message: "Enter a price in dirhams." })
    .int("Menu prices are whole dirhams.")
    .min(1, "Enter a price of at least AED 1.")
    .max(2000, "That is over AED 2,000 — check the number."),
  tags: z.array(z.enum(DISH_TAGS)),
  available: z.boolean(),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

export const MENU_ITEM_FORM_DEFAULTS: MenuItemFormValues = {
  name: "",
  arabicName: "",
  code: "",
  description: "",
  course: "mezze",
  priceAed: 40,
  tags: [],
  available: true,
};
