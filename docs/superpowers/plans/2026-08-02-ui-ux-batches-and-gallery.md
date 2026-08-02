# UI/UX Batches + Classroom Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Online/Offline batch pricing to the UI/UX course page and embed 4 real classroom photos in a new gallery section.

**Architecture:** An optional `batches` array on the course schema (default `[]`, so every other course is untouched); `ApplyPanel` becomes a client component with local toggle state that swaps a shallow-merged view of the course into the existing `CountdownTimer`/`SeatsProgress`/`PricingGate` (none of which change). A new `ClassroomGallery` component renders 4 pre-compressed photos, wired into the course detail page for the `ui-ux` template only.

**Tech Stack:** Next.js 16 App Router (static export), TypeScript, Zod, Tailwind v4, Framer Motion, `next/image`, `sharp` (used once, ad hoc, not a project dependency).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-02-ui-ux-batches-and-gallery-design.md` — follow it exactly; these tasks implement it section by section.
- No test framework exists in this repo. "Verify" steps mean `npm run lint` / `npm run build` (which typechecks and statically renders every course page — a schema or prop-type mistake fails it loudly) plus a manual dev-server/browser check. Do not add a test framework as part of this work.
- `course.batches` must default to `[]` so `content/courses.json` entries without a `batches` key (Python, `test`) parse identically to today — never make it a breaking/required field.
- Do not modify `StickyCtaBar`, `ProgramsPreview`, `TrackMatcher`, `TrackFork`, `SeatsGauge`, or `CourseStatRow` — out of scope per spec.
- Do not add `sharp` to `package.json` — it's already present transitively at `node_modules/next/node_modules/sharp`; require it by that path in the one-off resize script only.
- Batch numbers (exact, from the user): Online — ₹50,000 (compare-at ₹79,999), 18 seats total / 12 claimed. Offline — ₹99,999 (compare-at ₹1,29,999), 15 seats total / 9 claimed. Both deadlines `2026-08-16T23:59:59+05:30`.
- The 4 source photos are already extracted at:
  `C:\Users\HP\AppData\Local\Temp\claude\c--Users-HP-Documents-GitHub-st-school2\2bca4074-22ae-4616-9986-febded92a3ec\scratchpad\class-photos\class-photo-{1..4}.jpeg`

---

### Task 1: Batch schema

**Files:**
- Modify: `src/lib/cms/schema.ts:118` (insert `BatchSchema` immediately before `CourseSchema`, add a `batches` field inside `CourseSchema`)

**Interfaces:**
- Produces: `BatchSchema` (Zod schema), `BatchContent` type, `CourseSchema` gains `batches: BatchContent[]` (always an array, never undefined, in the inferred `CourseContent` type).

- [ ] **Step 1: Add `BatchSchema` and the `batches` field**

Insert this immediately above `export const CourseSchema = z.object({` (currently line 118):

```ts
// One delivery-mode cohort of a course — e.g. an Online batch and an
// Offline batch of the same program can run with different prices,
// deadlines, and seat pools. Optional on Course (defaults to []) so a
// course with a single, undifferentiated cohort (the common case) needs
// no changes at all — see Course.batches below.
export const BatchSchema = z.object({
  mode: z.enum(["online", "offline"]),
  label: z.string().min(1),
  priceAmount: z.number().positive(),
  priceOriginalAmount: z.number().min(0).default(0),
  priceNote: z.string().default(""),
  applicationDeadline: z.string().min(1),
  seatsTotal: z.number().int().positive(),
  seatsClaimed: z.number().int().min(0),
});
export type BatchContent = z.infer<typeof BatchSchema>;

```

Then, inside `CourseSchema`'s object body, add this field right after `seatsClaimed: z.number().int().min(0),` (currently line 169, immediately before the closing `});`):

```ts
  // When a course runs as separate Online/Offline cohorts with their own
  // price/deadline/seats, list them here — the course page's ApplyPanel
  // shows a mode toggle and uses the selected batch's numbers instead of
  // the fields above. Empty (the default) means "one undifferentiated
  // cohort" and every field above continues to be used exactly as today.
  batches: z.array(BatchSchema).default([]),
