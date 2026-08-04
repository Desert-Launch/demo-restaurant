"use client";

import type { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  /** Says what will happen, e.g. "Cancel the booking" — never "OK". */
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  pending?: boolean;
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Keep it",
  onConfirm,
  pending = false,
  children,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-oud-700 bg-oud-850">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-salt-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            disabled={pending}
            className="bg-rumman-600 text-salt-50 hover:bg-rumman-700"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
