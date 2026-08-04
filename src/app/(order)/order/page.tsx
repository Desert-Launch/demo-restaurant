import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { OrderReview } from "@/features/cart";

export const metadata: Metadata = {
  title: "Your order",
  description:
    "Everything you have added from the card, with quantities and notes for the kitchen.",
};

export default function OrderPage() {
  return (
    <PageContainer className="py-16 sm:py-20">
      <p className="sf-rail">Your order</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold text-balance text-salt-50">
        Before it goes to the kitchen
      </h1>
      <p className="mt-5 max-w-xl text-lg text-pretty text-salt-300">
        Change quantities, leave a note on any dish, then choose collection or
        delivery at checkout.
      </p>

      <div className="mt-14">
        <OrderReview />
      </div>
    </PageContainer>
  );
}
