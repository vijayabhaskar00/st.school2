# Pixar-style genz visuals: mascot + icon set

Date: 2026-08-02
Status: Approved

## Problem

The site has zero photographic or illustrated content beyond code-generated
Remotion hero animations (and, as of the previous feature, 4 real classroom
photos on the UI/UX course page). The brand reads as premium/editorial-dark
but has no personality-driven visual identity — no character, no
illustration, nothing that says "genz" or gives the site warmth beyond copy
and motion. The ask: introduce Pixar/DreamWorks-style 3D-rendered visuals —
a recurring mascot character for the big moments, and a small matching icon
set for repeated content concepts (duration/mode/level, why-us reasons) —
without disturbing the two existing bespoke Remotion hero pieces (homepage,
Python course, UI/UX course), which stay exactly as they are.

## Style direction (approved via sample generation)

Rendering style: Pixar/DreamWorks 3D character render — appealing
exaggerated proportions, smooth subsurface-scattering skin, soft rounded
features, detailed hair/cloth simulation, soft global illumination with a
warm coral-red rim light matching the brand's `--color-coral` accent. A
sample was generated and approved (`nano_banana_2`, prompt logged below) —
character: genz Indian college-age student, dark curly hair, coral-red
hoodie with subtle geometric pattern, black joggers, white sneakers.

**Approved sample prompt (canonical character description — reuse verbatim
in every mascot prompt, varying only pose/scene/props):**

```
[SCENE-SPECIFIC POSE/PROPS], a 3D-stylized Pixar/DreamWorks-style animated
character render of a genz Indian college-age student in his early
twenties, [SCENE-SPECIFIC ACTION], stylized 3D character render, appealing
exaggerated proportions, smooth subsurface-scattering skin, soft rounded
features, detailed hair strands and cloth simulation, dark curly hair,
wearing a coral-red hoodie with a subtle geometric pattern and black
joggers, white sneakers, soft global illumination, three-point studio
lighting, gentle rim light in coral-red and warm amber tones, [BACKGROUND —
see below], high-end 3D animation studio quality, octane-style render,
clean composition, 4K, no text, no watermark, no logos
```

**Background note (correction from the first sample):** the approved sample
had a literal illustrated bedroom (poster, bookshelf, bed) — too specific
for compositing onto the site's near-black `ink` background. Production
generations use `[BACKGROUND]` = `plain dark charcoal near-black background
with a soft radial coral-red glow behind the character, no furniture, no
room details` so the background-removal step (below) has a clean edge to
work with, and the result reads as native to the site even where removal
imperfectly catches soft glow edges.

## Mascot: 4 scenes

| # | Placement | File | Pose/props |
|---|-----------|------|------------|
| 1 | Homepage — new section between `WhyUs` and `ProgramsPreview` | `public/images/mascot/homepage.png` | Standing, confident, arms crossed or a small wave, genuinely happy — represents "a St.School student," not tied to either specific program |
| 2 | About page — "Brand story" section | `public/images/mascot/about-story.png` | Similar standing/confident pose, slightly different angle than #1 so it doesn't read as a duplicate |
| 3 | Python course page — closing CTA | `public/images/mascot/course-python.png` | Sitting/leaning with a laptop, coding pose (can reuse the spirit of the approved sample, regenerated with the corrected background) |
| 4 | UI/UX course page — closing CTA | `public/images/mascot/course-uiux.png` | Sketching on a tablet/drawing pad, a wireframe or UI mockup visible, design-tool energy instead of code |

**Consistency approach:** every prompt repeats the canonical character
description verbatim. Additionally, pass generation #1's result as a
reference input to generations #2-4 via `generate_image`'s `medias` param —
`nano_banana_2` accepts exactly one media role, `"image"`
(confirmed via `models_explore(action:"get", model_id:"nano_banana_2")`) —
so the model has a visual anchor, not just matching text. Minor variation
between scenes is expected and acceptable — this is a marketing site, not a
frame-locked animated series; if any generation reads as a clearly
different character (skin tone, build, hair shifts materially), regenerate
that one before moving on.

**Background removal + compositing:** each raw generation goes through
`remove_background` for a clean transparent PNG, then `sharp` resize to a
reasonable web width (max ~1200px, the largest of the four placements),
`.png` output (not `.jpg` — transparency required). On the page, each sits
against the existing dark background with a soft coral/violet blur glow
behind it — the same `bgGlow`/radial-gradient treatment already used behind
every other hero visual on the site (`HeroParallaxGlow`, `TiltCard`
wrappers, etc.), so no new visual language is introduced, just a new asset
type filling an existing pattern.

## Icon set: 7 icons

| Concept | File | Used in |
|---|---|---|
| Duration (clock) | `public/images/icons/duration.png` | `CourseStatRow` (both course pages) |
| Mode (online/offline) | `public/images/icons/mode.png` | `CourseStatRow` |
| Level (graduation) | `public/images/icons/level.png` | `CourseStatRow` |
| "33 seats, not 3,000" | `public/images/icons/why-us-1.png` | `WhyUs` (homepage) + `WhyUsRow` (About) |
| "Built on real projects" | `public/images/icons/why-us-2.png` | same |
| "Backed by Student Tribe" | `public/images/icons/why-us-3.png` | same |
| "Mentors who show up" | `public/images/icons/why-us-4.png` | same |

