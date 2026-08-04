import { z } from "zod";

import { PHONE_PATTERN } from "@/lib/patterns";

export const CONTACT_TOPICS = [
  "general",
  "large-party",
  "private-hire",
  "feedback",
  "press",
] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const CONTACT_TOPIC_LABELS: Record<ContactTopic, string> = {
  general: "A general question",
  "large-party": "A party of more than eight",
  "private-hire": "Taking the whole room",
  feedback: "Something about a visit",
  press: "Press or photography",
};

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Tell us who you are."),
  email: z.email("That email address does not look right."),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Use a number we can call back on, like +971 50 123 4567.")
    .or(z.literal("")),
  topic: z.enum(CONTACT_TOPICS),
  message: z
    .string()
    .trim()
    .min(12, "A sentence or two is enough — at least twelve characters.")
    .max(1200, "Keep it under 1,200 characters."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const CONTACT_FORM_DEFAULTS: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  topic: "general",
  message: "",
};
