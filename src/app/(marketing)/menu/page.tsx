import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { CourseNav, MenuBoard } from "@/features/menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Mezze, grills, saffron rice and Levantine desserts. Filter by diet and add anything to an order for pickup or delivery.",
};

export default function MenuPage() {
  return (
    <PageContainer className="pb-24">
      <div className="py-16 sm:py-20">
        <p className="sf-rail">The card</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold text-balance text-salt-50">
          Everything on tonight
        </h1>
        <p className="mt-5 max-w-xl text-lg text-pretty text-salt-300">
          Prices are in dirhams and include nothing you did not order. Tell us
          about an allergy and the kitchen will work around it — most dishes
          can lose the nuts or the gluten.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/reserve">Reserve a table</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/order">Your order</Link>
          </Button>
        </div>
      </div>

      <CourseNav />

      <div className="pt-12">
        <MenuBoard />
      </div>
    </PageContainer>
  );
}