```

- [ ] **Step 2: Verify the build still passes with no data changes yet**

Run: `npm run build`
Expected: Succeeds exactly as before (existing `content/courses.json` entries have no `batches` key, so Zod's `.default([])` fills it in — this is the regression guard that the field is truly optional).

- [ ] **Step 3: Commit**

```bash
git add src/lib/cms/schema.ts
git commit -m "schema: add optional per-course batches (online/offline pricing)"
```

---

### Task 2: `Batch` type export + UI/UX batch data

**Files:**
- Modify: `src/data/content.ts:10-28,74` (import and re-export the `Batch` type)
- Modify: `content/courses.json` (add `batches` to the `ui-ux-design` entry only)

**Interfaces:**
- Consumes: `BatchContent` from Task 1.
- Produces: `Batch` type (import from `@/data/content`), exactly `{ mode: "online"|"offline"; label: string; priceAmount: number; priceOriginalAmount: number; priceNote: string; applicationDeadline: string; seatsTotal: number; seatsClaimed: number }`.

- [ ] **Step 1: Export the `Batch` type alias**

In `src/data/content.ts`, add `type BatchContent` to the import block (line 27, next to `type CourseContent`):

```ts
  type CourseContent,
  type BatchContent,
```

Then add this line after `export type Course = CourseContent;` (line 74):

```ts
export type Batch = BatchContent;
```

- [ ] **Step 2: Add the `batches` array to the `ui-ux-design` course**

In `content/courses.json`, find the `ui-ux-design` entry (starts at line 100) and add a `batches` key right after `"priceNote": "One-time program fee · No-cost EMI available",` (line 114):

```json
    "batches": [
      {
        "mode": "online",
        "label": "Online cohort",
        "priceAmount": 50000,
        "priceOriginalAmount": 79999,
        "priceNote": "One-time program fee · No-cost EMI available",
        "applicationDeadline": "2026-08-16T23:59:59+05:30",
        "seatsTotal": 18,
        "seatsClaimed": 12
      },
      {
        "mode": "offline",
        "label": "Offline — Hyderabad campus",
        "priceAmount": 99999,
        "priceOriginalAmount": 129999,
        "priceNote": "One-time program fee · No-cost EMI available",
        "applicationDeadline": "2026-08-16T23:59:59+05:30",
        "seatsTotal": 15,
        "seatsClaimed": 9
      }
    ],
```

Leave the top-level `priceAmount`/`priceOriginalAmount`/`applicationDeadline`/`seatsTotal`/`seatsClaimed` fields on this course exactly as they are (₹64,999/₹99,999, 2026-08-16, 33/21) — they're still used by the homepage, listing quiz, and sticky bar.

Do **not** touch the `python-fullstack-ai` or `test` entries.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: Succeeds. If it fails with a Zod error mentioning `batches`, re-check the JSON against `BatchSchema` (common mistake: trailing comma, or `mode` not exactly `"online"`/`"offline"`).

- [ ] **Step 4: Commit**

```bash
git add src/data/content.ts content/courses.json
git commit -m "content: add Online/Offline batch pricing for UI/UX Design"
```

---

### Task 3: CMS editor support for batches

**Files:**
- Modify: `src/components/cms/editors/courses-editor.tsx`

**Interfaces:**
- Consumes: `Batch` type (Task 2), `ObjectListField`/`TextField`/`NumberField`/`SelectField` from `@/components/cms/fields` (already imported in this file).

- [ ] **Step 1: Import the `Batch` type and add a mode-options constant**

Change the import on line 3:

```ts
import type { Course, Batch } from "@/data/content";
```

Add this near `TEMPLATE_OPTIONS` (after line 15):

```ts
const BATCH_MODE_OPTIONS: { value: Batch["mode"]; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
];

function createBatch(): Batch {
  return {
    mode: "online",
    label: "",
    priceAmount: 0,
    priceOriginalAmount: 0,
    priceNote: "",
    applicationDeadline: "",
    seatsTotal: 33,
    seatsClaimed: 0,
  };
}
```

- [ ] **Step 2: Add `batches: []` to `createCourse()`**

In `createCourse()` (line 17-41), add this field right after `seatsClaimed: 0,` (line 39):

```ts
    batches: [],
