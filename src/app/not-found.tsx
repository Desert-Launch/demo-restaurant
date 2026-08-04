import Link from "next/link";

import { Khatim } from "@/components/layout/wordmark";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-dvh items-center">
      <div
        aria-hidden="true"
        className="sf-mashrabiya pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(60%_50%_at_50%_40%,#000,transparent)]"
      />
      <PageContainer className="relative py-24">
        <Khatim className="size-8 text-saffron-500" />
        <p className="sf-rail mt-6">Nothing here</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-semibold text-balance text-salt-50">
          That page is not on the card
        </h1>
        <p className="mt-5 max-w-md text-lg text-salt-300">
          The link may be old, or the dish may have come off. The menu and the
          booking page are both where you left them.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/menu">Read the card</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/reserve">Reserve a table</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </PageContainer>
    </main>
  );
}
