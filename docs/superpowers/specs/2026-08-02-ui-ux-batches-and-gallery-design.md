# UI/UX course page: Online/Offline batches + real classroom photos

Date: 2026-08-02
Status: Approved

## Problem

Two gaps on `/courses/ui-ux-design`:

1. The course page has one price/deadline/seat-count, but the program actually
   runs as two separate cohorts — Online and Offline — with different fees,
   seat pools, and (potentially, in future) different deadlines. Nothing on
   the page lets a visitor see the right numbers for the batch they want.
2. The page has no real photos. All hero art on the site is code-generated
   (Remotion); this is the first real content photography, and there's no
   asset pipeline or component for it yet.

## Data: batch pricing

### Schema (`src/lib/cms/schema.ts`)

```ts
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

Added to `CourseSchema` as `batches: z.array(BatchSchema).default([])` —
absent in JSON simply parses to `[]`, so every existing course (Python,
`test`) needs zero changes and every consumer can treat `course.batches` as
always-an-array, never `undefined`.

The existing top-level `priceAmount` / `priceOriginalAmount` / `priceNote` /
`applicationDeadline` / `seatsTotal` / `seatsClaimed` fields are **unchanged**
and stay required. They remain the aggregate/default figures used by
everything that isn't the batch-aware apply widget: `ProgramsPreview`
(homepage cards), `TrackMatcher` and `TrackFork` (courses-listing quiz),
`SeatsGauge` (contact page), and `StickyCtaBar` (course page's persistent
bottom bar). None of those become batch-aware — they keep reading the
top-level fields exactly as today.

### Content (`content/courses.json`, `ui-ux-design` only)

Top-level fields stay as they are today (₹64,999/₹99,999, 33 total/21
claimed, deadline 2026-08-16) — they're never shown standalone elsewhere on
this course's own page once `batches` is populated (`ApplyPanel` always
prefers the batch data when `batches.length > 0`), only by the pages listed
above.

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
]
```

(18+15 = 33, 12+9 = 21 — matches the existing aggregate exactly, so nothing
sitewide needs to change to stay consistent.)

## UI: `ApplyPanel` batch toggle

`ApplyPanel` (`src/components/courses/apply-panel.tsx`) becomes a client
component holding local `mode` state (`useState<"online"|"offline">`,
defaulting to the first batch's mode). When `course.batches.length > 0`, it
renders a small segmented control (Online / Offline pill buttons, themed via
`COLOR_THEME`) above the countdown/seats row.

It resolves the active batch and builds a shallow-merged view of `course`
with that batch's price/deadline/seat fields substituted in, then passes that
merged object to `CountdownTimer` (via `deadline`), `SeatsProgress` (via
`claimed`/`total`), and `PricingGate` (via `course`) exactly as it does
today — **none of those three components change**. `BrochureButton` keeps
receiving the real, unmodified `course` (see below).

When `course.batches` is empty (every other course today), `ApplyPanel`
renders identically to now — no toggle, top-level fields used directly.

`StickyCtaBar` is **not** touched — it keeps showing the course's top-level
aggregate price/seats, since it's a persistent quick-action bar, not the
place a visitor compares batches.

## Brochure PDF

`generate-brochure.ts`'s fee section: if `course.batches.length > 0`, print
one line per batch (`label: amount (was original)`) instead of the single
`priceAmount` line. No dependency on whatever the visitor had toggled in
`ApplyPanel` — the PDF is a static document, listing both options is more
useful than baking in a snapshot of UI state.

## CMS

`courses-editor.tsx` gets a new `ObjectListField` for `batches` (same pattern
as `curriculum`/`highlights`), with a `SelectField` for `mode` and the usual
`TextField`/`NumberField`s for the rest. `minItems: 0` — a course with no
batches is valid and is exactly today's behavior.

## Real classroom photos

### Asset pipeline

The 4 supplied photos (4080×3072 / 4608×3072, ~500KB JPEG each) are resized
with `sharp` (already present transitively via `next`'s optional dependency)
to max-width 1600px, quality ~78, before being committed to
`public/images/classroom/session-{1..4}.jpg`. `next.config.ts` sets
`images.unoptimized: true` (required for static export), so nothing resizes
these at request time — pre-compressing now is the only optimization this
site can get.

### Component

New `src/components/courses/classroom-gallery.tsx`: a responsive grid (2
columns on mobile, 4 on desktop) of rounded photo cards using `next/image`
(auto-handles the `/st.school2` GitHub Pages `basePath`, unlike a raw `<img
src="/...">`), `Reveal`-animated in like every other section on the site. One
section-level caption, no fabricated per-photo captions:

> "Inside a real St.School session — full room, real mentors, no stock
> photos."

### Placement

On `/courses/ui-ux-design` only, as a new section between "Why this program"
(Highlights) and the closing CTA — a trust-building beat right before the
"Apply" moment.

## Out of scope

- No changes to the Python course or `test` course content.
- No changes to `StickyCtaBar`, `ProgramsPreview`, `TrackMatcher`,
  `TrackFork`, `SeatsGauge`, or `CourseStatRow`.
- No new npm dependency added to `package.json` — `sharp` is used once,
  ad-hoc, from the already-present `node_modules/sharp` to pre-process
  images; it's not imported by any site code.
- No captions on individual photos.

## Testing / verification

- `npm run lint` and `npm run build` (which also typechecks and statically
  renders both course pages) must pass.
- Manual browser check (dev server) of `/courses/ui-ux-design`: toggle
  Online/Offline and confirm price, countdown, and seats all update
  together; confirm the gallery renders at the right spot with all 4 photos
  loading under the `/st.school2` basePath; download the brochure and
  confirm both batch fees appear.
- Manual check that `/courses/python-fullstack-ai` is pixel-identical to
  before (no batches, no gallery) — regression guard for the "batches
  optional" claim above.