```

- [ ] **Step 3: Add the batches `ObjectListField` to the editor form**

In the course `renderItem` render function, add this block right after the `Seats claimed` `NumberField` (after line 213, before the closing `</>` at line 215):

```tsx
          <div className="mt-1 border-t border-white/10 pt-4">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-soft">
              Online/Offline batches (optional)
            </span>
          </div>
          <p className="-mt-2 text-xs leading-relaxed text-muted-soft">
            Leave empty for a single undifferentiated cohort (the Price/Application
            deadline/Seats fields above are used as-is). Add two entries — one
            &quot;online&quot;, one &quot;offline&quot; — to show a mode toggle on the
            course page with separate price, deadline, and seats per batch.
          </p>
          <ObjectListField
            label="Batches"
            items={course.batches}
            onChange={(batches) => update({ ...course, batches })}
            createItem={createBatch}
            itemLabel={(batch) => batch.label || "New batch"}
            renderItem={(batch, updateBatch) => (
              <>
                <SelectField
                  label="Mode"
                  value={batch.mode}
                  onChange={(v) => updateBatch({ ...batch, mode: v })}
                  options={BATCH_MODE_OPTIONS}
                />
                <TextField
                  label="Label"
                  value={batch.label}
                  onChange={(v) => updateBatch({ ...batch, label: v })}
                  hint='e.g. "Online cohort" or "Offline — Hyderabad campus"'
                />
                <NumberField
                  label="Price"
                  value={batch.priceAmount}
                  onChange={(v) => updateBatch({ ...batch, priceAmount: v })}
                />
                <NumberField
                  label="Compare-at price (optional)"
                  value={batch.priceOriginalAmount}
                  onChange={(v) => updateBatch({ ...batch, priceOriginalAmount: v })}
                  hint="Set to 0 to hide the strikethrough price."
                />
                <TextField
                  label="Price note"
                  value={batch.priceNote}
                  onChange={(v) => updateBatch({ ...batch, priceNote: v })}
                />
                <TextField
                  label="Application deadline"
                  value={batch.applicationDeadline}
                  onChange={(v) => updateBatch({ ...batch, applicationDeadline: v })}
                  hint="ISO datetime with offset, e.g. 2026-08-16T23:59:59+05:30"
                />
                <NumberField
                  label="Seats total"
                  value={batch.seatsTotal}
                  onChange={(v) => updateBatch({ ...batch, seatsTotal: v })}
                />
                <NumberField
                  label="Seats claimed"
                  value={batch.seatsClaimed}
                  onChange={(v) => updateBatch({ ...batch, seatsClaimed: v })}
                />
              </>
            )}
          />
```

- [ ] **Step 4: Verify**

Run: `npm run lint && npm run build`
Expected: Both succeed with no type errors (this file is `"use client"` and typechecked as part of `next build`).

- [ ] **Step 5: Commit**

```bash
git add src/components/cms/editors/courses-editor.tsx
git commit -m "cms: add batches editor to the courses collection"
```

---

### Task 4: `BatchToggle` component

**Files:**
- Create: `src/components/courses/batch-toggle.tsx`

**Interfaces:**
- Consumes: `Batch` type, `COLOR_THEME` from `./color-theme`, `cn` from `@/lib/utils`.
- Produces: `BatchToggle({ batches, activeMode, onChange, color }: { batches: Batch[]; activeMode: Batch["mode"]; onChange: (mode: Batch["mode"]) => void; color: "violet" | "coral" }) => JSX.Element`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import type { Batch } from "@/data/content";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { cn } from "@/lib/utils";

// A small segmented control letting a visitor pick which cohort's
// price/deadline/seats ApplyPanel shows. Presentational only — the caller
// owns which mode is active and what happens when it changes.
export function BatchToggle({
  batches,
  activeMode,
  onChange,
  color,
}: {
  batches: Batch[];
  activeMode: Batch["mode"];
  onChange: (mode: Batch["mode"]) => void;
  color: "violet" | "coral";
}) {
  const theme = COLOR_THEME[color];

  return (
    <div
      role="tablist"
      aria-label="Batch mode"
      className="inline-flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1"
    >
      {batches.map((batch) => {
        const active = batch.mode === activeMode;
        return (
          <button
            key={batch.mode}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(batch.mode)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              active ? cn(theme.solidBg, "text-ink") : "text-paper/70 hover:text-paper",
            )}
          >
            {batch.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: No errors (this component isn't wired up anywhere yet, so `next build` won't exercise it until Task 5 — lint alone catches syntax/type issues since ESLint's TypeScript plugin type-checks).

- [ ] **Step 3: Commit**

```bash
git add src/components/courses/batch-toggle.tsx
git commit -m "feat: add BatchToggle segmented control component"
```

---

### Task 5: Wire batch toggle into `ApplyPanel`

**Files:**
- Modify: `src/components/courses/apply-panel.tsx`

**Interfaces:**
- Consumes: `BatchToggle` (Task 4), `Batch`/`Course` types.
- Produces: `ApplyPanel` behavior unchanged for any course with `batches.length === 0`; for `ui-ux-design`, renders the toggle and feeds the selected batch's numbers to `CountdownTimer`, `SeatsProgress`, and `PricingGate`.

- [ ] **Step 1: Rewrite the component**

Replace the full contents of `src/components/courses/apply-panel.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { Course } from "@/data/content";
import { site } from "@/data/content";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/courses/countdown-timer";
import { SeatsProgress } from "@/components/courses/seats-progress";
import { BrochureButton } from "@/components/courses/brochure-button";
import { PricingGate } from "@/components/courses/pricing-gate";
import { BatchToggle } from "@/components/courses/batch-toggle";
import { COLOR_THEME } from "@/components/courses/color-theme";
import { cn } from "@/lib/utils";

