# Hero Mascot Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the abstract `SelectionFieldPlayer` (Remotion particle/ring data-viz) in the homepage hero's right column with a Higgsfield-generated mascot video showing a two-beat "applying → selected" motion arc, matching the Pixar-style mascot identity already used elsewhere on the site.

**Architecture:** Two new binary assets (a still + a video) generated via the Higgsfield MCP tools and dropped into `public/images/mascot/` following the exact conventions of the 4 existing mascot clips, then one React component swap in `src/components/sections/hero.tsx` from the Remotion player to the already-existing generic `MascotVideo` component. The two now-orphaned Remotion files are deleted as part of the same change.

**Tech Stack:** Next.js 16 (static export), React 19, `MascotVideo` (`src/components/mascot/mascot-video.tsx`, already built and used unmodified), Higgsfield MCP tools (`generate_image`, `generate_video`, `media_upload`/`media_confirm`, `remove_background`, `models_explore`, `job_status`/`jobs_wait`, `upscale_video`), `sharp` (resolved ad hoc from `node_modules/next/node_modules/sharp`, no new npm dependency). No unit test runner exists in this repo (`package.json` only defines `dev`/`build`/`start`/`lint`) — verification throughout is `npm run lint`, `npm run build`, and manual visual QA, matching the precedent set by both prior mascot specs.

## Global Constraints

- No new npm dependency may be added — `sharp` is used via `node_modules/next/node_modules/sharp` (verified resolvable), matching the existing project convention.
- Every new asset path must be built through `assetBasePath` (from `src/lib/base-path.ts`), never a bare `/images/...` string — the static export serves under a `/st.school2` basePath.
- The canonical mascot character description (dark curly hair, coral-red hoodie with subtle geometric pattern, black joggers, white sneakers, Pixar/DreamWorks 3D render style) must be reused **verbatim**, varying only the scene-specific pose/action/background slots — see `docs/superpowers/specs/2026-08-02-pixar-genz-visuals-design.md`.
- **Known bug, already fixed once, do not reintroduce it:** never feed a transparent-background image directly as image-to-video start/end-frame input. Per `git show 63f48aa`, doing this bakes a coarse, blocky alpha matte into the character's silhouette in every output frame. Always flatten onto the site's exact background color (`#0d0d0f`, the `--color-ink` token) with `sharp().flatten({ background: "#0d0d0f" })` first, and use that flattened image as the model input — never the transparent one.
- **Model choice:** use `kling3_0` with `mode: "pro"`, not `kling3_0_turbo`. Per `git show f7651b7` and `63f48aa`, turbo mode produced visible edge fringing/ringing on this exact mascot pipeline; pro mode fixed it. Don't re-litigate this — start with pro mode directly.
- **Loop technique:** pin the *same* flattened still as both the start frame and the end frame of the video generation (confirmed available and already used successfully in `63f48aa`). This guarantees the loop returns to the exact starting pose, which is the main defense against the loop-seam risk flagged in the design spec.
- The existing `edge-mask.png` / `MascotVideo` compositing pipeline is reused unmodified — no new mask asset, no changes to `src/components/mascot/mascot-video.tsx`.
- New video must be muted, looped, `playsInline` — this is already handled inside `MascotVideo`, nothing to configure per-caller.
- Before calling any Higgsfield MCP tool, load its schema via `ToolSearch({ query: "select:<exact-tool-name>", max_results: 1 })` — these tools are deferred and their parameter schemas aren't loaded by default. The parameter shapes given in this plan reflect the pattern that already worked for the 4 existing mascot clips (see both 2026-08-02 specs); confirm exact key names against the loaded schema before calling, and adjust if the schema has since changed.

---

### Task 1: Generate the hero-select start-frame still

**Files:**
- Create: `public/images/mascot/hero-select.webp` (final, committed asset)
- Scratchpad (not committed): raw generation output, background-removed intermediate — use `C:\Users\HP\AppData\Local\Temp\claude\c--Users-HP-Documents-GitHub-st-school2\fd27519f-8a61-4da8-a932-5c0c261ed73a\scratchpad`

