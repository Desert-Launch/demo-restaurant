import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { CheckoutWizard } from "@/features/checkout";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Collect it yourself or have it delivered across Dubai. Four steps, no card, nothing charged.",
};

export default function CheckoutPage() {
  return (
    <PageContainer className="py-16 sm:py-20">
      <p className="sf-rail">Checkout</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold text-balance text-salt-50">
        Send it to the kitchen
      </h1>

      <div className="mt-14">
        <CheckoutWizard />
      </div>
    </PageContainer>
  );
}