export function ApplyPanel({ course }: { course: Course }) {
  const theme = COLOR_THEME[course.color];
  const hasBatches = course.batches.length > 0;

  const [mode, setMode] = useState(course.batches[0]?.mode ?? "online");
  const activeBatch = hasBatches
    ? (course.batches.find((b) => b.mode === mode) ?? course.batches[0])
    : null;

  // ApplyPanel is the only place batch selection affects anything — every
  // other component here (CountdownTimer, SeatsProgress, PricingGate)
  // still just takes plain props/a Course, unaware that a toggle exists.
  // Shallow-merging the active batch's numbers over `course` lets them
  // stay that way.
  const displayCourse: Course = activeBatch
    ? {
        ...course,
        priceAmount: activeBatch.priceAmount,
        priceOriginalAmount: activeBatch.priceOriginalAmount,
        priceNote: activeBatch.priceNote,
        applicationDeadline: activeBatch.applicationDeadline,
        seatsTotal: activeBatch.seatsTotal,
        seatsClaimed: activeBatch.seatsClaimed,
      }
    : course;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-ink-elevated/60 p-6 backdrop-blur-sm sm:p-8",
        theme.border,
      )}
    >
      <div className={cn("pointer-events-none absolute -right-16 -top-16 size-56 rounded-full blur-[100px] opacity-40", theme.bgGlow)} />

      <div className="relative flex flex-col gap-7">
        {hasBatches && (
          <BatchToggle
            batches={course.batches}
            activeMode={mode}
            onChange={setMode}
            color={course.color}
          />
        )}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <CountdownTimer deadline={displayCourse.applicationDeadline} color={course.color} />
          <div className="w-full max-w-xs sm:w-64">
            <SeatsProgress claimed={displayCourse.seatsClaimed} total={displayCourse.seatsTotal} color={course.color} />
          </div>
        </div>

        <PricingGate course={displayCourse} />

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Button href="/contact" variant="primary" className="justify-center px-7 py-3.5 text-base">
            {site.ctaLabel}
          </Button>
          <BrochureButton course={course} className="justify-center" />
        </div>
      </div>
    </div>
  );
}
```

Note `BrochureButton` receives the original `course` (with `batches`), not `displayCourse` — the brochure lists both batches' fees regardless of the toggle (Task 6).

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Succeeds. Check the route summary output includes `/courses/python-fullstack-ai` and `/courses/ui-ux-design` under the static pages list, same as before — confirms neither course page throws at build/prerender time.

- [ ] **Step 3: Manual browser check**

Run: `npm run dev`, open `http://localhost:3000/st.school2/courses/ui-ux-design/`.
Expected: An "Online / Offline" pill toggle appears above the countdown. Clicking "Offline" updates the countdown deadline (same date, so only the label context changes — verify visually it re-renders), the seats bar (15 total / 9 claimed → "only 6 left"), and — after unlocking pricing — the price (₹99,999, was ₹1,29,999, "Save 23%"). Clicking back to "Online" shows 18/12 seats and ₹50,000 (was ₹79,999, "Save 37%").
Then open `http://localhost:3000/st.school2/courses/python-fullstack-ai/`.
Expected: No toggle appears; countdown/seats/price are exactly as before this change (33 seats, ₹79,999/₹1,29,999).

