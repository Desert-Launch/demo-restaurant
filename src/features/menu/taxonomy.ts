import type { CSSProperties } from "react";

import { MENU_COURSES, type DishTag, type MenuCourse } from "@/types";

export interface CourseMeta {
  label: string;
  /** The course as it is printed on the Arabic side of the card. */
  arabicLabel: string;
  /** Sits under the course heading on the menu page. */
  blurb: string;
  /** Prefix the admin form suggests when a dish moves course. */
  prefix: string;
  /** Token references for the CSS-only plate. */
  plateTop: string;
  plateBottom: string;
  /** Grills get sear marks over the plate. */
  seared?: boolean;
}

export const COURSE_META: Record<MenuCourse, CourseMeta> = {
  mezze: {
    label: "Mezze",
    arabicLabel: "مزة",
    blurb: "The table fills up before anything else arrives. Order more than you think.",
    prefix: "MZ",
    plateTop: "var(--sf-course-mezze-top)",
    plateBottom: "var(--sf-course-mezze-bottom)",
  },
  starters: {
    label: "Starters",
    arabicLabel: "مقبلات",
    blurb: "Everything out of the fryer and off the saj, sent as it is ready.",
    prefix: "ST",
    plateTop: "var(--sf-course-starters-top)",
    plateBottom: "var(--sf-course-starters-bottom)",
  },
  grills: {
    label: "Grills",
    arabicLabel: "مشاوي",
    blurb: "One fire, lit at four. Everything here has been over it.",
    prefix: "GR",
    plateTop: "var(--sf-course-grills-top)",
    plateBottom: "var(--sf-course-grills-bottom)",
    seared: true,
  },
  mains: {
    label: "Mains",
    arabicLabel: "أطباق رئيسية",
    blurb: "The pots, and the rice that takes an hour whether you are ready or not.",
    prefix: "MN",
    plateTop: "var(--sf-course-mains-top)",
    plateBottom: "var(--sf-course-mains-bottom)",
  },
  desserts: {
    label: "Desserts",
    arabicLabel: "حلويات",
    blurb: "Made in the back, finished at the table.",
    prefix: "DS",
    plateTop: "var(--sf-course-desserts-top)",
    plateBottom: "var(--sf-course-desserts-bottom)",
  },
  drinks: {
    label: "Drinks",
    arabicLabel: "مشروبات",
    blurb: "No alcohol. The karak is on the boil from noon.",
    prefix: "DR",
    plateTop: "var(--sf-course-drinks-top)",
    plateBottom: "var(--sf-course-drinks-bottom)",
  },
};

export const COURSE_ORDER: readonly MenuCourse[] = MENU_COURSES;

export const TAG_LABELS: Record<DishTag, string> = {
  signature: "Signature",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  spicy: "Spicy",
  "contains-nuts": "Contains nuts",
  "gluten-free": "Gluten free",
};

/** Chip colours. Saffron marks the house dishes, pomegranate marks heat. */
export const TAG_CLASSNAMES: Record<DishTag, string> = {
  signature: "border-saffron-800 bg-saffron-950 text-saffron-300",
  vegetarian: "border-mint-700 bg-mint-950 text-mint-300",
  vegan: "border-mint-700 bg-mint-950 text-mint-300",
  spicy: "border-rumman-700 bg-rumman-950 text-rumman-300",
  "contains-nuts": "border-steel-700 bg-steel-950 text-steel-300",
  "gluten-free": "border-steel-700 bg-steel-950 text-steel-300",
};

/**
 * The dietary filters offered on the public menu. "No nuts" excludes rather
 * than includes, which is why this is a list of predicates and not just tags.
 */
export const DIETARY_FILTERS = [
  { id: "vegetarian", label: "Vegetarian", requires: "vegetarian" },
  { id: "vegan", label: "Vegan", requires: "vegan" },
  { id: "gluten-free", label: "Gluten free", requires: "gluten-free" },
  { id: "no-nuts", label: "No nuts", excludes: "contains-nuts" },
] as const satisfies readonly {
  id: string;
  label: string;
  requires?: DishTag;
  excludes?: DishTag;
}[];

export type DietaryFilterId = (typeof DIETARY_FILTERS)[number]["id"];

/** Inline style object for the CSS-only plate. */
export function plateStyle(course: MenuCourse): CSSProperties {
  const meta = COURSE_META[course];
  return {
    "--plate-top": meta.plateTop,
    "--plate-bottom": meta.plateBottom,
  } as CSSProperties;
}
