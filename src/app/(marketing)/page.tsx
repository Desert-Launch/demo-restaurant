import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHead } from "@/components/layout/section-head";
import { ChefsNote } from "@/components/marketing/chefs-note";
import { Hero } from "@/components/marketing/hero";
import { StoryStrip } from "@/components/marketing/story-strip";
import { VisitPanel } from "@/components/marketing/visit-panel";
import { Button } from "@/components/ui/button";
import { SignatureRail } from "@/features/menu";

export default function HomePage() {
  return (
    <>
      <Hero />

      <PageContainer className="py-24">
        <SectionHead
          rail="What we are known for"
          title="Six dishes people come back for"
          lede="If it is your first time, order these and let the rest of the table argue about the mezze."
          action={
            <Button asChild variant="outline">
              <Link href="/menu">See the whole card</Link>
            </Button>
          }
        />
        <div className="mt-16">
          <SignatureRail />
        </div>
      </PageContainer>

      <StoryStrip />
      <ChefsNote />
      <VisitPanel />
    </>
  );
}
