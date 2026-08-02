"use client";

import type { Course, Batch } from "@/data/content";
import { TextField, TextAreaField, NumberField, SelectField, StringListField, ObjectListField } from "@/components/cms/fields";

const COLOR_OPTIONS: { value: Course["color"]; label: string }[] = [
  { value: "violet", label: "Violet" },
  { value: "coral", label: "Coral" },
];

const TEMPLATE_OPTIONS: { value: Course["template"]; label: string }[] = [
  { value: "python-ai", label: "Python/AI hero (bespoke Remotion)" },
  { value: "ui-ux", label: "Design hero (bespoke Remotion)" },
  { value: "generic", label: "Generic hero (default — works for any program)" },
];

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

function createCourse(): Course {
  return {
    slug: "",
    name: "",
    shortName: "",
    tagline: "",
    duration: "",
    mode: "",
    level: "",
    summary: "",
    color: "violet",
    template: "generic",
    priceAmount: 0,
    priceOriginalAmount: 0,
    priceCurrency: "₹",
    priceNote: "",
    stack: [""],
    outcomes: [""],
    curriculum: [{ phase: "", title: "", description: "", topics: [""] }],
    highlights: [{ title: "", description: "" }],
    applicationDeadline: "",
    seatsTotal: 33,
    seatsClaimed: 0,
    batches: [],
  };
}

export function CoursesEditor({ value, onChange }: { value: Course[]; onChange: (v: Course[]) => void }) {
  // Add/remove used to be deliberately unsupported here because a couple of
  // components hardcoded an assumption of exactly two courses. That
  // assumption has since been fixed everywhere (track-fork.tsx renders any
  // number of tracks, track-matcher.tsx was already safely pairwise-only,
  // routing/sitemap were already fully dynamic, and course.template picks
  // the detail page's hero explicitly instead of guessing from the slug) —
  // so the top-level course array is now just another ObjectListField, the
  // same pattern used one level down for curriculum/highlights.
  return (
    <ObjectListField
      label="Courses"
      items={value}
      onChange={onChange}
      minItems={1}
      collapsible
      createItem={createCourse}
      itemLabel={(course) => course.shortName || "New program"}
      renderItem={(course, update) => {
        const slugHint =
          course.slug && value.filter((c) => c.slug === course.slug).length > 1
            ? "Duplicate slug — another program already uses this slug. Save will fail until each slug is unique."
            : "Lowercase, hyphens only — becomes the page at /courses/<slug>. Changing this after the page is live will break existing links to it.";
        return (
        <>
          <TextField
            label="Slug"
            value={course.slug}
            onChange={(v) => update({ ...course, slug: v })}
            hint={slugHint}
          />
          <TextField label="Name" value={course.name} onChange={(v) => update({ ...course, name: v })} />
          <TextField
            label="Short name"
            value={course.shortName}
            onChange={(v) => update({ ...course, shortName: v })}
          />
          <TextAreaField
            label="Tagline"
            value={course.tagline}
            onChange={(v) => update({ ...course, tagline: v })}
          />
          <TextField label="Duration" value={course.duration} onChange={(v) => update({ ...course, duration: v })} />
          <TextField label="Mode" value={course.mode} onChange={(v) => update({ ...course, mode: v })} />
          <TextField label="Level" value={course.level} onChange={(v) => update({ ...course, level: v })} />
          <TextAreaField
            label="Summary"
            value={course.summary}
            onChange={(v) => update({ ...course, summary: v })}
          />
          <SelectField
            label="Color"
            value={course.color}
            onChange={(v) => update({ ...course, color: v })}
            options={COLOR_OPTIONS}
          />
          <SelectField
            label="Template"
            value={course.template}
            onChange={(v) => update({ ...course, template: v })}
            options={TEMPLATE_OPTIONS}
            hint="Which hero visual and bonus interactive section this program's page gets. The bespoke Python/AI and Design heroes are hand-built for those two specific programs — pick Generic for anything else, it's a real, complete hero, not a placeholder."
          />

          <div className="mt-1 border-t border-white/10 pt-4">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-soft">Pricing</span>
          </div>
          <p className="-mt-2 text-xs leading-relaxed text-muted-soft">
            Shown on the course page behind a small &quot;unlock pricing&quot; lead-capture form — visitors
            see a blurred price until they submit their name, email, and phone.
          </p>
          <NumberField
            label="Price"
            value={course.priceAmount}
            onChange={(v) => update({ ...course, priceAmount: v })}
            hint="The real program fee shown once a visitor unlocks pricing."
          />
          <NumberField
            label="Compare-at price (optional)"
            value={course.priceOriginalAmount}
            onChange={(v) => update({ ...course, priceOriginalAmount: v })}
            hint="Shown struck through next to the price for a discount effect, e.g. a higher 'was' price. Set to 0 to hide it."
          />
          <TextField
            label="Currency symbol"
            value={course.priceCurrency}
            onChange={(v) => update({ ...course, priceCurrency: v })}
            hint='e.g. "₹" or "$"'
          />
          <TextField
            label="Price note"
            value={course.priceNote}
            onChange={(v) => update({ ...course, priceNote: v })}
            hint='Optional short line under the price, e.g. "One-time program fee · No-cost EMI available".'
          />

          <StringListField
            label="Stack"
            items={course.stack}
            onChange={(stack) => update({ ...course, stack })}
          />

          <StringListField
            label="Outcomes"
            items={course.outcomes}
            onChange={(outcomes) => update({ ...course, outcomes })}
          />

          <ObjectListField
            label="Curriculum"
            items={course.curriculum}
            onChange={(curriculum) => update({ ...course, curriculum })}
            minItems={1}
            collapsible
            createItem={() => ({ phase: "", title: "", description: "", topics: [""] })}
            itemLabel={(item) => (item.phase || item.title ? `${item.phase} — ${item.title}` : "New phase")}
            renderItem={(item, updateItem) => (
              <>
                <TextField label="Phase" value={item.phase} onChange={(v) => updateItem({ ...item, phase: v })} />
                <TextField label="Title" value={item.title} onChange={(v) => updateItem({ ...item, title: v })} />
                <TextAreaField
                  label="Description"
                  value={item.description}
                  onChange={(v) => updateItem({ ...item, description: v })}
                />
                <StringListField
                  label="Topics"
                  items={item.topics}
                  onChange={(topics) => updateItem({ ...item, topics })}
                />
              </>
            )}
          />

          <ObjectListField
            label="Highlights"
            items={course.highlights}
            onChange={(highlights) => update({ ...course, highlights })}
            minItems={1}
            collapsible
            createItem={() => ({ title: "", description: "" })}
            itemLabel={(item) => item.title || "New highlight"}
            renderItem={(item, updateItem) => (
              <>
                <TextField label="Title" value={item.title} onChange={(v) => updateItem({ ...item, title: v })} />
                <TextAreaField
                  label="Description"
                  value={item.description}
                  onChange={(v) => updateItem({ ...item, description: v })}
                />
              </>
            )}
          />

          <TextField
            label="Application deadline"
            value={course.applicationDeadline}
            onChange={(v) => update({ ...course, applicationDeadline: v })}
            hint="ISO datetime with offset, e.g. 2026-08-09T23:59:59+05:30 — this drives the countdown timer on the course page, keep it accurate."
          />

          <NumberField
            label="Seats total"
            value={course.seatsTotal}
            onChange={(v) => update({ ...course, seatsTotal: v })}
          />
          <NumberField
            label="Seats claimed"
            value={course.seatsClaimed}
            onChange={(v) => update({ ...course, seatsClaimed: v })}
          />

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
        </>
        );
      }}
    />
  );
}
