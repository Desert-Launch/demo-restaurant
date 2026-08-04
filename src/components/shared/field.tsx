import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  /** Must match the id on the control this field wraps. */
  htmlFor: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

/**
 * The shadcn radix registry has no `form` component, so this is the project's
 * own label + hint + error wrapper. Pair it with `fieldAria` on the control so
 * the message is announced rather than just shown.
 */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="sf-rail">
        {label}
      </Label>
      {children}
      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-salt-400">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-xs text-rumman-300"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Wires a control to its error or hint text for screen readers. */
export function fieldAria(id: string, error?: string, hint?: string) {
  return {
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}
