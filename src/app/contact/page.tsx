import type { Metadata } from "next";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { site, contact, stats } from "@/data/content";
import { ApplyForm } from "./apply-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Apply for a St.School seat — 33 spots per cohort. Reach us directly or fill out the application form.",
};

const seats = stats.find((s) => s.value === 33);

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-16 sm:pt-48 sm:pb-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_60%_at_50%_-10%,rgba(124,92,255,0.32),transparent)]" />
          <div className="absolute left-[12%] top-[14%] size-72 rounded-full bg-violet/25 blur-[110px] animate-float" aria-hidden />
          <div className="absolute right-[10%] top-[30%] size-72 rounded-full bg-coral/20 blur-[110px] animate-float [animation-delay:-3.5s]" aria-hidden />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(246,244,251,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(246,244,251,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,black,transparent)]" />
        </div>

        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:gap-8">
            <div>
              <Reveal>
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-soft">
                  Get in touch
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="font-display mt-6 max-w-2xl text-balance text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl lg:text-[5.5rem]">
                  Apply for a{" "}
                  <span className="text-gradient">seat.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-7 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
                  Tell us who you are and where you want to go — admissions reviews every
                  application personally.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.14} className="rounded-2xl border border-white/10 bg-ink-elevated/60 p-6 lg:mb-1">
              <span className="font-display text-gradient text-4xl font-semibold sm:text-5xl">
                {seats?.value ?? 33}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {seats?.detail ?? "Only 33 students get in per batch."}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="relative pb-28 sm:pb-36">
        <Container className="grid gap-14 lg:grid-cols-[1.4fr_0.6fr] lg:items-start lg:gap-10">
          <Reveal delay={0.1}>
            <ApplyForm />
          </Reveal>

          <Reveal delay={0.18} className="flex flex-col gap-10">
            {/* Heavier weight: an editorial directory, not a card grid */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">
                Reach us directly
              </p>
              <div className="mt-5 flex flex-col divide-y divide-white/10 border-t border-white/10">
                <a
                  href={`mailto:${contact.email}`}
                  className="group flex items-center gap-4 py-4 transition-colors"
                >
                  <Mail className="size-4 shrink-0 text-violet-light" strokeWidth={2.25} />
                  <span className="flex flex-col">
                    <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-soft">Email</span>
                    <span className="font-display text-base font-medium text-paper transition-colors group-hover:text-violet-light sm:text-lg">
                      {contact.email}
                    </span>
                  </span>
                </a>

                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="group flex items-center gap-4 py-4 transition-colors"
                >
                  <Phone className="size-4 shrink-0 text-coral-light" strokeWidth={2.25} />
                  <span className="flex flex-col">
                    <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-soft">Phone</span>
                    <span className="font-display text-base font-medium text-paper transition-colors group-hover:text-coral-light sm:text-lg">
                      {contact.phone}
                    </span>
                  </span>
                </a>

                <div className="flex items-center gap-4 py-4">
                  <MapPin className="size-4 shrink-0 text-acid" strokeWidth={2.25} />
                  <span className="flex flex-col">
                    <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-soft">Address</span>
                    <span className="font-display text-base font-medium text-paper sm:text-lg">{contact.address}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Lighter weight: socials + brand note, compact */}
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-ink-elevated/60 p-5">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-soft">
                  Follow {site.parentBrand}
                </span>
                {contact.socials.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-xs font-medium text-paper/80 transition-colors hover:text-paper"
                  >
                    <Globe className="size-3.5 text-muted" strokeWidth={2.25} />
                    {social.label}
                  </a>
                ))}
              </div>
              <p className="text-xs leading-relaxed text-muted-soft">
                {site.name} runs on {site.parentBrand}&apos;s network — {site.city} HQ, 1M+ students,
                a decade of campus and hiring relationships.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
