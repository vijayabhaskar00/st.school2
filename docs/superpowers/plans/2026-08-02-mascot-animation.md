# Mascot Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animate the existing 4 static mascot placements (homepage banner, About brand-story, and both course-page closing CTAs) with a distinct short idle-loop video per placement, generated via Higgsfield image-to-video from the already-approved static stills.

**Architecture:** Each static `.webp` mascot is uploaded to Higgsfield and used as the start frame for a `kling3_0_turbo` image-to-video generation with a placement-specific gesture prompt. Results are downloaded as `.mp4`, committed alongside the existing `.webp` (which becomes the `poster`/reduced-motion fallback), and rendered through a new shared `MascotVideo` component that all 4 callers use in place of their current bare `<Image>`.

**Tech Stack:** Higgsfield MCP (`models_explore`, `media_upload`, `media_confirm`, `generate_video`, `job_status`), Playwright MCP (for local `.mp4` sanity checks — no ffmpeg available in this environment), Next.js `next/image`/`<video>`, framer-motion (`useReducedMotion`, `useInView` — both already used elsewhere in this codebase).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-02-mascot-animation-design.md` — follow it exactly.
- No test framework exists. "Verify" means `npm run lint` / `npm run build` plus manual dev-server/browser checks, same as every prior feature in this repo.
- Model is `kling3_0_turbo`. Its exact `medias[].role` name, supported `duration`, and supported `aspect_ratio`/dimensions are NOT statically documented — Task 1 Step 1 discovers them via `models_explore` and every subsequent `generate_video` call in this plan uses whatever was discovered there.
- Output is `.mp4` only (no `.webm`) — see spec's rationale. Saved at `public/images/mascot/{name}.mp4`, same basename as the existing `{name}.webp`.
- The existing `.webp` files are NOT deleted or regenerated — they become the `poster` attribute and the `prefers-reduced-motion` fallback.
- `next/image`/`<video>` `src` values for these assets must be prefixed with `assetBasePath` from `@/lib/base-path` — required (not automatic) under this project's `images.unoptimized: true` config, per the pattern established in the classroom-gallery and Pixar-visuals features.
- Validate the first generated clip (Task 1) before generating the remaining 3 (Task 2) — do not mass-generate before confirming the pipeline/prompt style actually produces an acceptable result.
- No new npm dependency. No ffmpeg — if a downloaded video needs re-encoding to play correctly in `<video>`, stop and flag it rather than working around it silently.
- Icon set (`why-us`/`stat-row` icons), the 3 existing Remotion hero pieces, and audio/sound are explicitly OUT OF SCOPE.

---

### Task 1: Discover model params, generate + validate the homepage clip

**Files:**
- Create: `public/images/mascot/homepage.mp4`

**Interfaces:**
- Produces: confirmed `kling3_0_turbo` parameter names (media role, duration, aspect ratio) — every later generation in Task 2 reuses these exact values instead of re-discovering them.
- Produces: `public/images/mascot/homepage.mp4`, for Task 4 to reference.

- [ ] **Step 1: Discover `kling3_0_turbo` parameters**

Call `models_explore` with `action: "get"`, `model_id: "kling3_0_turbo"`. Record:
- The `medias[].role` value used for a single start-frame image input (likely `"start_image"` or `"image"` — use whatever the response actually says).
- Supported `duration` values (pick the shortest available, since this is a short idle loop, not a scene).
- Supported `aspect_ratio` values or whether explicit `width`/`height` is accepted — the source stills are 928×1152 (portrait ~4:5); pick the closest supported option. If nothing reasonably close exists (e.g., only 16:9/1:1 offered), stop and report this back before generating anything — a badly-cropped mascot isn't an acceptable trade to push through silently.

- [ ] **Step 2: Upload the homepage source image**

```
media_upload({ filename: "homepage.webp", content_type: "image/webp" })
```

This returns a presigned `upload_url` and a `media_id`. PUT the file bytes:

```bash
curl -X PUT -H "Content-Type: image/webp" --data-binary @"C:/Users/HP/Documents/GitHub/st.school2/public/images/mascot/homepage.webp" "<upload_url>"
```

Expected: HTTP 200. Then confirm:

```
media_confirm({ media_id: "<media_id from above>", type: "image" })
```

- [ ] **Step 3: Preflight cost**

```
generate_video({
  params: {
    model: "kling3_0_turbo",
    medias: [{ role: "<role from Step 1>", value: "<media_id from Step 2>" }],
    prompt: "<prompt from Step 4 below>",
    duration: <duration from Step 1>,
    get_cost: true
  }
})
```

Note the returned cost. This call submits no job — it's a preflight only.

- [ ] **Step 4: Generate the homepage clip**

Call `generate_video` again, identical params but with `get_cost` omitted (so the job actually submits). Prompt:

```
A confident idle stance: the character shifts weight gently from one foot to the other, chin raised slightly, one small confident nod partway through the clip, then settles back into the exact standing pose from the start frame by the final frame. Subtle, natural, continuous motion — no camera movement, no background change, no new props. Loops cleanly.
```

Pass whatever `aspect_ratio`/`width`+`height` was decided in Step 1.

- [ ] **Step 5: Poll until complete**

```
job_status({ jobId: "<id from Step 4>", sync: true })
```

Repeat if not terminal (respecting `poll_after_seconds`) until `status: "completed"`. Note `results.rawUrl` (or equivalent video URL field).

- [ ] **Step 6: Download the result**

```bash
curl -sL "<rawUrl>" -o "C:/Users/HP/Documents/GitHub/st.school2/.tmp-mascot-homepage.mp4"
```

- [ ] **Step 7: Sanity-check via Playwright**

```
mcp__plugin_playwright_playwright__browser_navigate({ url: "file:///C:/Users/HP/Documents/GitHub/st.school2/.tmp-mascot-homepage.mp4" })
mcp__plugin_playwright_playwright__browser_evaluate({
  function: "() => { const v = document.querySelector('video'); return { duration: v.duration, width: v.videoWidth, height: v.videoHeight }; }"
})
mcp__plugin_playwright_playwright__browser_take_screenshot({ filename: "mascot-homepage-frame0.png" })
mcp__plugin_playwright_playwright__browser_evaluate({
  function: "() => { const v = document.querySelector('video'); v.pause(); v.currentTime = Math.max(0, v.duration - 0.15); }"
})
mcp__plugin_playwright_playwright__browser_take_screenshot({ filename: "mascot-homepage-lastframe.png" })
```

Compare the two screenshots against `public/images/mascot/homepage.webp`:
- Background: does the rendered backdrop read as close enough to near-black/dark that it'll blend under the page's existing blur-glow treatment? (It does not need to be pixel-identical — just not a jarring, clearly different color/pattern.)
- Loop seam: are the first and last frames close enough in pose that a loop won't look like a hard jump-cut?
- Identity: same character, same outfit, no obvious distortion.

If any of these fail badly, adjust the prompt (background/pose wording) and retry from Step 4, up to 2 more times. If still unacceptable after 3 total attempts, stop and report the issue rather than shipping a bad asset or silently accepting one that doesn't meet the bar the spec set.

- [ ] **Step 8: Place the final asset and clean up**

```bash
mv "C:/Users/HP/Documents/GitHub/st.school2/.tmp-mascot-homepage.mp4" "C:/Users/HP/Documents/GitHub/st.school2/public/images/mascot/homepage.mp4"
ls -la "C:/Users/HP/Documents/GitHub/st.school2/public/images/mascot/"
```

Expected: `homepage.mp4` now sits next to `homepage.webp`, no `.tmp-mascot-*` files left behind.

- [ ] **Step 9: Commit**

```bash
git add public/images/mascot/homepage.mp4
git commit -m "assets: add homepage mascot idle animation"
```

---

### Task 2: Generate the remaining 3 clips

**Files:**
- Create: `public/images/mascot/about-story.mp4`
- Create: `public/images/mascot/course-python.mp4`
- Create: `public/images/mascot/course-uiux.mp4`

**Interfaces:**
- Consumes: the confirmed `role`/`duration`/`aspect_ratio` params from Task 1 Step 1.
- Produces: 3 more `.mp4` files, for Tasks 5-6 to reference.

- [ ] **Step 1: Generate the About page (wave) clip**

Upload + confirm `about-story.webp` (same `media_upload` → curl PUT → `media_confirm` pattern as Task 1 Step 2, just swap the filename). Then `generate_video` with the same `model`/`role`/`duration`/`aspect_ratio` as Task 1, and prompt:

```
A friendly wave: the character raises one hand and waves once, warm genuine expression, then lowers the hand and settles back into the exact starting pose from the start frame by the final frame. Subtle, natural, continuous motion — no camera movement, no background change, no new props. Loops cleanly.
```

Poll with `job_status` (`sync: true`) until completed, note the result URL.

- [ ] **Step 2: Generate the Python course (build energy) clip**

Upload + confirm `course-python.webp`. `generate_video` with the same params, prompt:

```
Confident "let's build" energy: the character does a quick, natural typing motion on an invisible surface in front of them (or a small confident fist-pump if that reads more naturally from the start pose), excited focused expression, then settles back into the exact starting pose from the start frame by the final frame. Subtle, natural, continuous motion — no camera movement, no background change, no new props. Loops cleanly.
```

Poll until completed, note the result URL.

- [ ] **Step 3: Generate the UI/UX course (creative flourish) clip**

Upload + confirm `course-uiux.webp`. `generate_video` with the same params, prompt:

```
A creative "presenting my work" flourish: the character makes a small sketching motion or an open hand-sweep gesture as if unveiling a design, focused happy expression, then settles back into the exact starting pose from the start frame by the final frame. Subtle, natural, continuous motion — no camera movement, no background change, no new props. Loops cleanly.
```

Poll until completed, note the result URL.

- [ ] **Step 4: Download all 3**

```bash
curl -sL "<about-story rawUrl>" -o "C:/Users/HP/Documents/GitHub/st.school2/.tmp-mascot-about-story.mp4"
curl -sL "<course-python rawUrl>" -o "C:/Users/HP/Documents/GitHub/st.school2/.tmp-mascot-course-python.mp4"
curl -sL "<course-uiux rawUrl>" -o "C:/Users/HP/Documents/GitHub/st.school2/.tmp-mascot-course-uiux.mp4"
```

- [ ] **Step 5: Quick sanity check on each**

For each of the 3 files, repeat the lighter version of Task 1 Step 7 (navigate to the `file://` path, one screenshot at frame 0). Task 1 already validated the pipeline and prompt style produce acceptable results — this pass is a quick gut-check for an obviously broken generation (wrong character, garbled frame, solid-color glitch), not a full re-litigation. If one looks clearly broken, regenerate just that one (same prompt, one retry) before proceeding.

