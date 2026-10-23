import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { IntroOverlay } from "@/components/IntroOverlay";
import { PageAtmosphere } from "@/components/PageAtmosphere";
import { Nav } from "@/components/Nav";
import { AuditedBy, Community, Faq, Footer, Investors } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <Nav />
      <main>
        <Hero />
        <div className="homepage-body">
          <PageAtmosphere />
          <HowItWorks />
          <Investors />
          <AuditedBy />
          <Faq />
          <Community />
        </div>
      </main>
      <Footer />
    </>
  );
}
