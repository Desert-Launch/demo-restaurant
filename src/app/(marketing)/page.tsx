import { PageContainer } from "@/components/layout/page-container";
import { SectionHead } from "@/components/layout/section-head";

export default function HomePage() {
  return (
    <PageContainer className="py-24">
      <SectionHead
        as="h1"
        rail="Al Fahidi, Dubai"
        title="The grill is the loudest thing in the room."
        lede="Placeholder while the store and the marketing sections land."
      />
    </PageContainer>
  );
}