- [ ] **Step 6: Place final assets and clean up**

```bash
cd "c:\Users\HP\Documents\GitHub\st.school2"
mv .tmp-mascot-about-story.mp4 public/images/mascot/about-story.mp4
mv .tmp-mascot-course-python.mp4 public/images/mascot/course-python.mp4
mv .tmp-mascot-course-uiux.mp4 public/images/mascot/course-uiux.mp4
ls -la public/images/mascot/
```

Expected: 4 `.mp4` files total (including Task 1's), each paired with its `.webp`, no `.tmp-mascot-*` files left.

- [ ] **Step 7: Commit**

```bash
git add public/images/mascot/about-story.mp4 public/images/mascot/course-python.mp4 public/images/mascot/course-uiux.mp4
git commit -m "assets: add remaining mascot idle animations (about, course CTAs)"
```

---

### Task 3: `MascotVideo` component

**Files:**
- Create: `src/components/mascot/mascot-video.tsx`

**Interfaces:**
- Produces: `MascotVideo({ videoSrc, posterSrc, alt, width, height, className }) => JSX.Element`, a client component. `videoSrc`/`posterSrc` are full, already-`assetBasePath`-prefixed strings (the component does not prefix them itself — callers do, matching how every other image usage in this codebase already builds its own `src`).

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";

// Video output from image-to-video generation has no alpha channel, unlike
// the source WebP stills — this mask fades the video's rectangular edges
// into whatever sits behind it instead of showing a hard box edge.
const EDGE_MASK = "radial-gradient(closest-side, black 78%, transparent 100%)";

export function MascotVideo({
  videoSrc,
  posterSrc,
  alt,
  width,
  height,
  className,
}: {
  videoSrc: string;
  posterSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { margin: "-10% 0px" });

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (isInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView]);

  if (reduceMotion) {
    return <Image src={posterSrc} alt={alt} width={width} height={height} className={className} />;
  }

  return (
    <>
      <video
        ref={ref}
        src={videoSrc}
        poster={posterSrc}
        width={width}
        height={height}
        className={className}
        style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <span className="sr-only">{alt}</span>
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Succeeds (component isn't wired into any page yet, so this just confirms it typechecks in isolation).

- [ ] **Step 3: Commit**

```bash
git add src/components/mascot/mascot-video.tsx
git commit -m "feat: add MascotVideo component with reduced-motion fallback"
```

---

### Task 4: Wire `MascotVideo` into the homepage banner

**Files:**
- Modify: `src/components/sections/mascot-banner.tsx`

**Interfaces:**
- Consumes: `MascotVideo` (Task 3), `public/images/mascot/homepage.{webp,mp4}` (Task 1).

- [ ] **Step 1: Replace the `Image` usage**

In `src/components/sections/mascot-banner.tsx`, replace:

```tsx
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { assetBasePath } from "@/lib/base-path";
```

with:

```tsx
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { MascotVideo } from "@/components/mascot/mascot-video";
import { assetBasePath } from "@/lib/base-path";
```

Replace:

```tsx
          <Image
            src={`${assetBasePath}/images/mascot/homepage.webp`}
            alt="A St.School student, confident and ready to build"
            width={928}
            height={1152}
            className="mx-auto h-auto w-full max-w-[22rem]"
            priority={false}
          />
```

with:

```tsx
          <MascotVideo
            videoSrc={`${assetBasePath}/images/mascot/homepage.mp4`}
            posterSrc={`${assetBasePath}/images/mascot/homepage.webp`}
            alt="A St.School student, confident and ready to build"
            width={928}
            height={1152}
            className="mx-auto h-auto w-full max-w-[22rem]"
          />
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Succeeds.

- [ ] **Step 3: Manual browser check**

`npm run dev`, open `http://localhost:3000/st.school2/`, scroll to the mascot banner (between Why Us and Programs).
Expected: video plays automatically, loops, no layout shift versus the previous static image. Scroll it out of view and back — confirm via DevTools (`document.querySelector('video').paused`) that it pauses off-screen and resumes on return.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/mascot-banner.tsx
git commit -m "feat: animate homepage mascot banner"
```

---

### Task 5: Wire `MascotVideo` into the About page brand story

**Files:**
- Modify: `src/app/about/page.tsx`

**Interfaces:**
- Consumes: `MascotVideo` (Task 3), `public/images/mascot/about-story.{webp,mp4}` (Task 2).

- [ ] **Step 1: Replace the `Image` usage**

In `src/app/about/page.tsx`, replace the `Image` import with `MascotVideo`:

```tsx
import { MascotVideo } from "@/components/mascot/mascot-video";
```

(remove the now-unused `import Image from "next/image";` if nothing else in this file uses `Image` — check before removing).

Replace:

```tsx
            <Image
              src={`${assetBasePath}/images/mascot/about-story.webp`}
              alt="A St.School student waving"
              width={928}
              height={1152}
              className="mx-auto h-auto w-full max-w-[18rem]"
            />
```

with:

```tsx
            <MascotVideo
              videoSrc={`${assetBasePath}/images/mascot/about-story.mp4`}
              posterSrc={`${assetBasePath}/images/mascot/about-story.webp`}
              alt="A St.School student waving"
              width={928}
              height={1152}
              className="mx-auto h-auto w-full max-w-[18rem]"
            />
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Succeeds. If `Image` was removed and was genuinely unused elsewhere in the file, `npm run lint` should also show no unused-import warning — run `npm run lint` too and confirm clean.

- [ ] **Step 3: Manual browser check**

`npm run dev`, open `http://localhost:3000/st.school2/about/`, scroll to "Brand story".
Expected: mascot waves in a loop, no layout shift, pauses off-screen same as Task 4.

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: animate About page brand story mascot"
```

---

### Task 6: Wire `MascotVideo` into course page closing CTAs

**Files:**
- Modify: `src/app/courses/[slug]/page.tsx`

**Interfaces:**
- Consumes: `MascotVideo` (Task 3), `public/images/mascot/course-python.{webp,mp4}` and `course-uiux.{webp,mp4}` (Task 2).

- [ ] **Step 1: Replace the `Image` import and the `mascotSrc` computation**

Replace:

```tsx
import Image from "next/image";
import { assetBasePath } from "@/lib/base-path";
```

with:

```tsx
import { MascotVideo } from "@/components/mascot/mascot-video";
import { assetBasePath } from "@/lib/base-path";
```

(remove `Image` only if nothing else in the file still uses it — check first).

Replace the existing `mascotSrc` computation:

```tsx
  const mascotSrc =
    template === "python-ai"
      ? `${assetBasePath}/images/mascot/course-python.webp`
      : template === "ui-ux"
        ? `${assetBasePath}/images/mascot/course-uiux.webp`
        : null;
```

with:

```tsx
  // Only the two bespoke templates have a matching mascot scene — "generic"
  // has no asset to show and keeps today's centered closing CTA layout.
  const mascotName =
    template === "python-ai" ? "course-python" : template === "ui-ux" ? "course-uiux" : null;
  const mascotVideoSrc = mascotName ? `${assetBasePath}/images/mascot/${mascotName}.mp4` : null;
  const mascotPosterSrc = mascotName ? `${assetBasePath}/images/mascot/${mascotName}.webp` : null;
```

- [ ] **Step 2: Update the conditional in the closing CTA section**

Replace `{mascotSrc ? (` with `{mascotName ? (` (the branch condition), and inside that branch replace:

```tsx
                <Image
                  src={mascotSrc}
                  alt=""
                  width={928}
                  height={1152}
                  className="mx-auto h-auto w-full max-w-[18rem]"
                />
```

with:

```tsx
                <MascotVideo
                  videoSrc={mascotVideoSrc!}
                  posterSrc={mascotPosterSrc!}
                  alt=""
                  width={928}
                  height={1152}
                  className="mx-auto h-auto w-full max-w-[18rem]"
                />
```

(the `!` non-null assertions are safe here — both are only read inside the `mascotName ?` truthy branch, where they're guaranteed non-null by construction).

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: Succeeds; static page list still includes all 3 course pages.

- [ ] **Step 4: Manual browser check**

`npm run dev`. On `http://localhost:3000/st.school2/courses/python-fullstack-ai/` and `.../ui-ux-design/`, scroll to the closing CTA.
Expected: mascot animates (typing/fist-pump on Python, sketch flourish on UI/UX), no layout shift versus the static version. On `http://localhost:3000/st.school2/courses/test/` (template `"generic"`), confirm the closing CTA is unchanged — still centered, no mascot.

- [ ] **Step 5: Commit**

```bash
git add "src/app/courses/[slug]/page.tsx"
git commit -m "feat: animate course page closing CTA mascots"
```

---

### Task 7: Full verification and push

**Files:** None (verification only).

- [ ] **Step 1: Full lint + build**

Run: `npm run lint && npm run build`
Expected: Both exit 0. Route list unchanged from before this feature.

- [ ] **Step 2: Reduced-motion check**

With `npm run dev` running, open DevTools → Rendering tab → emulate `prefers-reduced-motion: reduce`, then visit all 4 mascot placements (homepage, About, both course closing CTAs).
Expected: each shows the static poster image, no `<video>` element mounted (confirm via DevTools Elements panel — no `<video>` tag present when reduced motion is emulated).

- [ ] **Step 3: Full visual walkthrough (normal motion)**

Turn off the reduced-motion emulation. With `npm run dev` running:
1. Homepage — mascot banner video loops (confident idle).
2. About page — brand-story mascot video loops (wave).
3. Python course page — closing CTA mascot video loops (build energy).
4. UI/UX course page — closing CTA mascot video loops (creative flourish); classroom gallery from the earlier feature still intact.
5. `test` course page — closing CTA unchanged (no mascot, centered layout).
6. Check the browser Network tab on at least 2 of the above pages: zero 404s for anything under `/st.school2/images/mascot/`.
7. Scroll each mascot in and out of view; confirm playback pauses/resumes (DevTools: `document.querySelector('video').paused`).

- [ ] **Step 4: Stop the dev server**

```bash
powershell -NoProfile -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
```

- [ ] **Step 5: Push**

```bash
git push origin claude/stschool-website-redesign-aio5tq
```

Expected: Push succeeds; triggers `.github/workflows/deploy-pages.yml`, redeploying the live site with every commit from Tasks 1-6.
