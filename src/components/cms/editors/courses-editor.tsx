"use client";

import type { Course } from "@/data/content";
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
    stack: [""],
    outcomes: [""],
    curriculum: [{ phase: "", title: "", description: "", topics: [""] }],
    highlights: [{ title: "", description: "" }],
    applicationDeadline: "",
    seatsTotal: 33,
    seatsClaimed: 0,
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
        </>
        );
      }}
    />
  );
}
