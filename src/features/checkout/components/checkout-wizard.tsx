"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, useCartActions } from "@/features/cart";
import { usePlaceOrder } from "@/features/orders";
import { StepRail } from "@/features/reservations";
import { useNow } from "@/lib/hooks/use-now";
import type { Order, OrderType } from "@/types";
import { ConfirmationStep } from "./confirmation-step";
import { DetailsStep } from "./details-step";
import { FulfilmentStep } from "./fulfilment-step";
import { OrderSummary } from "./order-summary";
import { ReviewStep } from "./review-step";
import { TimeStep } from "./time-step";
import type { CheckoutDetailsValues } from "../schema";

const STEPS = ["How", "Details", "Time", "Review", "Done"] as const;

export function CheckoutWizard() {
  const now = useNow();
  const [step, setStep] = useState(1);
  const [type, setType] = useState<OrderType>("pickup");
  const [details, setDetails] = useState<CheckoutDetailsValues | null>(null);
  const [scheduledFor, setScheduledFor] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Order | null>(null);

  const { lines, isEmpty, totals } = useCart(type);
  const { clear } = useCartActions();
  const place = usePlaceOrder();
  const flowRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  if (!now) {
    return (
      <div className="space-y-6" aria-hidden="true">
        <Skeleton className="h-5 w-72" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-40 w-full max-w-md" />
      </div>
    );
  }

  // Once the order is placed the cart is empty by design, so the confirmation
  // has to survive that rather than falling through to the empty state.
  if (isEmpty && !placed) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-6" aria-hidden="true" />}
        title="There is nothing to check out"
        description="Add a few dishes from the card and come back — the order is kept for as long as this tab is open."
        action={
          <Button asChild>
            <Link href="/menu">Open the menu</Link>
          </Button>
        }
      />
    );
  }

  function goTo(next: number) {
    setStep(next);
    // Move focus to the step region rather than leaving it on the button that
    // has just been replaced.
    requestAnimationFrame(() => {
      flowRef.current?.scrollIntoView({ block: "start" });
      flowRef.current?.focus();
    });
  }

  function handlePlace() {
    if (!details) return;

    place.mutate(
      {
        type,
        channel: "online",
        customer: {
          name: details.name,
          phone: details.phone,
          email: details.email,
          address:
            type === "delivery"
              ? {
                  line1: details.addressLine,
                  area: details.area,
                  city: "Dubai",
                  notes: details.addressNotes,
                }
              : null,
        },
        lines,
        scheduledFor,
      },
      {
        onSuccess: (order) => {
          setPlaced(order);
          clear();
          goTo(5);
          toast.success(`Order ${order.reference} is with the kitchen`, {
            description: "It is already on the pass in the staff view.",
          });
        },
        onError: (error) => {
          toast.error("That did not go through", {
            description: error.message,
          });
        },
      },
    );
  }

  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] as const };

  return (
    <div
      ref={flowRef}
      tabIndex={-1}
      aria-label={`Checkout, step ${step} of ${STEPS.length}: ${STEPS[step - 1]}`}
      className="scroll-mt-24 outline-none"
    >
      <StepRail steps={STEPS} current={step} />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduced ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: -16 }}
              transition={transition}
            >
              {step === 1 ? (
                <FulfilmentStep
                  type={type}
                  onChange={setType}
                  onNext={() => goTo(2)}
                />
              ) : null}

              {step === 2 ? (
                <DetailsStep
                  type={type}
                  values={details}
                  onBack={() => goTo(1)}
                  onSubmit={(values) => {
                    setDetails(values);
                    goTo(3);
                  }}
                />
              ) : null}

              {step === 3 ? (
                <TimeStep
                  type={type}
                  now={now}
                  scheduledFor={scheduledFor}
                  onChange={setScheduledFor}
                  onBack={() => goTo(2)}
                  onNext={() => goTo(4)}
                />
              ) : null}

              {step === 4 && details ? (
                <ReviewStep
                  details={details}
                  scheduledFor={scheduledFor}
                  pending={place.isPending}
                  onBack={() => goTo(3)}
                  onPlace={handlePlace}
                />
              ) : null}

              {step === 5 && placed ? (
                <ConfirmationStep order={placed} />
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        {step < 5 ? (
          <div className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary lines={lines} totals={totals} type={type} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
