# Mascot animation: idle-loop video on all 4 placements

Date: 2026-08-02
Status: Approved

## Problem

The Pixar-style mascot character (from the previous genz-visuals feature) is
a static image in 4 places: homepage banner, About "brand story" section,
and the closing CTA on both the Python Full-Stack + AI and UI/UX course
pages. The ask: bring the mascot to life with animation, using the
already-connected Higgsfield MCP for image-to-video generation, with a
distinct gesture per placement rather than one motion reused everywhere.

## Approach

Each placement's existing static source image
(`public/images/mascot/{homepage,about-story,course-python,course-uiux}.webp`)
becomes the **start frame** for a short (~3-5s) Higgsfield image-to-video
generation — not a new character render, so identity/outfit/proportions
stay pixel-identical to what's already approved. The output is a looping
video, swapped in for the static `<Image>` in each of the 4 components.

**Model:** `kling3_0_turbo` (per Higgsfield's own guidance: "fast
text-to-video / single start-frame animation" — exactly this use case, one
still image animated from a text prompt, no motion-reference clip needed).
Exact parameter names (start-frame media role, duration range, aspect-ratio
options) aren't statically documented — the first implementation step is
`models_explore(action:"get", model_id:"kling3_0_turbo")` to confirm them
before generating anything, per systematic-debugging's "verify before
building" instinct.

**Upload pipeline:** the 4 source images already live on disk, not in
Higgsfield's media store, so each needs `media_upload` (presigned URL) →
PUT the file bytes → `media_confirm` → resulting `media_id` passed into
`generate_video`'s `medias` param. `get_cost:true` is checked once before
the first real generation to confirm spend, matching the cost-conscious
pattern already used for image generation in the prior feature.

## Per-page gesture direction

| Page | Source file | Gesture prompt direction |
|---|---|---|
| Homepage banner | `homepage.webp` | Confident idle stance — chin up, slight weight shift side to side, one small nod partway through, returns to the starting pose by the end of the clip. |
| About → brand story | `about-story.webp` | Friendly wave — raises a hand, waves 1-2 times, lowers back to the resting pose from the start frame. |
| Course CTA — Python Full-Stack + AI | `course-python.webp` | "Let's build" energy — a confident fist-pump or a quick typing/keyboard gesture, settling back to the start pose. |
| Course CTA — UI/UX Design | `course-uiux.webp` | Creative flourish — a sketching/hand-sweep "presenting my work" gesture, settling back to the start pose. |

Every prompt explicitly asks the motion to **return to the starting pose by
the final frame** — this is the main lever available for loop quality (see
Risks below), since these models don't guarantee a frame-accurate loop
otherwise.

## Component design

**New component:** `src/components/courses/mascot-video.tsx` (client
component, name reflects it's used beyond just courses — actually lives
under a shared location; see File placement note below).

Props: `{ videoSrc: string; posterSrc: string; alt: string; className?:
string }`.

Behavior:
- Renders `<video autoPlay loop muted playsInline poster={posterSrc}>` with
  a single `.mp4` source — Higgsfield's video output is mp4, and browser
  `<video>` support for mp4/H.264 is universal enough that a second codec
  source isn't needed here (unlike the image pipeline, which genuinely
  benefited from webp-with-alpha).
- `useReducedMotion()` (framer-motion, same hook already used in
  [reveal.tsx](../../../src/components/motion/reveal.tsx)) — when true,
  renders the existing static `<Image>` instead of a `<video>` at all. No
  video element is mounted for reduced-motion users.
- `IntersectionObserver` (via a small local hook, no new dependency) pauses
  the video when it scrolls out of the viewport and resumes on re-entry —
  keeps 4 looping videos from all decoding simultaneously off-screen.
- Both `videoSrc`/`posterSrc` are passed through `assetBasePath` by the
  caller (same pattern already used everywhere `next/image` src values are
  built), not hardcoded inside the component.

**File placement:** goes in `src/components/mascot/mascot-video.tsx` (new
`mascot/` folder) since it's shared across homepage, About, and course
pages — not courses-specific despite 2 of its 4 current uses being on
course pages.

**Callers updated (replace the existing static `<Image>` with
`<MascotVideo>`):**
- `src/components/sections/mascot-banner.tsx`
- `src/app/about/page.tsx` (brand-story section)
- `src/app/courses/[slug]/page.tsx` (closing CTA, both `python-ai` and
  `ui-ux` template branches)

