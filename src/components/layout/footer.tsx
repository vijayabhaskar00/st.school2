import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/brand/logo";
import { navLinks, site, contact, courses } from "@/data/content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink-soft">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-violet/20 blur-[120px]" />
      <Container className="relative flex flex-col gap-14 py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <Link href="/">
              <Logo />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.description}
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-soft">
              A {site.parentBrand} initiative — {site.city}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">Programs</p>
              <ul className="mt-4 flex flex-col gap-3">
                {courses.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/courses/${c.slug}`} className="text-sm text-paper/75 transition-colors hover:text-paper">
                      {c.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">Site</p>
              <ul className="mt-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-paper/75 transition-colors hover:text-paper">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-soft">Contact</p>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a href={`mailto:${contact.email}`} className="text-sm text-paper/75 transition-colors hover:text-paper">
                    {contact.email}
                  </a>
                </li>
                <li className="text-sm text-paper/75">{contact.address}</li>
                {contact.socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-paper/75 transition-colors hover:text-paper">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-muted-soft sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {site.name}. Part of the {site.parentBrand} network.</p>
          <p>Built to be next-level, on purpose.</p>
        </div>
      </Container>
    </footer>
  );
}
