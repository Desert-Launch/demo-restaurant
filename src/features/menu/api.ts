import type { DishTag, MenuCourse, MenuItem } from "@/types";
import {
  insertMenuItem,
  newId,
  patchMenuItem,
  removeMenuItem,
  selectMenu,
  selectMenuItem,
} from "@/lib/store";
import { sleep } from "@/lib/utils";
import type { MenuItemFormValues } from "./schema";

/** Fake network time so loading and skeleton states are demoable. */
const LATENCY_MS = 120;

export interface MenuItemInput {
  name: string;
  arabicName: string;
  code: string;
  description: string;
  course: MenuCourse;
  priceFils: number;
  tags: DishTag[];
  available: boolean;
}

export function toMenuItemInput(values: MenuItemFormValues): MenuItemInput {
  return {
    name: values.name,
    arabicName: values.arabicName,
    code: values.code,
    description: values.description,
    course: values.course,
    priceFils: Math.round(values.priceAed * 100),
    tags: values.tags,
    available: values.available,
  };
}

export function toMenuItemFormValues(item: MenuItem): MenuItemFormValues {
  return {
    name: item.name,
    arabicName: item.arabicName,
    code: item.code,
    description: item.description,
    course: item.course,
    priceAed: Math.round(item.priceFils / 100),
    tags: item.tags,
    available: item.available,
  };
}

export async function fetchMenu(): Promise<MenuItem[]> {
  await sleep(LATENCY_MS);
  return selectMenu();
}

export async function fetchMenuItem(id: string): Promise<MenuItem> {
  await sleep(LATENCY_MS);
  const item = selectMenuItem(id);
  if (!item) throw new Error("That dish is no longer on the menu.");
  return item;
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  await sleep(LATENCY_MS);
  return insertMenuItem({
    ...input,
    id: newId(),
    createdAt: new Date().toISOString(),
  });
}

export async function updateMenuItem(
  id: string,
  input: MenuItemInput,
): Promise<MenuItem> {
  await sleep(LATENCY_MS);
  const current = selectMenuItem(id);
  if (!current) throw new Error("That dish is no longer on the menu.");
  return patchMenuItem(id, input);
}

export async function deleteMenuItem(id: string): Promise<void> {
  await sleep(LATENCY_MS);
  removeMenuItem(id);
}

/** 86'ing a dish. Flips instantly on the bar, so the caller updates optimistically. */
export async function setMenuItemAvailability(
  id: string,
  available: boolean,
): Promise<MenuItem> {
  await sleep(LATENCY_MS);
  return patchMenuItem(id, { available });
}