- [ ] **Step 4: Commit**

```bash
git add src/components/courses/apply-panel.tsx
git commit -m "feat: batch-aware ApplyPanel (Online/Offline toggle for UI/UX)"
```

---

### Task 6: Multi-batch fee section in the brochure PDF

**Files:**
- Modify: `src/lib/generate-brochure.ts:147-169`

**Interfaces:**
- Consumes: `course.batches` (Task 2).

- [ ] **Step 1: Replace the single-price fee block**

Replace lines 147-169 (from the `// Footer / CTA` comment through the end of the `priceNote` block, i.e. everything up to but not including the `doc.setFont("helvetica", "bold"); doc.setFontSize(13);` seats line) with:

```ts
  // Footer / CTA
  ensureSpace(90);
  y = Math.max(y + 20, PAGE_H - 120);
  doc.setDrawColor(220, 220, 222);
  doc.setLineWidth(1);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 24;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...CHARCOAL);

  if (course.batches.length > 0) {
    doc.text("Program fee", MARGIN, y);
    y += 20;
    for (const batch of course.batches) {
      ensureSpace(30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...CHARCOAL);
      const batchPriceText =
        batch.priceOriginalAmount > batch.priceAmount
          ? `${course.priceCurrency}${batch.priceAmount.toLocaleString("en-IN")}  (was ${course.priceCurrency}${batch.priceOriginalAmount.toLocaleString("en-IN")})`
          : `${course.priceCurrency}${batch.priceAmount.toLocaleString("en-IN")}`;
      doc.text(`${batch.label}: ${batchPriceText}`, MARGIN, y);
      y += 15;
      if (batch.priceNote) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...MUTED);
        doc.text(batch.priceNote, MARGIN, y);
        y += 15;
      }
    }
    y += 2;
  } else {
    const priceText =
      course.priceOriginalAmount > course.priceAmount
        ? `${course.priceCurrency}${course.priceAmount.toLocaleString("en-IN")}  (was ${course.priceCurrency}${course.priceOriginalAmount.toLocaleString("en-IN")})`
        : `${course.priceCurrency}${course.priceAmount.toLocaleString("en-IN")}`;
    doc.text(`Program fee: ${priceText}`, MARGIN, y);
    y += 16;
    if (course.priceNote) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...MUTED);
      doc.text(course.priceNote, MARGIN, y);
      y += 16;
    }
  }
```

The rest of the function (the seats line, `doc.text(\`Only ${course.seatsTotal}...\`` onward through `doc.save(...)`) is unchanged.

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Succeeds (this file has no JSX, but is still typechecked by `next build`; `batch.priceNote`/`batch.label` etc. must match the `Batch` type from Task 1 exactly or this fails).

- [ ] **Step 3: Manual browser check**

