"use client";

import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
import { sendContactMessage } from "../api";
import {
  CONTACT_FORM_DEFAULTS,
  CONTACT_TOPICS,
  CONTACT_TOPIC_LABELS,
  contactFormSchema,
  type ContactFormValues,
} from "../schema";

export function ContactForm() {
  const baseId = useId();
  const ids = {
    name: `${baseId}-name`,
    email: `${baseId}-email`,
    phone: `${baseId}-phone`,
    topic: `${baseId}-topic`,
    message: `${baseId}-message`,
  };

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: CONTACT_FORM_DEFAULTS,
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: (result) => {
      form.reset(CONTACT_FORM_DEFAULTS);
      toast.success(`Thanks, ${result.name.split(" ")[0]} — that reached us`, {
        description:
          "Someone from the room replies within a day. Nothing was actually sent: this is a demo.",
      });
    },
    onError: () => {
      toast.error("That did not send", {
        description: "Nothing left your browser. Try again in a moment.",
      });
    },
  });

  const errors = form.formState.errors;

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      className="space-y-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" htmlFor={ids.name} error={errors.name?.message}>
          <Input
            id={ids.name}
            autoComplete="name"
            {...fieldAria(ids.name, errors.name?.message)}
            {...form.register("name")}
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
          label="Phone"
          htmlFor={ids.phone}
          hint="Optional — only if you would rather we called."
          error={errors.phone?.message}
        >
          <Input
            id={ids.phone}
            type="tel"
            autoComplete="tel"
            {...fieldAria(ids.phone, errors.phone?.message, "Optional")}
            {...form.register("phone")}
          />
        </Field>

        <Field
          label="What is it about"
          htmlFor={ids.topic}
          error={errors.topic?.message}
        >
          <Select
            value={form.watch("topic")}
            onValueChange={(value) =>
              form.setValue("topic", value as ContactFormValues["topic"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id={ids.topic} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTACT_TOPICS.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {CONTACT_TOPIC_LABELS[topic]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field
        label="Message"
        htmlFor={ids.message}
        error={errors.message?.message}
      >
        <Textarea
          id={ids.message}
          rows={6}
          placeholder="Dates, party size, anything the kitchen should know."
          {...fieldAria(ids.message, errors.message?.message)}
          {...form.register("message")}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending…" : "Send message"}
        </Button>
        <p className="text-xs text-salt-400">
          This is a demo — nothing is emailed anywhere.
        </p>
      </div>
    </form>
  );
}
