# St.School

The redesigned marketing site for **St.School** — Student Tribe's career-launchpad
program for Python Full-Stack + AI and UI/UX Design.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com) for styling, with design tokens defined in `src/app/globals.css`
- [Framer Motion](https://motion.dev) for scroll reveals, the animated hero, the curriculum timeline, and the FAQ accordion
- [lucide-react](https://lucide.dev) for icons

## Project structure

- `src/data/content.ts` — single source of truth for all copy (nav, hero, stats, courses, process, testimonials, FAQs, contact info). Update copy here rather than inline in components.
- `src/components/ui/` — shared primitives (`Container`, `Button`, `Badge`, `SectionHeading`).
- `src/components/motion/` — animation primitives (`Reveal`, `Counter`, `Marquee`).
- `src/components/layout/` — `Navbar` and `Footer`, rendered globally from `src/app/layout.tsx`.
- `src/components/sections/` — homepage sections (hero, trust marquee, stats, why-us, programs preview, process, testimonials, FAQ, final CTA).
- `src/components/courses/` — building blocks for the course detail pages (curriculum timeline, outcome list, stack chips, etc).
- `src/app/` — routes: `/` (home), `/courses` (index), `/courses/[slug]` (Python Full-Stack + AI, UI/UX Design), `/about`, `/contact`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build   # static export -> ./out
npm start       # serve ./out locally at http://localhost:3000
```

The site is configured as a static export (`output: "export"` in `next.config.ts`) so it can be hosted on GitHub Pages with no server.

## Deploying to GitHub Pages

A workflow at `.github/workflows/deploy-pages.yml` builds and deploys `./out` on every push to `main` or `claude/stschool-website-redesign-aio5tq`. One-time setup (repo admin, can't be done via git push):

1. GitHub repo → **Settings → Pages → Source** → select **GitHub Actions**.
2. Push to a tracked branch (or run the workflow manually from the **Actions** tab) — it will build and publish automatically.
3. The site is served at `https://<owner>.github.io/st.school2/`. If you later attach a custom domain, set the repo variable/secret `GITHUB_PAGES_BASE_PATH` to `/` (or add a `CNAME` file to `public/`) so asset paths aren't prefixed with `/st.school2`.

## Notes for whoever picks this up next

- **Design provenance**: the live reference sites (`studenttribe.in`, `stschool.studenttribe.in`) were not reachable from the build environment (network policy), so the palette (violet/coral/acid on near-black), typography (Space Grotesk + Inter), and layout are an original system inspired by Student Tribe's Gen-Z positioning and researched brand facts — not a pixel match. Swap tokens in `src/app/globals.css` (`@theme` block) if you have the real brand kit.
- **Content**: course details, stats, and process copy are sourced from public research about ST School / Student Tribe (course structure, 33-seat cohorts, 95% placement track record, parent brand stats). Testimonials on the homepage are illustrative placeholders and should be swapped for real quotes before shipping.
- **Contact form**: `/contact` is a static, client-side-only form (no backend). Wire `src/app/contact/apply-form.tsx`'s `onSubmit` to a real endpoint (API route, form service, CRM) before launch.