Each icon: same 3D-stylized render family (smaller, single-object
renders — a clock, a laptop-with-globe, a graduation cap, etc. — not
characters), coral/violet/acid accent lighting matching the existing
`iconColors`/`accents` arrays already defined in `why-us.tsx`, generated on
a clean background, `remove_background`'d, resized to ~256px, `.png`.

**Why not Process steps or `ProcessProgressLine`:** confirmed during design
that `Process`'s step markers are animated color-shifting circles driven by
scroll progress (`ProcessStepMarker` in `process.tsx`) — replacing them
with static icons would sacrifice that built animation for no clear
benefit, so `Process` is explicitly out of scope. `ProcessProgressLine` is
a decorative connecting line, not a per-step marker, and isn't touched.

## Component changes

### `CourseStatRow` (`src/components/courses/stat-row.tsx`)
Replace the `lucide-react` `Clock`/`Laptop`/`GraduationCap` icons with
`next/image` renders of the 3 generated icons. Badge size increases from
`size-8` (32px) to `size-14` (56px) so the 3D render detail actually reads;
inner icon fills most of the badge instead of a small centered glyph.

### `WhyUs` (`src/components/sections/why-us.tsx`)
Replace the `Users`/`Hammer`/`Network`/`UserCheck` lucide icons with the 4
generated why-us icons. Badge size increases from `size-12` (48px) to
`size-16` (64px).

### `WhyUsRow` (`src/components/about/why-us-row.tsx`)
New optional `icon` prop (`string`, an image src) rendered as a small
`next/image` badge next to the existing big number — the number stays (it's
part of this component's identity), the icon is added alongside it, not a
replacement. `src/app/about/page.tsx` passes the matching icon path per
`whyUs` array index (same positional-index coupling already used by
`why-us.tsx`'s `icons`/`accents`/`iconColors` arrays — an established
pattern in this codebase, not a new risk).

### Homepage: new `MascotBanner` section
New file `src/components/sections/mascot-banner.tsx` — a simple, focused
section: mascot image (with glow) on one side, a short headline + one-line
copy on the other. The headline/copy is written directly in the component
as plain JSX strings, not added to `content/*.json` — this matches the
established precedent in `final-cta.tsx`, whose headline ("{seats} seats.
One cohort. Your move.") is likewise hardcoded JSX, not CMS-sourced; not
every section's copy goes through the CMS today. Wired into
`src/app/page.tsx` between `<WhyUs />` and `<ProgramsPreview />`.

### About page (`src/app/about/page.tsx`)
"Brand story" section (currently plain single-column text) becomes a
2-column grid: existing text/facts on the left, `about-story.png` mascot
(with glow) on the right — mirrors the top hero section's existing
text-left/`OriginNetwork`-right layout, so the page gains a second visual
moment using an established layout pattern, not a new one.
Also passes `icon` into each `WhyUsRow` (see above).

### Course detail page (`src/app/courses/[slug]/page.tsx`)
Closing CTA section (currently centered single-column) becomes a 2-column
grid on `template === "python-ai"` / `template === "ui-ux"` (mascot image
on one side, heading/body/button on the other); `template === "generic"`
keeps today's centered layout unchanged (no mascot asset exists for a
hypothetical third course).

## Out of scope

- Logo, favicon, OG/social-share image — explicitly excluded per earlier
  scope decision.
- Any change to the existing Remotion hero pieces (`SelectionFieldPlayer`,
  `NeuralPulsePlayer`, `DesignSystemBuildPlayer`) — they stay exactly as
  they are, on all three pages that use them.
- `Process` section icons and `ProcessProgressLine` — see rationale above.
- Functional/chrome UI icons (arrows, checkmarks, locks, chevrons, CMS
  editor buttons, etc.) — stay as `lucide-react` line icons. Only
  content-concept icons (duration/mode/level, why-us reasons) get the
  Pixar treatment.
- No new npm dependency — `sharp` used ad hoc from
  `node_modules/next/node_modules/sharp`, same as the classroom-gallery
  feature.

## Testing / verification

- `npm run lint` and `npm run build` must pass (typechecks + statically
  renders every page using these components).
- Manual browser check of all 4 mascot placements (homepage, About,
  Python course closing CTA, UI/UX course closing CTA) — image loads under
  the `/st.school2` basePath (apply the same `assetBasePath`-prefixing fix
  discovered during the classroom-gallery work — `next/image` does not
  auto-prefix `basePath` when `images.unoptimized: true`), no layout shift,
  looks intentional against the dark background (no visible background-
  removal fringing/haloing).
- Manual check of all 7 icons at their actual on-page size — confirm they
  read as recognizable shapes, not mud, at the enlarged badge sizes.
- Regression check: `test` course page (template `"generic"`) closing CTA
  unchanged; `Process` section animation (color-shift-on-scroll) unchanged
  on both homepage and About page.
