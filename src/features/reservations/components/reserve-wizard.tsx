"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { startOfDay } from "date-fns";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { useNow } from "@/lib/hooks/use-now";
import type { Reservation } from "@/types";
import { useBookReservation } from "../hooks/use-reservations";
import type { GuestDetailsValues } from "../schema";
import { ConfirmationStep } from "./confirmation-step";
import { DetailsStep } from "./details-step";
import { PartyStep } from "./party-step";
import { ReviewStep } from "./review-step";
import { StepRail } from "./step-rail";
import { TimeStep } from "./time-step";

const STEPS = ["Party", "Time", "Details", "Confirm", "Done"] as const;

export function ReserveWizard() {
  // The clock only exists after mount — the page is prerendered, so reading it
  // during render would bake the build date into the HTML.
  const now = useNow();

  const [step, setStep] = useState(1);
  const [partySize, setPartySize] = useState(2);
  const [day, setDay] = useState<string | null>(null);
  const [seatingAt, setSeatingAt] = useState<string | null>(null);
  const [guest, setGuest] = useState<GuestDetailsValues | null>(null);
  const [booked, setBooked] = useState<Reservation | null>(null);

  const reduced = useReducedMotion();
  const book = useBookReservation();

  if (!now) {
    return (
      <div className="space-y-6" aria-hidden="true">
        <Skeleton className="h-5 w-72" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-40 w-full max-w-md" />
      </div>
    );
  }

  const today = startOfDay(now);
  const activeDay = day ?? today.toISOString();

  function goTo(next: number) {
    setStep(next);
    // Send focus back up so the next step is read from its heading rather than
    // from wherever the last button happened to be.
    document.getElementById("reserve-flow")?.scrollIntoView({ block: "start" });
  }

  function handleConfirm() {
    if (!seatingAt || !guest) return;

    book.mutate(
      {
        guest: { name: guest.name, phone: guest.phone, email: guest.email },
        partySize,
        seatingAt,
        occasion: guest.occasion,
        specialRequests: guest.specialRequests,
      },
      {
        onSuccess: (reservation) => {
          setBooked(reservation);
          goTo(5);
          toast.success(`Table booked — ${reservation.reference}`, {
            description: "It is already in the staff view.",
          });
        },
        onError: (error) => {
          toast.error("That did not go through", {
            description: error.message,
          });
          // A slot that filled up under them is a time problem, not a details
          // problem, so send them back to the rail rather than to the form.
          if (error.message.includes("slot")) goTo(2);
        },
      },
    );
  }

  function restart() {
    setBooked(null);
    setSeatingAt(null);
    setGuest(null);
    setPartySize(2);
    setDay(null);
    goTo(1);
  }

  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] as const };

  return (
    <div id="reserve-flow" className="scroll-mt-24">
      <StepRail steps={STEPS} current={step} />

      <div className="mt-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: -16 }}
            transition={transition}
          >
            {step === 1 ? (
              <PartyStep
                partySize={partySize}
                onChange={setPartySize}
                onNext={() => goTo(2)}
              />
            ) : null}

            {step === 2 ? (
              <TimeStep
                today={today}
                partySize={partySize}
                day={activeDay}
                onDayChange={(next) => {
                  setDay(next);
                  setSeatingAt(null);
                }}
                seatingAt={seatingAt}
                onSeatingChange={setSeatingAt}
                onBack={() => goTo(1)}
                onNext={() => goTo(3)}
              />
            ) : null}

            {step === 3 ? (
              <DetailsStep
                values={guest}
                onBack={() => goTo(2)}
                onSubmit={(values) => {
                  setGuest(values);
                  goTo(4);
                }}
              />
            ) : null}

            {step === 4 && seatingAt && guest ? (
              <ReviewStep
                partySize={partySize}
                seatingAt={seatingAt}
                guest={guest}
                pending={book.isPending}
                onBack={() => goTo(3)}
                onConfirm={handleConfirm}
              />
            ) : null}

            {step === 5 && booked ? (
              <ConfirmationStep reservation={booked} onBookAnother={restart} />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