On `http://localhost:3000/st.school2/courses/ui-ux-design/`, unlock pricing and click "Download brochure" (or use the sticky bar's brochure button). Open the downloaded PDF.
Expected: The fee section lists "Online cohort: ₹50,000 (was ₹79,999)" and "Offline — Hyderabad campus: ₹99,999 (was ₹1,29,999)" as two lines, each with the price note beneath it, instead of one price line.
Then download the Python course's brochure.
Expected: Unchanged — single "Program fee: ₹79,999 (was ₹1,29,999)" line.

- [ ] **Step 4: Commit**

```bash
git add src/lib/generate-brochure.ts
git commit -m "feat: list per-batch fees in the brochure PDF when a course has batches"
```

---

### Task 7: Prepare classroom photo assets

**Files:**
- Create: `public/images/classroom/session-1.jpg`
- Create: `public/images/classroom/session-2.jpg`
- Create: `public/images/classroom/session-3.jpg`
- Create: `public/images/classroom/session-4.jpg`
- Create (temporary, not committed): a one-off resize script

**Interfaces:**
- Produces: 4 JPEGs at `public/images/classroom/session-{1..4}.jpg`, each ≤1600px on the long edge, quality 78, that later tasks reference by exact filename and (once resized) exact pixel dimensions.

- [ ] **Step 1: Write the one-off resize script**

Create `scripts/resize-classroom-photos.cjs` (temporary — deleted in Step 4, not part of the shipped codebase). Use `.cjs` + `require`, not `.mjs` + `import` — an ESM `import` of an absolute Windows path (`C:/...`) fails with `ERR_UNSUPPORTED_ESM_URL_SCHEME`; `require()` with the same path works fine and has already been verified against these exact files:

```js
const sharp = require("C:/Users/HP/Documents/GitHub/st.school2/node_modules/next/node_modules/sharp");
const { mkdirSync } = require("node:fs");

const SRC_DIR =
  "C:/Users/HP/AppData/Local/Temp/claude/c--Users-HP-Documents-GitHub-st-school2/2bca4074-22ae-4616-9986-febded92a3ec/scratchpad/class-photos";
const OUT_DIR = "C:/Users/HP/Documents/GitHub/st.school2/public/images/classroom";

(async () => {
  mkdirSync(OUT_DIR, { recursive: true });

  for (const n of [1, 2, 3, 4]) {
    const src = `${SRC_DIR}/class-photo-${n}.jpeg`;
    const out = `${OUT_DIR}/session-${n}.jpg`;
    const image = sharp(src).rotate(); // .rotate() with no args auto-applies EXIF orientation
    const meta = await image.metadata();
    await image
      .resize({ width: Math.min(1600, meta.width ?? 1600), withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(out);
    const outMeta = await sharp(out).metadata();
    console.log(out, `${outMeta.width}x${outMeta.height}`);
  }
})();
```

- [ ] **Step 2: Run it**

Run: `node scripts/resize-classroom-photos.cjs`
Expected: Prints 4 lines like `.../session-1.jpg 1600x1205`, one per file, with no errors (this exact script logic was already dry-run against `class-photo-1.jpeg` during planning: output was `1600x1205`, 184,840 bytes, correct orientation — the other 3 files haven't been run yet but use identical logic).

- [ ] **Step 3: Verify file sizes are web-reasonable**

Run: `ls -la public/images/classroom/`
Expected: Each file is roughly 100–250KB (down from ~500KB originals at 3-4x the pixel dimensions) — if any file is still >400KB, lower the JPEG quality to 72 in the script and re-run Step 2.

- [ ] **Step 4: Delete the one-off script and record dimensions**

```bash
rm scripts/resize-classroom-photos.cjs
rmdir scripts 2>/dev/null || true
```

Note the exact `width x height` printed in Step 2 for each `session-N.jpg` — Task 8 needs these for `next/image`'s required `width`/`height` props.

- [ ] **Step 5: Commit**

```bash
git add public/images/classroom/
git commit -m "assets: add compressed real classroom photos"
```

---

### Task 8: `ClassroomGallery` component

**Files:**
- Create: `src/components/courses/classroom-gallery.tsx`

**Interfaces:**
- Consumes: the 4 files from Task 7 and their exact dimensions; `Reveal` from `@/components/motion/reveal`.
- Produces: `ClassroomGallery() => JSX.Element` — no props, since it's only ever used on the one page for now (self-contained, not data-driven from CMS per spec's "no fabricated per-photo captions" decision).

- [ ] **Step 1: Create the component**

Use the actual `width`/`height` values printed in Task 7 Step 2 in place of `WIDTH_N`/`HEIGHT_N` below.

```tsx
"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

const PHOTOS = [
  { src: "/images/classroom/session-1.jpg", width: WIDTH_1, height: HEIGHT_1, alt: "A full room at a live St.School session, mentor presenting at the front" },
  { src: "/images/classroom/session-2.jpg", width: WIDTH_2, height: HEIGHT_2, alt: "Students seated in rows during a live St.School session" },
  { src: "/images/classroom/session-3.jpg", width: WIDTH_3, height: HEIGHT_3, alt: "A mentor talking with students seated around a conference table" },
  { src: "/images/classroom/session-4.jpg", width: WIDTH_4, height: HEIGHT_4, alt: "Students in a St.School classroom listening to a session" },
] as const;

export function ClassroomGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {PHOTOS.map((photo, i) => (
        <Reveal key={photo.src} delay={i * 0.06} className="overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </Reveal>
      ))}
    </div>
  );
}
```

`next.config.ts` sets `images.unoptimized: true`, and `next/image` automatically prefixes local `src` values with the configured `basePath` — no manual `assetBasePath` prefixing needed here (unlike the hand-built metadata URLs in `layout.tsx`, which bypass the `Image` component entirely).

- [ ] **Step 2: Verify**

Run: `npm run lint`
Expected: No errors. (Not wired into a page yet, so `next build` won't exercise it until Task 9.)

- [ ] **Step 3: Commit**

```bash
git add src/components/courses/classroom-gallery.tsx
git commit -m "feat: add ClassroomGallery component"
```

---

### Task 9: Wire the gallery into the UI/UX course page

**Files:**
- Modify: `src/app/courses/[slug]/page.tsx`

**Interfaces:**
- Consumes: `ClassroomGallery` (Task 8), `SectionHeading`, `Container`, `Reveal` (already imported in this file).

- [ ] **Step 1: Import the component**

Add near the other course component imports (after the `HighlightGrid` import, currently line 14):

```ts
import { ClassroomGallery } from "@/components/courses/classroom-gallery";
```

- [ ] **Step 2: Add the section**

Insert this new section between the `{/* d. Highlights */}` section (ends at line 261) and the `{/* d.5 The actual build... */}` section (starts at line 263) — i.e. right after line 261's closing `</section>`, before line 263:

```tsx
      {/* d.7 Real classroom photos — UI/UX only for now; a trust-building
          beat right before the closing CTA, not stock photography. */}
      {template === "ui-ux" && (
        <section className="relative py-20 sm:py-28">
          <Container className="flex flex-col gap-12">
            <SectionHeading
              eyebrow="Inside the room"
              title="Real cohorts, real sessions"
              description="Inside a real St.School session — full room, real mentors, no stock photos."
            />
            <ClassroomGallery />
          </Container>
        </section>
      )}

```

This mirrors the existing `{template === "ui-ux" && (...)}` guard already used for the "transformation" stepper section right below it, so it only ever renders on the UI/UX course page.

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: Succeeds; static page list still includes both `/courses/python-fullstack-ai` and `/courses/ui-ux-design`.

- [ ] **Step 4: Manual browser check**

On `http://localhost:3000/st.school2/courses/ui-ux-design/`, scroll past "Why this program".
Expected: A "Real cohorts, real sessions" section with a 4-photo grid (2 columns on a narrow window, 4 on a wide one) appears before "Same card. Four weeks apart.", each photo loading (check Network tab: URLs are `/st.school2/images/classroom/session-N.jpg`, not 404).
On `http://localhost:3000/st.school2/courses/python-fullstack-ai/`.
Expected: No gallery section appears anywhere on the page.

- [ ] **Step 5: Commit**

```bash
git add src/app/courses/[slug]/page.tsx
git commit -m "feat: add classroom photo gallery to the UI/UX course page"
```

---

### Task 10: Full verification and push

**Files:** None (verification only).

- [ ] **Step 1: Full lint + build**

Run: `npm run lint && npm run build`
Expected: Both exit 0. Confirm the build output's route list still shows exactly `/`, `/about`, `/admin`, `/contact`, `/courses`, `/courses/[slug]` with 3 pages (`python-fullstack-ai`, `ui-ux-design`, `test`), plus the metadata routes — no new routes, no missing ones.

- [ ] **Step 2: Regression check on the Python course page**

With `npm run dev` running, open `http://localhost:3000/st.school2/courses/python-fullstack-ai/` and compare against the current live site (`https://vijayabhaskar00.github.io/st.school2/courses/python-fullstack-ai/`) side by side.
Expected: Pixel-identical — no toggle, no gallery, same price/seats/countdown numbers.

- [ ] **Step 3: Full UI/UX course page walkthrough**

On `http://localhost:3000/st.school2/courses/ui-ux-design/`:
1. Confirm the Online/Offline toggle defaults to "Online" with ₹50,000 shown once unlocked, 18/12 seats.
2. Toggle to "Offline", confirm ₹99,999, 15/9 seats.
3. Scroll to the classroom gallery, confirm all 4 photos load with no layout shift (they have explicit width/height).
4. Download the brochure in both toggle states, confirm the PDF always lists both batches regardless of which was selected on-screen.

- [ ] **Step 4: Stop the dev server**

```bash
powershell -NoProfile -Command "Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force"
```

- [ ] **Step 5: Push**

```bash
git push origin claude/stschool-website-redesign-aio5tq
```

Expected: Push succeeds; this triggers `.github/workflows/deploy-pages.yml`, redeploying the live site with all changes from Tasks 1-9.
