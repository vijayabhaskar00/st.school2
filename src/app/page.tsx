import { Hero } from "@/components/sections/hero";
import { TrustMarquee } from "@/components/sections/trust-marquee";
import { Stats } from "@/components/sections/stats";
import { WhyUs } from "@/components/sections/why-us";
import { ProgramsPreview } from "@/components/sections/programs-preview";
import { Process } from "@/components/sections/process";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustMarquee />
      <Stats />
      <WhyUs />
      <ProgramsPreview />
      <Process />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}