Each caller keeps its existing glow-blob backdrop `<div>` and layout
wrapper untouched — only the image element itself is swapped for
`MascotVideo`, same width/height/sizing footprint as today so no layout
shift.

## Asset pipeline

For each of the 4 placements:
1. Upload the existing static `.webp` via `media_upload` → `media_confirm`.
2. `generate_video` with `model: "kling3_0_turbo"`, the confirmed media as
   the start-frame input, and that placement's gesture prompt (reusing the
   mascot's canonical character description from the prior spec is
   unnecessary here — the start-frame image already fixes identity, the
   prompt only needs to describe the motion).
3. Poll `job_status` (`sync: true`) until the video is ready.
4. Download the result, verify it locally (duration, resolution, whether
   the background matches the page's dark theme well enough — see Risks),
   and save as `public/images/mascot/{name}.mp4` (whatever container
   Higgsfield returns; re-encode only if the format is unusable in
   `<video>` directly — no ffmpeg dependency is being added, so if
   re-encoding turns out to be necessary this gets flagged back before
   proceeding, not silently worked around).
5. Keep the original `.webp` as the `poster` and reduced-motion fallback —
   no source images are deleted.

**Validate with one placement first.** Generate the homepage clip, inspect
it (background blend, loop seam, motion quality against the prompt) before
spending the same generation on the remaining 3 — this is the same
"generate one, sanity-check, then proceed" discipline used for the mascot
character sheet in the prior feature (where the first background-removal
sample failed and the prompt had to be corrected before mass-producing).

## Risks / open technical unknowns (flagged, not hidden)

1. **No transparency in video output.** The static mascot images are
   alpha-channel WebP (background already removed) sitting on the page's
   near-black background plus a soft coral/violet blur glow behind them.
   AI video generation does not produce alpha-channel output — the model
   will render *some* background around the character for the duration of
   the clip. Mitigation, in order of preference:
   - The site's actual background (`ink`/`ink-elevated`) is already very
     dark, so even a plain/neutral rendered backdrop is likely to read as
     "close enough" once composited under the existing blur-glow div.
   - Apply a CSS radial mask (`mask-image: radial-gradient(...)`) on the
     `<video>` element so its rectangular edges fade into the page
     background instead of showing a hard box edge — this fixes the "video
     box" problem regardless of what background color Higgsfield renders,
     so it's added proactively rather than only if needed.
   - If the first validation clip's background is badly inconsistent
     (patterned, wrong hue, clearly not near-black), stop and reassess
     before generating the other 3 — do not paper over a bad result by
     generating more of the same.

2. **Loop seam.** Prompting the motion to "return to the starting pose" is
   the only lever available (no end-frame constraint param confirmed yet
   for `kling3_0_turbo` — `models_explore(action:"get", ...)` in step 1
   will confirm if one exists). A minor jump-cut at the loop point is
   acceptable for this site (same "not a frame-locked animated series"
   tolerance already established in the prior mascot spec) as long as it
   doesn't look broken.

3. **Aspect ratio / framing drift.** Source images are 928×1152 (portrait,
   ~4:5). If `kling3_0_turbo` only supports a fixed set of aspect ratios
   that don't include a close match, the output may crop or letterbox the
   character. Confirmed during step 1; if no acceptable ratio exists, this
   gets raised before generating rather than shipping a badly-cropped
   mascot.

## Out of scope

- Re-generating the mascot character itself — source stills are reused
  as-is.
- The Remotion hero pieces (`SelectionFieldPlayer`, etc.) — untouched,
  consistent with the prior feature's scope boundary.
- Icon set (`why-us`, `stat-row` icons) — those are static, not part of
  this animation feature.
- Sound — all videos are `muted`, no `generate_audio` involved.

## Testing / verification

- `npm run lint` and `npm run build` must pass.
- Manual browser check (desktop + narrow viewport) of all 4 placements:
  video plays, loops, pauses off-screen (verify via DevTools — element's
  `paused` state toggling on scroll), poster/fallback shows correctly
  under `prefers-reduced-motion: reduce` (emulated via Playwright/DevTools,
  same approach used for reduced-motion checks elsewhere in the project).
- Confirm no layout shift versus the current static-image versions (same
  width/height footprint).
- Confirm asset paths resolve correctly under the `/st.school2` basePath in
  the static export output (same `assetBasePath`-prefixing check applied to
  every image/video asset in this project).
