import { PageContainer } from "@/components/layout/page-container";
import { Khatim } from "@/components/layout/wordmark";

/**
 * The chef's note. Set as a pull quote against the lattice, because it is the
 * one piece of first-person copy on the site and should not look like a card.
 */
export function ChefsNote() {
  return (
    <section aria-labelledby="chefs-note-heading" className="relative">
      <div
        aria-hidden="true"
        className="sf-mashrabiya pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-30 [mask-image:linear-gradient(to_left,#000,transparent)]"
      />
      <PageContainer className="relative py-24">
        <div className="max-w-3xl">
          <Khatim className="size-8 text-saffron-500" />
          <h2 id="chefs-note-heading" className="sf-rail mt-6">
            From the kitchen
          </h2>
          <blockquote className="mt-6">
            <p className="font-display text-3xl leading-snug text-balance text-salt-50 sm:text-4xl">
              &ldquo;My grandmother pounded kibbeh by hand and would not let a
              machine near it. We still do it that way, which is why it runs out
              on a Friday. Order it early or come back Sunday.&rdquo;
            </p>
          </blockquote>
          <p className="mt-8 text-sm text-salt-400">
            Chef 1 — head chef, in the kitchen since it opened
          </p>
        </div>
      </PageContainer>
    </section>
  );
}
