import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/** Where the guest is in the flow. The current step is the only one announced. */
export function StepRail({
  steps,
  current,
}: {
  steps: readonly string[];
  current: number;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {steps.map((label, index) => {
        const step = index + 1;
        const done = step < current;
        const active = step === current;

        return (
          <li key={label} className="flex items-center gap-3">
            <span
              className="flex items-center gap-2"
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "tnum flex size-6 items-center justify-center rounded-full border text-2xs",
                  done && "border-mint-700 bg-mint-950 text-mint-300",
                  active && "border-saffron-500 bg-saffron-500 text-oud-950",
                  !done && !active && "border-oud-600 text-salt-400",
                )}
              >
                {done ? (
                  <Check className="size-3" aria-hidden="true" />
                ) : (
                  step
                )}
              </span>
              <span
                className={cn(
                  "text-xs",
                  active ? "text-salt-50" : "text-salt-400",
                )}
              >
                {label}
              </span>
            </span>
            {step < steps.length ? (
              <span
                aria-hidden="true"
                className="hidden h-px w-6 bg-oud-600 sm:block"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
