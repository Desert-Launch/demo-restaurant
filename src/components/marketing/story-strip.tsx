import { PageContainer } from "@/components/layout/page-container";

const PANELS = [
  {
    rail: "The room",
    title: "A courtyard house with the roof taken off",
    body: "Forty covers around an open courtyard, the grill along one wall, and a majlis at the back for eight. It gets loud after nine. That is not an accident.",
  },
  {
    rail: "The kitchen",
    title: "Levantine hands, Emirati pantry",
    body: "Mezze and grills the way they are made in Beirut and Damascus, cooked with what the Gulf actually keeps: loomi, saffron, dried lime, tamarind, dates.",
  },
  {
    rail: "The fire",
    title: "Charcoal, lit at four, out by midnight",
    body: "Lump charcoal, no gas assist. It comes up to temperature slowly and holds, which is why the lamb goes on at six and not before.",
  },
] as const;

/** Three panels of what the place actually is, set as a printed spread. */
export function StoryStrip() {
  return (
    <section className="border-y border-oud-700 bg-oud-900">
      <PageContainer className="py-20">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {PANELS.map((panel) => (
            <article key={panel.rail}>
              <p className="sf-rail">{panel.rail}</p>
              <h3 className="mt-4 font-display text-2xl font-semibold text-balance text-salt-50">
                {panel.title}
              </h3>
              <p className="mt-3 text-sm text-pretty text-salt-300">
                {panel.body}
              </p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
