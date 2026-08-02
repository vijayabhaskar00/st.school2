# Pixar-style genz Visuals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a recurring Pixar-style genz mascot character (4 scenes) and a matching 7-icon content set to the site, replacing selected `lucide-react` icons and filling new visual moments on the homepage, About page, and both course pages.

**Architecture:** Generate all image assets via the Higgsfield MCP tools (`generate_image` → `remove_background` → download), post-process with `sharp` into small WebP files, commit as static assets under `public/images/`, then wire them into components with `next/image` (prefixed with `assetBasePath`, per the fix already established in the classroom-gallery feature). Component changes are additive/structural, not rewrites — existing Remotion hero pieces and the `Process` section's scroll animation are untouched.

**Tech Stack:** Higgsfield MCP (`generate_image`, `remove_background`, `job_status`), `sharp` (ad hoc, not a project dependency), Next.js `next/image`, Tailwind v4.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-02-pixar-genz-visuals-design.md` — follow it exactly.
- No test framework exists. "Verify" means `npm run lint` / `npm run build` plus manual dev-server/browser checks, same as every prior feature in this repo.
- Every mascot prompt reuses the canonical character description verbatim (see Task 1) — only pose/action/background differ per scene.
- Background clause for ALL generations (mascot and icons): `plain dark charcoal near-black background with a soft radial coral-red glow behind the character, no furniture, no room details` (mascots) or the equivalent per-icon color glow (icons, see Task 2) — validated during design: this background shape is what makes `remove_background` produce a clean, fully-transparent cutout (`hasAlpha: true`, corner alpha 0, subject alpha ~254). A literal scene/room background (the first, rejected sample) does NOT get cleanly removed — never use one.
- Output format for all generated assets: WebP with alpha (`sharp(...).webp({ quality: 88, alphaQuality: 90 })`), not PNG — validated during design: identical visual quality, 1.2MB PNG → 47KB WebP.
- `Process` section (`src/components/sections/process.tsx`) and `ProcessProgressLine` (`src/components/about/process-progress-line.tsx`) are explicitly OUT OF SCOPE — do not modify.
- The 3 existing Remotion hero pieces (`SelectionFieldPlayer`, `NeuralPulsePlayer`, `DesignSystemBuildPlayer`) are OUT OF SCOPE — do not modify.
- No new npm dependency — `sharp` is required via `node_modules/next/node_modules/sharp`, exactly as in the classroom-gallery feature.
- `next/image` src values for these assets must be prefixed with `assetBasePath` from `@/lib/base-path` — confirmed required (not automatic) during the classroom-gallery feature.
- Scene 1 of the mascot (homepage) was ALREADY generated and background-removed during design/research — job IDs are given in Task 1 so it isn't regenerated (saves credits): raw generation `2e920f93-673c-48bf-9406-cfea6db62c63`, background-removed `baf5f0c1-780c-428d-ad33-b383a389c3f7`.

---

### Task 1: Generate and process the 4 mascot images

**Files:**
- Create: `public/images/mascot/homepage.webp`
- Create: `public/images/mascot/about-story.webp`
- Create: `public/images/mascot/course-python.webp`
- Create: `public/images/mascot/course-uiux.webp`

**Interfaces:**
- Produces: 4 transparent WebP files at the paths above, each a full-body character render, for Tasks 6-8 to reference by exact path.

**Canonical character description (reused verbatim in every prompt below, only the bracketed action/pose changes):**

```
a 3D-stylized Pixar/DreamWorks-style animated character render of a genz Indian college-age student in his early twenties, [ACTION], stylized 3D character render, appealing exaggerated proportions, smooth subsurface-scattering skin, soft rounded features, detailed hair strands and cloth simulation, dark curly hair, wearing a coral-red hoodie with a subtle geometric pattern and black joggers, white sneakers, soft global illumination, three-point studio lighting, gentle rim light in coral-red and warm amber tones, plain dark charcoal near-black background with a soft radial coral-red glow behind the character, no furniture, no room details, high-end 3D animation studio quality, octane-style render, clean composition, 4K, no text, no watermark, no logos
```

- [ ] **Step 1: Retrieve the already-generated homepage scene (no new generation needed)**

Call `job_status` with `jobId: "baf5f0c1-780c-428d-ad33-b383a389c3f7"`, `sync: true` — this is the background-removed cutout of the "arms crossed" pose generated during design. Confirm `status: "completed"` and note the `results.rawUrl`.

Download it:

```bash
curl -sL "<rawUrl from job_status>" -o "C:/Users/HP/Documents/GitHub/st.school2/.tmp-mascot-homepage.png"
```

- [ ] **Step 2: Generate the About page scene**

Call `generate_image` with:
- `model`: `"nano_banana_2"`
- `aspect_ratio`: `"4:5"`
- `prompt`: the canonical description with `[ACTION]` = `standing at a relaxed three-quarter angle, one hand raised in a friendly wave, warm genuine smile`

Poll with `job_status` (`sync: true`) until `status: "completed"`, note the job `id` and `results.rawUrl`.

- [ ] **Step 3: Generate the Python course scene**

Call `generate_image` with:
- `model`: `"nano_banana_2"`
- `aspect_ratio`: `"4:5"`
- `prompt`: the canonical description with `[ACTION]` = `sitting cross-legged on the floor with a laptop covered in colorful stickers open on his lap, typing with a big excited grin, floating minimal holographic code panels beside the laptop screen`

Poll until completed, note job `id` and `rawUrl`.

- [ ] **Step 4: Generate the UI/UX course scene**

Call `generate_image` with:
- `model`: `"nano_banana_2"`
- `aspect_ratio`: `"4:5"`
- `prompt`: the canonical description with `[ACTION]` = `sitting cross-legged on the floor holding a digital drawing tablet and stylus, sketching a wireframe UI mockup with a focused happy expression, a floating holographic UI mockup panel with buttons and a layout grid visible beside the tablet`

Poll until completed, note job `id` and `rawUrl`.

- [ ] **Step 5: Sanity-check character consistency**

Download and view the 3 new raw generations from Steps 2-4 (same `curl` pattern as Step 1) alongside the Step 1 result. Compare face, hair, and hoodie against the Step 1 image. If any generation reads as a clearly different character (skin tone, build, or hair shifts materially, not just pose/lighting variation), regenerate that one step with the same prompt before continuing — do not proceed to background removal on a mismatched character.

- [ ] **Step 6: Remove backgrounds**

For each of the 3 new job IDs from Steps 2-4 (Step 1's is already background-removed), call `remove_background` with `media_id: "<job id>"`, `media_type: "image"`, then poll `job_status` (`sync: true`) until completed. Note each result's `results.rawUrl`.

- [ ] **Step 7: Download all 4 background-removed cutouts**

```bash
curl -sL "<about-story cutout rawUrl>" -o "C:/Users/HP/Documents/GitHub/st.school2/.tmp-mascot-about-story.png"
curl -sL "<course-python cutout rawUrl>" -o "C:/Users/HP/Documents/GitHub/st.school2/.tmp-mascot-course-python.png"
curl -sL "<course-uiux cutout rawUrl>" -o "C:/Users/HP/Documents/GitHub/st.school2/.tmp-mascot-course-uiux.png"
```

(`.tmp-mascot-homepage.png` already downloaded in Step 1.)

- [ ] **Step 8: Convert to compressed WebP and place in `public/`**

```bash
node -e "
const sharp = require('C:/Users/HP/Documents/GitHub/st.school2/node_modules/next/node_modules/sharp');
const fs = require('node:fs');
fs.mkdirSync('C:/Users/HP/Documents/GitHub/st.school2/public/images/mascot', { recursive: true });
const files = ['homepage', 'about-story', 'course-python', 'course-uiux'];
(async () => {
  for (const name of files) {
    const src = \`C:/Users/HP/Documents/GitHub/st.school2/.tmp-mascot-\${name}.png\`;
    const out = \`C:/Users/HP/Documents/GitHub/st.school2/public/images/mascot/\${name}.webp\`;
    const meta = await sharp(src).metadata();
    await sharp(src).webp({ quality: 88, alphaQuality: 90 }).toFile(out);
    const outMeta = await sharp(out).metadata();
    console.log(name, \`\${meta.width}x\${meta.height} ->\`, \`\${outMeta.width}x\${outMeta.height}\`, fs.statSync(out).size, 'bytes');
  }
})();
"
```

Expected: 4 lines printed, each file well under 200KB (the validated sample was 47KB at 928×1152).

- [ ] **Step 9: Clean up temp files and verify**

```bash
cd "c:\Users\HP\Documents\GitHub\st.school2" && rm -f .tmp-mascot-*.png
ls -la public/images/mascot/
```

Expected: exactly 4 `.webp` files, no leftover `.png` in the repo root.

- [ ] **Step 10: Commit**

```bash
git add public/images/mascot/
git commit -m "assets: add Pixar-style mascot character (4 scenes)"
```

---

### Task 2: Generate and process the 7 icon images

**Files:**
- Create: `public/images/icons/duration.webp`
- Create: `public/images/icons/mode.webp`
- Create: `public/images/icons/level.webp`
- Create: `public/images/icons/why-us-1.webp`
- Create: `public/images/icons/why-us-2.webp`
- Create: `public/images/icons/why-us-3.webp`
- Create: `public/images/icons/why-us-4.webp`

**Interfaces:**
- Produces: 7 transparent WebP files at the paths above, ~256px square, for Tasks 3-5 to reference by exact path.

**Shared icon render suffix (reused verbatim in every prompt below):**

```
rounded chunky toy-like proportions, soft glossy plastic material, floating in space, soft global illumination, [BACKGROUND], high-end 3D animation studio quality, octane-style render, centered composition, 4K, no text, no watermark, no logos
```

- [ ] **Step 1: Generate all 7 icons**

For each row below, call `generate_image` with `model: "nano_banana_2"`, `aspect_ratio: "1:1"`, and `prompt` = `"A single 3D-stylized Pixar/DreamWorks-style icon render of "` + the description column + `", "` + the shared suffix with `[BACKGROUND]` filled in. Poll each with `job_status` (`sync: true`) until completed; note each job `id` and `rawUrl`.

| Output file | Description | `[BACKGROUND]` |
|---|---|---|
| `duration.webp` | `a cute stylized alarm clock with rounded chunky proportions, coral-red and cream color palette` | `plain dark charcoal near-black background with a soft radial coral-red glow behind it, no furniture, no room details` |
| `mode.webp` | `a cute stylized laptop with a glowing globe/wifi signal icon rising from the screen, coral-red and violet color palette` | `plain dark charcoal near-black background with a soft radial violet glow behind it, no furniture, no room details` |
| `level.webp` | `a cute stylized graduation cap (mortarboard) with a dangling tassel, coral-red and gold color palette` | `plain dark charcoal near-black background with a soft radial coral-red glow behind it, no furniture, no room details` |
| `why-us-1.webp` | `a cute stylized single armchair with a small glowing spotlight above it, violet and coral color palette` | `plain dark charcoal near-black background with a soft radial violet glow behind it, no furniture except the single chair itself, no room details` |
| `why-us-2.webp` | `a cute stylized hammer crossed with a wrench, coral-red and cream color palette` | `plain dark charcoal near-black background with a soft radial coral-red glow behind it, no furniture, no room details` |
| `why-us-3.webp` | `a cute stylized network of glowing connected nodes forming a small constellation, chunky spheres connected by glowing lines, acid-green and coral color palette` | `plain dark charcoal near-black background with a soft radial green glow behind it, no furniture, no room details` |
| `why-us-4.webp` | `a cute stylized name badge / ID card with a friendly smiling face icon and a checkmark, violet and coral color palette` | `plain dark charcoal near-black background with a soft radial violet glow behind it, no furniture, no room details` |

- [ ] **Step 2: Remove backgrounds**

For each of the 7 job IDs from Step 1, call `remove_background` with `media_id: "<job id>"`, `media_type: "image"`, then poll `job_status` (`sync: true`) until completed. Note each result's `rawUrl`.

- [ ] **Step 3: Download all 7 cutouts**

```bash
cd "c:\Users\HP\Documents\GitHub\st.school2"
curl -sL "<duration cutout rawUrl>" -o .tmp-icon-duration.png
curl -sL "<mode cutout rawUrl>" -o .tmp-icon-mode.png
curl -sL "<level cutout rawUrl>" -o .tmp-icon-level.png
curl -sL "<why-us-1 cutout rawUrl>" -o .tmp-icon-why-us-1.png
curl -sL "<why-us-2 cutout rawUrl>" -o .tmp-icon-why-us-2.png
curl -sL "<why-us-3 cutout rawUrl>" -o .tmp-icon-why-us-3.png
curl -sL "<why-us-4 cutout rawUrl>" -o .tmp-icon-why-us-4.png
```

- [ ] **Step 4: Convert to compressed WebP, resized to 256px, place in `public/`**

```bash
node -e "
const sharp = require('C:/Users/HP/Documents/GitHub/st.school2/node_modules/next/node_modules/sharp');
const fs = require('node:fs');
fs.mkdirSync('C:/Users/HP/Documents/GitHub/st.school2/public/images/icons', { recursive: true });
const files = ['duration', 'mode', 'level', 'why-us-1', 'why-us-2', 'why-us-3', 'why-us-4'];
(async () => {
  for (const name of files) {
    const src = \`C:/Users/HP/Documents/GitHub/st.school2/.tmp-icon-\${name}.png\`;
    const out = \`C:/Users/HP/Documents/GitHub/st.school2/public/images/icons/\${name}.webp\`;
    await sharp(src).resize({ width: 256, height: 256, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 88, alphaQuality: 90 }).toFile(out);
    const outMeta = await sharp(out).metadata();
    console.log(name, \`\${outMeta.width}x\${outMeta.height}\`, fs.statSync(out).size, 'bytes');
  }
})();
"
```

Expected: 7 lines, each `256x256`, well under 50KB.

- [ ] **Step 5: Clean up and verify**

```bash
cd "c:\Users\HP\Documents\GitHub\st.school2" && rm -f .tmp-icon-*.png
ls -la public/images/icons/
```

Expected: exactly 7 `.webp` files.

- [ ] **Step 6: Commit**

```bash
git add public/images/icons/
git commit -m "assets: add Pixar-style icon set (stat row + why-us)"
```

---

### Task 3: `CourseStatRow` icon integration

**Files:**
- Modify: `src/components/courses/stat-row.tsx`

**Interfaces:**
- Consumes: `public/images/icons/{duration,mode,level}.webp` (Task 2).
- Produces: `CourseStatRow` renders unchanged props/behavior, new visual only.

- [ ] **Step 1: Replace the lucide icons with generated images**

Replace the full contents of `src/components/courses/stat-row.tsx`:

```tsx
import Image from "next/image";
import type { Course } from "@/data/content";
import { assetBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import { COLOR_THEME } from "./color-theme";

export function CourseStatRow({
  course,
  className,
}: {
  course: Pick<Course, "duration" | "mode" | "level" | "color">;
  className?: string;
}) {
  const theme = COLOR_THEME[course.color];
  const stats = [
    { icon: `${assetBasePath}/images/icons/duration.webp`, label: "Duration", value: course.duration },
    { icon: `${assetBasePath}/images/icons/mode.webp`, label: "Mode", value: course.mode },
    { icon: `${assetBasePath}/images/icons/level.webp`, label: "Level", value: course.level },
  ];

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {stats.map(({ icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-full", theme.bgSoft)}>
            <Image src={icon} alt="" width={56} height={56} className="size-10 object-contain" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-soft">
              {label}
            </span>
            <span className="text-sm font-medium text-paper/90">{value}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
```

Note `alt=""` — these icons are purely decorative next to a text label that already conveys the same information ("Duration", "12 weeks"), so an empty alt is the correct accessible pattern (avoids screen readers announcing redundant/meaningless image descriptions).

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/courses/stat-row.tsx
git commit -m "feat: use Pixar-style icons in CourseStatRow"
```

---

### Task 4: `WhyUs` (homepage) icon integration

**Files:**
- Modify: `src/components/sections/why-us.tsx`

**Interfaces:**
- Consumes: `public/images/icons/why-us-{1,2,3,4}.webp` (Task 2).

- [ ] **Step 1: Replace the lucide icons array with image paths**

In `src/components/sections/why-us.tsx`, replace:

```ts
import { Users, Hammer, Network, UserCheck, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { whyUs } from "@/data/content";
import { cn } from "@/lib/utils";

const icons: LucideIcon[] = [Users, Hammer, Network, UserCheck];
```

with:

```ts
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { whyUs } from "@/data/content";
import { assetBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

// Positional match to the `whyUs` content array (content/why-us.json) —
// same coupling already used by `accents`/`iconColors` below.
export const WHY_US_ICONS = [
  `${assetBasePath}/images/icons/why-us-1.webp`,
  `${assetBasePath}/images/icons/why-us-2.webp`,
  `${assetBasePath}/images/icons/why-us-3.webp`,
  `${assetBasePath}/images/icons/why-us-4.webp`,
];
```

- [ ] **Step 2: Replace the icon rendering**

Replace:

```tsx
                    <span
                      className={cn(
                        "flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5",
                        iconColors[i % iconColors.length],
                      )}
                    >
                      <Icon className="size-6" strokeWidth={1.75} />
                    </span>
```

with:

```tsx
                    <span
                      className="flex size-16 items-center justify-center rounded-2xl border border-white/15 bg-white/5"
                    >
                      <Image
                        src={WHY_US_ICONS[i % WHY_US_ICONS.length]}
                        alt=""
                        width={64}
                        height={64}
                        className="size-12 object-contain"
                      />
                    </span>
```

And remove the now-unused `const Icon = icons[i % icons.length];` line inside the `.map()` callback (the icon is now looked up directly by index in the JSX above, no intermediate variable needed).

- [ ] **Step 3: Remove the now-dead `iconColors` array**

`iconColors` (`const iconColors = ["text-violet-light", "text-coral-light", "text-acid", "text-violet-light"];`, defined right after the `accents` array) had exactly one use — the icon badge's text color class — which Step 2 just removed. Delete the `iconColors` declaration entirely; leave `accents` alone (still used by the card background gradient). Skipping this leaves an unused-variable lint error.

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run build`
Expected: Both succeed with no unused-variable warnings (confirms `icons`, `Icon`, and `iconColors` were all fully removed, not just their primary usages).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/why-us.tsx
git commit -m "feat: use Pixar-style icons in the homepage Why Us section"
```

---

### Task 5: `WhyUsRow` (About page) icon addition

**Files:**
- Modify: `src/components/about/why-us-row.tsx`
- Modify: `src/app/about/page.tsx`

**Interfaces:**
- Consumes: `WHY_US_ICONS` (exported from Task 4's `why-us.tsx`).
- Produces: `WhyUsRow` gains an `icon: string` prop (required), rendered alongside the existing number.

- [ ] **Step 1: Add the `icon` prop to `WhyUsRow`**

In `src/components/about/why-us-row.tsx`, add the import and prop:

```tsx
"use client";

import { type MouseEvent, useRef } from "react";
import { motion, useInView, useMotionValue } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
```

Change the prop signature:

```tsx
export function WhyUsRow({
  index,
  title,
  description,
  icon,
  reverse,
}: {
  index: number;
  title: string;
  description: string;
  icon: string;
  reverse: boolean;
}) {
```

- [ ] **Step 2: Render the icon next to the number**

Replace:

```tsx
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 + index * 0.07 }}
        className="font-display relative shrink-0 text-3xl font-semibold text-muted-soft transition-colors group-hover:text-violet-light sm:w-24 sm:text-4xl"
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>
```

with:

```tsx
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 + index * 0.07 }}
        className="relative flex shrink-0 items-center gap-3 sm:w-24 sm:flex-col sm:items-start sm:gap-2"
      >
        <Image src={icon} alt="" width={48} height={48} className="size-10 object-contain sm:size-12" />
        <span className="font-display text-2xl font-semibold text-muted-soft transition-colors group-hover:text-violet-light sm:text-3xl">
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>
```

- [ ] **Step 3: Pass the icon from the About page**

In `src/app/about/page.tsx`, add the import:

```tsx
import { WHY_US_ICONS } from "@/components/sections/why-us";
```

Change the `WhyUsRow` usage:

```tsx
          <div className="flex flex-col divide-y divide-white/10 border-t border-white/10">
            {whyUs.map((item, i) => (
              <WhyUsRow
                key={item.title}
                index={i}
                title={item.title}
                description={item.description}
                icon={WHY_US_ICONS[i % WHY_US_ICONS.length]}
                reverse={i % 2 === 1}
              />
            ))}
          </div>
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: Succeeds (a missing `icon` prop would be a TypeScript error here since it's required — confirms the wiring is complete).

- [ ] **Step 5: Manual browser check**

`npm run dev`, open `http://localhost:3000/st.school2/about/`, scroll to "Why we exist".
Expected: Each row shows a small icon next to its number, alternating layout (left/right per `reverse`) still works, no layout break on mobile width.

- [ ] **Step 6: Commit**

```bash
git add src/components/about/why-us-row.tsx src/app/about/page.tsx
git commit -m "feat: add Pixar-style icons to About page Why Us rows"
```

---

### Task 6: `MascotBanner` homepage section

**Files:**
- Create: `src/components/sections/mascot-banner.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `public/images/mascot/homepage.webp` (Task 1).
- Produces: `MascotBanner() => JSX.Element`, no props.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { assetBasePath } from "@/lib/base-path";

export function MascotBanner() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
        <Reveal className="order-2 flex flex-col items-start gap-6 lg:order-1">
          <h2 className="font-display max-w-lg text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
            Could be you, <span className="text-gradient">33 seats from now.</span>
          </h2>
          <p className="max-w-md text-balance text-base leading-relaxed text-muted sm:text-lg">
            No lecture halls, no filler. Just a hand-picked cohort building the kind of
            work that gets you hired — starting the day you get selected.
          </p>
          <Button href="/courses" variant="primary" className="px-7 py-3.5 text-base">
            Explore Programs
          </Button>
        </Reveal>

        <Reveal delay={0.12} className="relative order-1 mx-auto w-full max-w-sm lg:order-2">
          <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-coral/25 via-transparent to-violet/20 blur-3xl" />
          <Image
            src={`${assetBasePath}/images/mascot/homepage.webp`}
            alt="A St.School student, confident and ready to build"
            width={928}
            height={1152}
            className="mx-auto h-auto w-full max-w-[22rem]"
            priority={false}
          />
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Wire it into the homepage**

In `src/app/page.tsx`, add the import:

```tsx
import { MascotBanner } from "@/components/sections/mascot-banner";
```

Insert `<MascotBanner />` between `<WhyUs />` and `<ProgramsPreview />`:

```tsx
      <WhyUs />
      <MascotBanner />
      <ProgramsPreview />
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 4: Manual browser check**

`npm run dev`, open `http://localhost:3000/st.school2/`, scroll past "Why St.School".
Expected: New section with the mascot image (transparent background blending into the page, soft coral/violet glow behind it) and the "Could be you, 33 seats from now." heading, before the programs grid. Image loads without 404 (check it resolves under `/st.school2/images/mascot/homepage.webp`).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/mascot-banner.tsx src/app/page.tsx
git commit -m "feat: add homepage mascot banner section"
```

---

### Task 7: About page "Brand story" mascot layout

**Files:**
- Modify: `src/app/about/page.tsx`

**Interfaces:**
- Consumes: `public/images/mascot/about-story.webp` (Task 1).

- [ ] **Step 1: Add the `next/image` and `assetBasePath` imports**

Add to the top of `src/app/about/page.tsx` (alongside the existing imports):

```tsx
import Image from "next/image";
import { assetBasePath } from "@/lib/base-path";
```

- [ ] **Step 2: Restructure the "Brand story" section into 2 columns**

Replace:

```tsx
      {/* Brand story */}
      <section className="relative py-24 sm:py-32">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow={aboutPage.storyEyebrow}
            title={
              <>
                {aboutPage.storyHeadingPrefix}{" "}
                <span className="text-gradient">{aboutPage.storyHeadingHighlight}</span>
              </>
            }
            description={parentBrand.description}
          />

          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-6 text-sm">
              <span className="flex items-center gap-2.5 text-paper/85">
                <UserRound className="size-4 text-violet-light" strokeWidth={2.25} />
                Founded by <span className="font-medium text-paper">{parentBrand.founder}</span>
              </span>
              <span className="flex items-center gap-2.5 text-paper/85">
                <MapPin className="size-4 text-coral-light" strokeWidth={2.25} />
                Headquartered in <span className="font-medium text-paper">{parentBrand.hq}</span>
              </span>
              <span className="flex items-center gap-2.5 text-paper/85">
                <Building2 className="size-4 text-acid" strokeWidth={2.25} />
                Runs today as <span className="font-medium text-paper">{site.name}</span>
              </span>
            </div>
          </Reveal>
        </Container>
      </section>
```

with:

```tsx
      {/* Brand story */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          <div className="flex flex-col gap-10">
            <SectionHeading
              eyebrow={aboutPage.storyEyebrow}
              title={
                <>
                  {aboutPage.storyHeadingPrefix}{" "}
                  <span className="text-gradient">{aboutPage.storyHeadingHighlight}</span>
                </>
              }
              description={parentBrand.description}
            />

            <Reveal delay={0.1}>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-6 text-sm">
                <span className="flex items-center gap-2.5 text-paper/85">
                  <UserRound className="size-4 text-violet-light" strokeWidth={2.25} />
                  Founded by <span className="font-medium text-paper">{parentBrand.founder}</span>
                </span>
                <span className="flex items-center gap-2.5 text-paper/85">
                  <MapPin className="size-4 text-coral-light" strokeWidth={2.25} />
                  Headquartered in <span className="font-medium text-paper">{parentBrand.hq}</span>
                </span>
                <span className="flex items-center gap-2.5 text-paper/85">
                  <Building2 className="size-4 text-acid" strokeWidth={2.25} />
                  Runs today as <span className="font-medium text-paper">{site.name}</span>
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.16} className="relative mx-auto w-full max-w-xs">
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-violet/20 via-transparent to-coral/25 blur-3xl" />
            <Image
              src={`${assetBasePath}/images/mascot/about-story.webp`}
              alt="A St.School student waving"
              width={928}
              height={1152}
              className="mx-auto h-auto w-full max-w-[18rem]"
            />
          </Reveal>
        </Container>
      </section>
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 4: Manual browser check**

`npm run dev`, open `http://localhost:3000/st.school2/about/`.
Expected: "Brand story" section now shows the mascot on the right (desktop) with a soft violet/coral glow, text/facts on the left; stacks vertically on mobile with the image above or below the text (grid default order — verify it reads naturally, image second is fine since `grid` doesn't reorder unless specified, and this section doesn't need the reorder trick `MascotBanner` uses since there's no strong "read image first" narrative need here).

- [ ] **Step 5: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: add mascot illustration to About page brand story section"
```

---

### Task 8: Course page closing CTA mascot layout

**Files:**
- Modify: `src/app/courses/[slug]/page.tsx`

**Interfaces:**
- Consumes: `public/images/mascot/course-python.webp`, `public/images/mascot/course-uiux.webp` (Task 1).

- [ ] **Step 1: Add imports**

Add to `src/app/courses/[slug]/page.tsx`:

```tsx
import Image from "next/image";
import { assetBasePath } from "@/lib/base-path";
```

- [ ] **Step 2: Compute the per-template mascot path**

Inside `CourseDetailPage`, after the existing `const template = course.template;` line, add:

```tsx
  // Only the two bespoke templates have a matching mascot scene — "generic"
  // has no asset to show and keeps today's centered closing CTA layout.
  const mascotSrc =
    template === "python-ai"
      ? `${assetBasePath}/images/mascot/course-python.webp`
      : template === "ui-ux"
        ? `${assetBasePath}/images/mascot/course-uiux.webp`
        : null;
```

- [ ] **Step 3: Restructure the closing CTA section**

Replace:

```tsx
      {/* e. Closing CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className={cn("absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] opacity-30", theme.bgGlow)} />
        </div>
        <Container className="flex flex-col items-center gap-6 text-center">
          <Reveal>
            <h2 className="font-display max-w-2xl text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
              {closingCtaHeadingPrefix}
              {closingCtaHeadingSuffix !== undefined ? (
                <span className="text-gradient">
                  {course.shortName}
                  {closingCtaHeadingSuffix}
                </span>
              ) : null}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
              {closingCtaBody}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <Button href="/contact" variant="primary" className="px-7 py-3.5 text-base">
              Apply for this program
            </Button>
          </Reveal>
        </Container>
      </section>
```

with:

```tsx
      {/* e. Closing CTA */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className={cn("absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] opacity-30", theme.bgGlow)} />
        </div>
        <Container>
          {mascotSrc ? (
            <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
              <Reveal className="relative mx-auto w-full max-w-xs lg:order-1">
                <Image
                  src={mascotSrc}
                  alt=""
                  width={928}
                  height={1152}
                  className="mx-auto h-auto w-full max-w-[18rem]"
                />
              </Reveal>
              <div className="flex flex-col items-center gap-6 text-center lg:order-2 lg:items-start lg:text-left">
                <Reveal>
                  <h2 className="font-display max-w-2xl text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
                    {closingCtaHeadingPrefix}
                    {closingCtaHeadingSuffix !== undefined ? (
                      <span className="text-gradient">
                        {course.shortName}
                        {closingCtaHeadingSuffix}
                      </span>
                    ) : null}
                  </h2>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
                    {closingCtaBody}
                  </p>
                </Reveal>
                <Reveal delay={0.14}>
                  <Button href="/contact" variant="primary" className="px-7 py-3.5 text-base">
                    Apply for this program
                  </Button>
                </Reveal>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 text-center">
              <Reveal>
                <h2 className="font-display max-w-2xl text-balance text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl">
                  {closingCtaHeadingPrefix}
                  {closingCtaHeadingSuffix !== undefined ? (
                    <span className="text-gradient">
                      {course.shortName}
                      {closingCtaHeadingSuffix}
                    </span>
                  ) : null}
                </h2>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
                  {closingCtaBody}
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <Button href="/contact" variant="primary" className="px-7 py-3.5 text-base">
                  Apply for this program
                </Button>
              </Reveal>
            </div>
          )}
        </Container>
      </section>
```

Note `alt=""` on the course-page mascot images — purely decorative accompaniment to a heading that already states the program name; unlike the homepage/About mascots (which are the primary content of their section and get a real `alt`), this one sits next to fully-descriptive text.

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: Succeeds; static page list still includes all 3 course pages.

- [ ] **Step 5: Manual browser check**

`npm run dev`. On `http://localhost:3000/st.school2/courses/python-fullstack-ai/` and `.../ui-ux-design/`, scroll to the closing CTA (before the cross-link section).
Expected: 2-column layout, mascot image left, heading/body/button right (both centered-stacking on mobile). On `http://localhost:3000/st.school2/courses/test/` (template `"generic"`), confirm the closing CTA is unchanged — still centered, no mascot, no layout shift or broken grid.

- [ ] **Step 6: Commit**

```bash
git add "src/app/courses/[slug]/page.tsx"
git commit -m "feat: add mascot illustration to course page closing CTAs"
```

---

### Task 9: Full verification and push

**Files:** None (verification only).

- [ ] **Step 1: Full lint + build**

Run: `npm run lint && npm run build`
Expected: Both exit 0. Route list unchanged from before this feature (same pages, same count).

- [ ] **Step 2: Full visual walkthrough**

With `npm run dev` running:
1. Homepage (`/st.school2/`) — mascot banner between Why Us and Programs, all icons in Why Us cards.
2. About page (`/st.school2/about/`) — mascot in Brand story, icons in each Why Us row, `Process` section and `ProcessProgressLine` visually unchanged (still the animated numbered circles / connecting line, no icons).
3. Python course page — `CourseStatRow` icons, closing CTA mascot (coding pose).
4. UI/UX course page — `CourseStatRow` icons, closing CTA mascot (sketching pose), classroom gallery (from the prior feature) still intact and unaffected.
5. `test` course page — closing CTA unchanged (no mascot, centered layout), `CourseStatRow` icons still apply (that component isn't template-gated).
6. Check the browser Network tab on at least 2 of the above pages: zero 404s for anything under `/st.school2/images/`.

- [ ] **Step 3: Stop the dev server**

```bash
powershell -NoProfile -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
```

- [ ] **Step 4: Push**

```bash
git push origin claude/stschool-website-redesign-aio5tq
```

Expected: Push succeeds; triggers `.github/workflows/deploy-pages.yml`, redeploying the live site with every commit from Tasks 1-8.
