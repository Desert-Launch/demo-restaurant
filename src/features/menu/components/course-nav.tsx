"use client";

import { COURSE_META, COURSE_ORDER } from "../taxonomy";

/** Jump links down the card. Sticky under the navbar on wide screens. */
export function CourseNav() {
  return (
    <nav
      aria-label="Courses"
      className="sticky top-16 z-30 -mx-5 border-y border-oud-700 bg-oud-950/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8"
    >
      <ul className="flex gap-1 overflow-x-auto">
        {COURSE_ORDER.map((course) => (
          <li key={course}>
            <a
              href={`#${course}`}
              className="block rounded-sm px-3 py-1.5 text-sm whitespace-nowrap text-salt-300 transition-colors hover:bg-oud-800 hover:text-salt-50"
            >
              {COURSE_META[course].label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
