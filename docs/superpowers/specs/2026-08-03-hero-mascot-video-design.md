# Hero right-side visual: replace abstract data-viz with mascot video

Date: 2026-08-03
Status: Approved

## Problem

The homepage hero's right column currently renders `SelectionFieldPlayer`, a
Remotion composition (`src/remotion/selection-field.tsx`) that dramatizes
"1,000+ applicants → 33 selected → 95% placed" as an abstract particle field
and rotating ring of dots, with the phase name cycling as overlaid text
inside the circular frame.

Since that piece was built, the site has established a completely different
visual identity for its "big moments": a recurring Pixar/DreamWorks-style 3D
mascot character (see
[2026-08-02-pixar-genz-visuals-design.md](2026-08-02-pixar-genz-visuals-design.md)),
now animated as looping Higgsfield-generated video on the homepage mascot
banner, the About page brand story, and both course-page closing CTAs (see
[2026-08-02-mascot-animation-design.md](2026-08-02-mascot-animation-design.md)).
The hero — the first thing every visitor sees — is the one major visual
still using the old abstract/dots-and-lines language. It reads as
disconnected from the rest of the site's now-established character-driven
identity.

Note: the funnel numbers the abstract animation dramatizes are already shown
as counters in the hero's own left column (`heroStats`: "1,000+ applications
per cohort", "33 seats offered, no more", "95% placement track record"), so
the right column is free to carry the story emotionally/visually instead of
restating it as data.

## Approach

Replace `SelectionFieldPlayer` with a new Higgsfield-generated mascot video:
a single continuous loop depicting a two-beat motion arc —

1. **Applying** — the mascot at a laptop, typing/submitting.
2. **Selected** — looks up, holds up an acceptance badge/lanyard, breaks
   into a confident celebration (fist-pump / arms-up energy).

The clip settles back toward its starting pose by the final frame, the same
loop-quality lever established in the prior mascot-animation spec. This
reuses the existing `MascotVideo` component (`src/components/mascot/mascot-video.tsx`)
unchanged — no new component needed — and the existing `assetBasePath`,
edge-mask, reduced-motion, and in-view-pause behavior it already provides.

## Asset generation

**New start-frame still:** `public/images/mascot/hero-select.webp`. None of
the 4 existing mascot stills show a laptop/submitting pose, so this is a new
generation via `nano_banana_2`, using the site's canonical character
description verbatim (genz Indian college-age student, dark curly hair,
coral-red hoodie with subtle geometric pattern, black joggers, white
sneakers — see the pixar-genz-visuals spec for the full canonical prompt)
with a submitting/typing pose and the established clean-background note
(`plain dark charcoal near-black background with a soft radial coral-red
glow behind the character, no furniture, no room details`). Pass an existing
approved mascot still as a `medias` reference input for character
consistency, same pattern already used across the 4-scene mascot set.

Background removal (`remove_background`) and resize follow the same
pipeline as the other 4 stills.

**Video generation:** image-to-video from `hero-select.webp`, prompted for
the full two-beat arc described above, with explicit instruction that the
motion return near the starting pose by the final frame. Start with
`kling3_0_turbo` per the precedent set in the prior mascot-animation spec,
confirming exact parameters via `models_explore(action:"get",
model_id:"kling3_0_turbo")` first. Recent history on this repo already
needed a regeneration in **pro mode** to fix quality on one of the existing
4 clips (`f7651b7`) — pro mode is the fallback here if turbo can't handle
this longer, more complex arc cleanly.

Output saved as `public/images/mascot/hero-select.mp4`, same convention as
the 4 existing clips.

**Validation checkpoint:** this is the single highest-visibility placement
on the site. Generate the clip, inspect it (background blend, loop seam,
whether the badge/lanyard prop reads clearly and on-brand, whether the
celebration beat looks intentional rather than glitchy), and get explicit
human sign-off before wiring it into the live component — do not treat a
first-pass generation as final by default, even though there's only one
clip to produce here.

## Component changes

**`src/components/sections/hero.tsx`:**
- Remove the `SelectionFieldPlayer` dynamic import, its loading skeleton,
  and the `TiltCard`-wrapped circular-crop treatment currently used for it.
- Render `MascotVideo` in its place, with a soft coral/violet blur-glow
  backdrop `<div>` behind it — the same treatment already used in
  `mascot-banner.tsx` (`pointer-events-none absolute -inset-10 -z-10
  rounded-full bg-gradient-to-br from-coral/25 via-transparent to-violet/20
  blur-3xl`), sized for the hero's column. Portrait framing, no circular
  crop — matches the mascot's treatment everywhere else on the site.
- Keep the existing entrance `motion.div` (fade/scale-in on mount) wrapping
  the right column, and keep the caption text below it ("1,000+ apply. 33
  selected. 95% placed.") exactly as-is.
- `heroStats` / left column: untouched.

**Cleanup:** `src/remotion/selection-field.tsx` and
`src/components/remotion/selection-field-player.tsx` are referenced nowhere
else in the codebase (confirmed via search) — delete both rather than
leaving orphaned code behind.

## Out of scope

- The other Remotion hero pieces still in active use
  (`NeuralPulsePlayer`/`neural-pulse.tsx`,
  `DesignSystemBuildPlayer`/`design-system-build.tsx` on the courses
  listing/course pages) — untouched.
- The 4 existing mascot clips (homepage banner, About brand story, both
  course-page closing CTAs) — untouched, no regeneration.
- `heroStats` content/left column layout — untouched.
- CMS: the caption text stays hardcoded JSX (matches existing precedent
  noted in the pixar-genz-visuals spec for `final-cta.tsx`/`mascot-banner.tsx`),
  not moved to `content/*.json`.

## Risks

1. **Loop-seam risk is higher than the existing single-gesture idle loops.**
   The existing 4 clips each animate one small gesture and return; this arc
   travels through two distinct beats (laptop → badge → celebration →
   reset), which is more for the model to land cleanly on a loop.
   Mitigated by the explicit "return to start pose" prompt instruction and
   the mandatory validation checkpoint above — if the seam is visibly
   broken, iterate on the prompt before shipping, don't ship a rough cut.
2. **Prop consistency.** An acceptance badge/lanyard is a new prop type not
   used in any of the 4 existing mascot generations; it may take more than
   one generation attempt to read clearly and match the brand's coral-red
   accent rather than looking like a generic ID card.
3. **New still needs the same manual QA** the other 4 stills got — check for
   background-removal fringing/haloing before trusting it as a video
   start-frame.

## Testing / verification

- `npm run lint` and `npm run build` must pass.
- Manual browser check (desktop + narrow viewport): video plays and loops,
  poster/static fallback renders correctly under `prefers-reduced-motion:
  reduce`, no layout shift versus the current hero layout, asset paths
  resolve correctly under the `/st.school2` basePath.
- Confirm the deleted Remotion files leave no dangling imports (`npm run
  build` covers this via type-checking).