**Interfaces:**
- Consumes: an existing approved mascot still (e.g. `public/images/mascot/homepage.webp`) as a `medias` reference input for character consistency — same pattern used across the original 4-scene set.
- Produces: `public/images/mascot/hero-select.webp` — a 928×1152 (matching the other 4 stills' aspect ratio) alpha-channel WebP, background removed. Consumed by Task 2 (flattened for video generation) and Task 3 (used as `posterSrc` / reduced-motion fallback).

- [ ] **Step 1: Load the required tool schemas**

Call `ToolSearch` with `query: "select:mcp__claude_ai_HIggsfield__generate_image,mcp__claude_ai_HIggsfield__media_upload,mcp__claude_ai_HIggsfield__media_confirm,mcp__claude_ai_HIggsfield__remove_background,mcp__claude_ai_HIggsfield__job_status"`, `max_results: 10`.

- [ ] **Step 2: Upload the reference still**

Upload `public/images/mascot/homepage.webp` via `media_upload` (get a presigned URL) → PUT the file bytes to it → `media_confirm` → capture the returned `media_id`. This becomes the `medias` reference input for Step 3, giving the model a visual anchor for character consistency (same technique used for scenes 2-4 of the original mascot set).

- [ ] **Step 3: Generate the still**

Call `generate_image` with:
- `model: "nano_banana_2"`
- `medias`: `[{ role: "image", media_id: <from Step 2> }]`
- `prompt`:

```
Sitting at a laptop, mid-keystroke, focused and determined expression, about to submit an application, a 3D-stylized Pixar/DreamWorks-style animated character render of a genz Indian college-age student in his early twenties, typing on a laptop keyboard with focused concentration, stylized 3D character render, appealing exaggerated proportions, smooth subsurface-scattering skin, soft rounded features, detailed hair strands and cloth simulation, dark curly hair, wearing a coral-red hoodie with a subtle geometric pattern and black joggers, white sneakers, soft global illumination, three-point studio lighting, gentle rim light in coral-red and warm amber tones, plain dark charcoal near-black background with a soft radial coral-red glow behind the character, no furniture, no room details, high-end 3D animation studio quality, octane-style render, clean composition, 4K, no text, no watermark, no logos
```

Poll `job_status` (`sync: true`) until the generation completes. Download the resulting image to the scratchpad as `hero-select-raw.png`.

- [ ] **Step 4: Visually verify the raw generation**

Use the `Read` tool on the downloaded scratchpad image. Confirm: character matches the established mascot (skin tone, build, hair, hoodie color) closely enough to read as the same character (minor variation across scenes is expected and acceptable, per the original mascot spec's tolerance — only regenerate if it reads as a clearly different character). If it fails this check, adjust the prompt and repeat Step 3 before proceeding — do not carry a bad generation forward.

- [ ] **Step 5: Remove the background**

Call `remove_background` on the confirmed-good generation from Step 3/4. Download the resulting transparent PNG to the scratchpad as `hero-select-transparent.png`.

- [ ] **Step 6: Resize and convert to the final WebP**

Run this script (adjust the scratchpad paths to match Steps 3/5's actual output locations):

```js
const sharp = require("./node_modules/next/node_modules/sharp");

sharp("<scratchpad>/hero-select-transparent.png")
  .resize({ width: 928, height: 1152, fit: "cover" })
  .webp({ quality: 90 })
  .toFile("public/images/mascot/hero-select.webp")
  .then(() => console.log("done"));
```

Run via `node -e "<script>"` from the repo root (adjust to a `.js` scratch file if easier to iterate on).

- [ ] **Step 7: Verify the final still**

Run: `node -e "const sharp=require('./node_modules/next/node_modules/sharp'); sharp('public/images/mascot/hero-select.webp').metadata().then(m=>console.log(m))"`
Expected: `width: 928, height: 1152, hasAlpha: true, format: 'webp'`.

Use `Read` on `public/images/mascot/hero-select.webp` to visually confirm no background-removal fringing/haloing around the character's silhouette (same manual QA bar the other 4 stills passed).

- [ ] **Step 8: Commit**

```bash
git add public/images/mascot/hero-select.webp
git commit -m "assets: add hero mascot start-frame still (applying pose)"
```

---

### Task 2: Generate the hero-select motion-arc video

**Files:**
- Create: `public/images/mascot/hero-select.mp4` (final, committed asset)
- Scratchpad (not committed): flattened start/end-frame input, raw video output

**Interfaces:**
- Consumes: `public/images/mascot/hero-select.webp` from Task 1.
- Produces: `public/images/mascot/hero-select.mp4`, an MP4/H.264 looping clip. Consumed by Task 3 as the `videoSrc` passed to `MascotVideo`.

- [ ] **Step 1: Load the required tool schemas**

Call `ToolSearch` with `query: "select:mcp__claude_ai_HIggsfield__models_explore,mcp__claude_ai_HIggsfield__generate_video,mcp__claude_ai_HIggsfield__media_upload,mcp__claude_ai_HIggsfield__media_confirm,mcp__claude_ai_HIggsfield__job_status,mcp__claude_ai_HIggsfield__upscale_video"`, `max_results: 10`.

- [ ] **Step 2: Confirm `kling3_0` pro-mode parameters**

Call `models_explore(action: "get", model_id: "kling3_0")`. Confirm: the start-frame and end-frame media roles' exact parameter names, supported duration range/options, and supported aspect ratios (source is portrait ~4:5, matching the other 4 clips — confirm an acceptable ratio exists, same check the original mascot-animation spec called for).

- [ ] **Step 3: Flatten the still onto the site background color**

This is the fix from `63f48aa` — do not skip it. Run:

```js
const sharp = require("./node_modules/next/node_modules/sharp");

sharp("public/images/mascot/hero-select.webp")
  .flatten({ background: "#0d0d0f" })
  .toFile("<scratchpad>/hero-select-flattened.png")
  .then(() => console.log("done"));
```

- [ ] **Step 4: Upload the flattened still**

Upload `<scratchpad>/hero-select-flattened.png` via `media_upload` → PUT → `media_confirm` → capture the returned `media_id`. This single `media_id` is used for **both** the start frame and end frame in Step 5.

- [ ] **Step 5: Generate the video**

Call `generate_video` with:
- `model: "kling3_0"`
- `mode: "pro"`
- start-frame media: the `media_id` from Step 4 (exact param name confirmed in Step 2)
- end-frame media: the **same** `media_id` from Step 4 (pins the loop)
- duration: the largest option confirmed in Step 2 up to ~5-6s (enough room for two beats; the existing 4 clips used ~3-5s for a single gesture)
- `prompt`:

```
The character begins seated, typing on a laptop with focused energy. Partway through, he stops typing, looks up at the camera with a spark of excitement, then reaches off-frame and holds up a coral-red lanyard with an acceptance badge, breaking into a genuine, confident smile and a quick fist-pump / arms-up celebration. He then settles back down into the exact seated typing pose and expression from the very first frame, so the loop is seamless. Smooth, natural character animation, no camera movement, no background movement, no edge noise, no ringing artifacts, no flicker, clean silhouette edges throughout.
```

Poll `job_status` (`sync: true`) until complete. Download the result to the scratchpad as `hero-select-raw.mp4`.

- [ ] **Step 6: Verify duration/resolution/format**

Run: `ffprobe -v error -show_entries stream=width,height,codec_name,duration -of default=noprint_wrappers=1 "<scratchpad>/hero-select-raw.mp4"` (if `ffprobe`/`ffmpeg` isn't already available locally, download a standalone binary to the scratchpad for this check only — same approach used for diagnosis in `63f48aa`; never add it as a project dependency).
Expected: `codec_name=h264`, portrait resolution matching the source still's aspect ratio, duration matching what was requested in Step 5.

- [ ] **Step 7: Visual QA — this is the mandatory sign-off checkpoint**

Extract a few representative frames for inspection:

```bash
ffmpeg -i "<scratchpad>/hero-select-raw.mp4" -vf "select='eq(n,0)+eq(n,30)+eq(n,60)+eq(n,90)'" -vsync 0 "<scratchpad>/frame-%d.png"
```

Use `Read` on each extracted frame and check:
- Clean, non-blocky silhouette edges (confirms the flatten step in Step 3 worked — this is exactly the defect `63f48aa` fixed).
- The laptop-typing beat and the badge/celebration beat both read clearly and match the prompt.
- First and last frame look like the same pose (confirms the pinned-loop technique worked).
- Background is a flat, near-black tone consistent with `#0d0d0f`, no patterning.

**Do not proceed to Step 8 until this passes.** If it doesn't, adjust the prompt (or duration) and repeat from Step 5 — this mirrors the "generate, inspect, don't mass-produce a bad result" discipline both prior mascot specs used, elevated here because this is the highest-visibility placement on the site.

- [ ] **Step 8: Upscale for detail quality**

Call `upscale_video` on the verified clip from Step 7, matching the quality pass the other 4 clips already received (`580f5ef`). Download the result to the scratchpad as `hero-select-upscaled.mp4`.

- [ ] **Step 9: Save as the final asset**

Copy `<scratchpad>/hero-select-upscaled.mp4` to `public/images/mascot/hero-select.mp4`.

- [ ] **Step 10: Commit**

```bash
git add public/images/mascot/hero-select.mp4
git commit -m "assets: add hero mascot applying-to-selected motion video"
```

---

### Task 3: Swap the hero visual to MascotVideo and remove the orphaned Remotion pieces

**Files:**
- Modify: `src/components/sections/hero.tsx`
- Delete: `src/remotion/selection-field.tsx`
- Delete: `src/components/remotion/selection-field-player.tsx`

**Interfaces:**
- Consumes: `public/images/mascot/hero-select.webp` (Task 1), `public/images/mascot/hero-select.mp4` (Task 2), and the existing `MascotVideo` component's props — `{ videoSrc: string; posterSrc: string; alt: string; width: number; height: number; className?: string }` (`src/components/mascot/mascot-video.tsx`, unmodified).
- Produces: an updated `Hero` component with no Remotion dependency in its right column. No other file imports `selection-field.tsx` or `selection-field-player.tsx` (confirmed via search before this plan was written), so their deletion is self-contained.

- [ ] **Step 1: Update imports in `hero.tsx`**

In `src/components/sections/hero.tsx`, replace:

```tsx
import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/motion/counter";
import { TiltCard } from "@/components/motion/tilt-card";
import { heroStats, site } from "@/data/content";

const SelectionFieldPlayer = dynamic(
  () => import("@/components/remotion/selection-field-player").then((m) => m.SelectionFieldPlayer),
  {
    ssr: false,
    loading: () => (
      <div
        className="aspect-square w-full animate-pulse rounded-full border border-white/10 bg-ink-elevated/60"
        aria-hidden="true"
      />
    ),
  },
);
```

with:

```tsx
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/motion/counter";
import { MascotVideo } from "@/components/mascot/mascot-video";
import { heroStats, site } from "@/data/content";
import { assetBasePath } from "@/lib/base-path";
```

(`dynamic` and `TiltCard` are no longer used anywhere in this file; `useRef` is still needed for the scroll-linked blob below.)

- [ ] **Step 2: Replace the right-column visual**

Still in `src/components/sections/hero.tsx`, replace:

```tsx
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="relative"
        >
          <div className="absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-violet/20 via-transparent to-coral/20 blur-2xl" />
          <TiltCard intensity={10}>
            <SelectionFieldPlayer className="overflow-hidden rounded-full" />
          </TiltCard>
          <p className="mt-5 text-center text-xs uppercase tracking-[0.18em] text-muted-soft">
            1,000+ apply. 33 selected. 95% placed.
          </p>
        </motion.div>
```

with:

```tsx
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div
            className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-coral/25 via-transparent to-violet/20 blur-3xl"
            aria-hidden
          />
          <MascotVideo
            videoSrc={`${assetBasePath}/images/mascot/hero-select.mp4`}
            posterSrc={`${assetBasePath}/images/mascot/hero-select.webp`}
            alt="A St.School student celebrating after being selected into a cohort"
            width={928}
            height={1152}
            className="mx-auto h-auto w-full"
          />
          <p className="mt-5 text-center text-xs uppercase tracking-[0.18em] text-muted-soft">
            1,000+ apply. 33 selected. 95% placed.
          </p>
        </motion.div>
```

- [ ] **Step 3: Delete the orphaned Remotion files**

```bash
git rm src/remotion/selection-field.tsx src/components/remotion/selection-field-player.tsx
```

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: no errors (specifically: no unused-import warnings for `dynamic`, `TiltCard`, or the deleted modules).

- [ ] **Step 5: Run build**

Run: `npm run build`
Expected: succeeds — this also type-checks and statically renders every page, which confirms nothing else references the deleted Remotion files.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/hero.tsx
git commit -m "feat: replace hero data-viz animation with mascot video"
```

---

### Task 4: Final verification

**Files:** none (verification only)

**Interfaces:**
- Consumes: the fully assembled feature from Tasks 1-3.
- Produces: a verified, working homepage hero.

- [ ] **Step 1: Run the dev server**

Run: `npm run dev` and open the homepage in a browser.

- [ ] **Step 2: Desktop check**

Confirm: the hero's right column shows the mascot video (not the old dots/particle animation), it autoplays and loops, no layout shift versus the left column, the "1,000+ apply. 33 selected. 95% placed." caption still renders beneath it.

- [ ] **Step 3: Narrow-viewport check**

Resize the browser (or use DevTools device emulation) to a narrow width. Confirm the mascot video and caption still lay out correctly, no overflow/clipping.

- [ ] **Step 4: Reduced-motion check**

Emulate `prefers-reduced-motion: reduce` (Chrome DevTools → Rendering tab → Emulate CSS media feature). Confirm the video element shows the static `hero-select.webp` poster frame and never starts playing (per `MascotVideo`'s existing `useReducedMotion` behavior — no new code needed for this, just confirm it holds for the new asset).

- [ ] **Step 5: Confirm asset paths under the basePath**

In the browser's Network tab, confirm the video/poster requests resolve to `/st.school2/images/mascot/hero-select.mp4` and `/st.school2/images/mascot/hero-select.webp` (or whatever `GITHUB_PAGES_BASE_PATH` is set to) with a 200 status, not 404 — this is the same `assetBasePath` check called for in both prior mascot specs' testing sections. If running only `next dev` (no basePath applied in dev by default per this repo's `next.config.ts`), instead run `npm run build && npm run start` and check there, since basePath prefixing only applies to the production/static-export output.

- [ ] **Step 6: Final report**

Summarize pass/fail for each check above. If everything passes, the feature is complete — no further commit needed beyond what Tasks 1-3 already made (this task is verification-only, not a code change).
