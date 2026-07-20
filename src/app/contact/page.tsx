import type { Metadata } from "next";
import { Mail, Phone, MapPin, Sparkles, Globe } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
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

        <Container className="flex flex-col items-center text-center">
          <Reveal>
            <Badge>
              <Sparkles className="size-3.5 text-acid" strokeWidth={2.5} />
              {seats?.label ?? "33 seats, per cohort"}
            </Badge>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="font-display mt-8 max-w-3xl text-balance text-[2.5rem] font-medium leading-[1.08] tracking-tight sm:text-6xl">
              Apply for a seat at{" "}
              <span className="text-gradient">{site.name}.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted sm:text-xl">
              {seats?.detail ?? "Only 33 students get in per batch."} Tell us who you are and
              where you want to go — admissions reviews every application personally.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative pb-28 sm:pb-36">
        <Container className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-8">
          <Reveal delay={0.1}>
            <ApplyForm />
          </Reveal>

          <Reveal delay={0.18} className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-ink-elevated p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">
                Reach us directly
              </p>
              <div className="mt-5 flex flex-col gap-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="group flex items-center gap-4 rounded-xl border border-white/5 bg-ink px-4 py-3.5 transition-colors hover:border-violet/40"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet/15 text-violet-light">
                    <Mail className="size-4.5" strokeWidth={2.25} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs text-muted-soft">Email</span>
                    <span className="text-sm font-medium text-paper transition-colors group-hover:text-violet-light">
                      {contact.email}
                    </span>
                  </span>
                </a>

                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="group flex items-center gap-4 rounded-xl border border-white/5 bg-ink px-4 py-3.5 transition-colors hover:border-coral/40"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-coral/15 text-coral-light">
                    <Phone className="size-4.5" strokeWidth={2.25} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs text-muted-soft">Phone</span>
                    <span className="text-sm font-medium text-paper transition-colors group-hover:text-coral-light">
                      {contact.phone}
                    </span>
                  </span>
                </a>

                <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-ink px-4 py-3.5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-acid/15 text-acid">
                    <MapPin className="size-4.5" strokeWidth={2.25} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-xs text-muted-soft">Address</span>
                    <span className="text-sm font-medium text-paper">{contact.address}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-ink-elevated p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">
                Follow {site.parentBrand}
              </p>
              <div className="mt-5 flex flex-col gap-3">
                {contact.socials.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-white/5 bg-ink px-4 py-3.5 transition-colors hover:border-white/20"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium text-paper">
                      <Globe className="size-4 text-muted" strokeWidth={2.25} />
                      {social.label}
                    </span>
                    <span className="text-xs text-muted-soft transition-colors group-hover:text-paper">
                      Visit ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet/15 to-coral/10 p-6">
              <p className="font-display text-lg font-medium text-paper">
                A {site.parentBrand} initiative
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {site.name} runs on Student Tribe&apos;s network — {site.city} HQ, 1M+ students,
                a decade of campus and hiring relationships.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
