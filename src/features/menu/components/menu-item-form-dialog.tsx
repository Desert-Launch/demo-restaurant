"use client";

import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Field, fieldAria } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DISH_TAGS, MENU_COURSES, type MenuItem } from "@/types";
import { toMenuItemFormValues, toMenuItemInput } from "../api";
import { useCreateMenuItem, useUpdateMenuItem } from "../hooks/use-menu";
import {
  MENU_ITEM_FORM_DEFAULTS,
  menuItemFormSchema,
  type MenuItemFormValues,
} from "../schema";
import { COURSE_META, TAG_LABELS } from "../taxonomy";

export function MenuItemFormDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null opens the dialog as a create form. */
  item: MenuItem | null;
}) {
  const baseId = useId();
  const ids = {
    name: `${baseId}-name`,
    arabic: `${baseId}-arabic`,
    code: `${baseId}-code`,
    course: `${baseId}-course`,
    price: `${baseId}-price`,
    description: `${baseId}-description`,
    available: `${baseId}-available`,
  };

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: item ? toMenuItemFormValues(item) : MENU_ITEM_FORM_DEFAULTS,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      form.reset(item ? toMenuItemFormValues(item) : MENU_ITEM_FORM_DEFAULTS);
    }
  }, [open, item, form]);

  const create = useCreateMenuItem();
  const update = useUpdateMenuItem();
  const pending = create.isPending || update.isPending;
  const errors = form.formState.errors;
  const tags = form.watch("tags");
  const course = form.watch("course");

  function onSubmit(values: MenuItemFormValues) {
    const input = toMenuItemInput(values);

    if (item) {
      update.mutate(
        { id: item.id, input },
        {
          onSuccess: (saved) => {
            onOpenChange(false);
            toast.success(`${saved.name} updated`);
          },
          onError: (error) =>
            toast.error("That did not save", { description: error.message }),
        },
      );
      return;
    }

    create.mutate(input, {
      onSuccess: (saved) => {
        onOpenChange(false);
        toast.success(`${saved.name} is on the card`, {
          description: "It is on the public menu already.",
        });
      },
      onError: (error) =>
        toast.error("That did not save", { description: error.message }),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {item ? "Edit the dish" : "Add a dish"}
          </DialogTitle>
          <DialogDescription>
            Changes land on the public menu straight away — there is nothing to
            publish.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor={ids.name} error={errors.name?.message}>
              <Input
                id={ids.name}
                {...fieldAria(ids.name, errors.name?.message)}
                {...form.register("name")}
              />
            </Field>

            <Field
              label="Arabic name"
              htmlFor={ids.arabic}
              hint="Printed on the other side of the card."
              error={errors.arabicName?.message}
            >
              <Input
                id={ids.arabic}
                lang="ar"
                dir="rtl"
                {...fieldAria(
                  ids.arabic,
                  errors.arabicName?.message,
                  "Printed on the other side of the card",
                )}
                {...form.register("arabicName")}
              />
            </Field>

            <Field
              label="Kitchen code"
              htmlFor={ids.code}
              hint={`Two letters, a dash, two digits — ${COURSE_META[course].prefix}-04.`}
              error={errors.code?.message}
            >
              <Input
                id={ids.code}
                placeholder={`${COURSE_META[course].prefix}-04`}
                {...fieldAria(
                  ids.code,
                  errors.code?.message,
                  "Two letters, a dash, two digits",
                )}
                {...form.register("code")}
              />
            </Field>

            <Field label="Course" htmlFor={ids.course}>
              <Select
                value={course}
                onValueChange={(value) =>
                  form.setValue("course", value as MenuItemFormValues["course"], {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id={ids.course} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MENU_COURSES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {COURSE_META[option].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Price in dirhams"
              htmlFor={ids.price}
              error={errors.priceAed?.message}
            >
              <Input
                id={ids.price}
                type="number"
                min={1}
                step={1}
                {...fieldAria(ids.price, errors.priceAed?.message)}
                {...form.register("priceAed", { valueAsNumber: true })}
              />
            </Field>

            <div className="flex items-end pb-2">
              <div className="flex items-center gap-3">
                <Switch
                  id={ids.available}
                  checked={form.watch("available")}
                  onCheckedChange={(checked) =>
                    form.setValue("available", checked)
                  }
                />
                <Label htmlFor={ids.available} className="text-sm text-salt-200">
                  On tonight
                </Label>
              </div>
            </div>

            <Field
              label="Description"
              htmlFor={ids.description}
              error={errors.description?.message}
              className="sm:col-span-2"
            >
              <Textarea
                id={ids.description}
                rows={3}
                {...fieldAria(ids.description, errors.description?.message)}
                {...form.register("description")}
              />
            </Field>
          </div>

          <fieldset>
            <legend className="sf-rail">Tags</legend>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
              {DISH_TAGS.map((tag) => {
                const tagId = `${baseId}-tag-${tag}`;
                return (
                  <div key={tag} className="flex items-center gap-2">
                    <Checkbox
                      id={tagId}
                      checked={tags.includes(tag)}
                      onCheckedChange={(checked) =>
                        form.setValue(
                          "tags",
                          checked
                            ? [...tags, tag]
                            : tags.filter((entry) => entry !== tag),
                          { shouldValidate: true },
                        )
                      }
                    />
                    <Label htmlFor={tagId} className="text-sm text-salt-200">
                      {TAG_LABELS[tag]}
                    </Label>
                  </div>
                );
              })}
            </div>
          </fieldset>

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
              {pending ? "Saving…" : item ? "Save the dish" : "Add to the card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
