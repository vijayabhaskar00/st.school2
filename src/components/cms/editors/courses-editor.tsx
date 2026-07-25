"use client";

import type { Course } from "@/data/content";
import { TextField, TextAreaField, NumberField, SelectField, StringListField, ObjectListField } from "@/components/cms/fields";

const COLOR_OPTIONS: { value: Course["color"]; label: string }[] = [
  { value: "violet", label: "Violet" },
  { value: "coral", label: "Coral" },
];

export function CoursesEditor({ value, onChange }: { value: Course[]; onChange: (v: Course[]) => void }) {
  // Several components (src/components/courses-listing/track-fork.tsx and
  // the 2-column "vs" layout in src/components/courses-listing/track-matcher.tsx)
  // hardcode an assumption of exactly two courses. Zod validates the JSON
  // shape but has no idea about that cross-component assumption, so this
  // editor deliberately does NOT expose add/remove buttons for the course
  // array itself — only the two existing courses can be edited in place.
  // If a third course is ever genuinely needed, those components must be
  // updated first, and this editor's fixed-length mapping revisited.
  function updateCourse(index: number, next: Course) {
    const copy = [...value];
    copy[index] = next;
    onChange(copy);
  }

  return (
    <div className="flex flex-col gap-6">
      {value.map((course, i) => (
        <div key={course.slug || i} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-ink-elevated/60 p-6">
          <div className="border-b border-white/10 pb-2">
            <span className="text-sm font-semibold text-paper">{course.shortName || `Course ${i + 1}`}</span>
          </div>

          <TextField label="Slug" value={course.slug} onChange={(v) => updateCourse(i, { ...course, slug: v })} />
          <TextField label="Name" value={course.name} onChange={(v) => updateCourse(i, { ...course, name: v })} />
          <TextField
            label="Short name"
            value={course.shortName}
            onChange={(v) => updateCourse(i, { ...course, shortName: v })}
          />
          <TextAreaField
            label="Tagline"
            value={course.tagline}
            onChange={(v) => updateCourse(i, { ...course, tagline: v })}
          />
          <TextField label="Duration" value={course.duration} onChange={(v) => updateCourse(i, { ...course, duration: v })} />
          <TextField label="Mode" value={course.mode} onChange={(v) => updateCourse(i, { ...course, mode: v })} />
          <TextField label="Level" value={course.level} onChange={(v) => updateCourse(i, { ...course, level: v })} />
          <TextAreaField
            label="Summary"
            value={course.summary}
            onChange={(v) => updateCourse(i, { ...course, summary: v })}
          />
          <SelectField
            label="Color"
            value={course.color}
            onChange={(v) => updateCourse(i, { ...course, color: v })}
            options={COLOR_OPTIONS}
          />

          <StringListField
            label="Stack"
            items={course.stack}
            onChange={(stack) => updateCourse(i, { ...course, stack })}
          />

          <StringListField
            label="Outcomes"
            items={course.outcomes}
            onChange={(outcomes) => updateCourse(i, { ...course, outcomes })}
          />

          <ObjectListField
            label="Curriculum"
            items={course.curriculum}
            onChange={(curriculum) => updateCourse(i, { ...course, curriculum })}
            createItem={() => ({ phase: "", title: "", description: "", topics: [] })}
            itemLabel={(item) => (item.phase || item.title ? `${item.phase} — ${item.title}` : "New phase")}
            renderItem={(item, update) => (
              <>
                <TextField label="Phase" value={item.phase} onChange={(v) => update({ ...item, phase: v })} />
                <TextField label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
                <TextAreaField
                  label="Description"
                  value={item.description}
                  onChange={(v) => update({ ...item, description: v })}
                />
                <StringListField
                  label="Topics"
                  items={item.topics}
                  onChange={(topics) => update({ ...item, topics })}
                />
              </>
            )}
          />

          <ObjectListField
            label="Highlights"
            items={course.highlights}
            onChange={(highlights) => updateCourse(i, { ...course, highlights })}
            createItem={() => ({ title: "", description: "" })}
            itemLabel={(item) => item.title || "New highlight"}
            renderItem={(item, update) => (
              <>
                <TextField label="Title" value={item.title} onChange={(v) => update({ ...item, title: v })} />
                <TextAreaField
                  label="Description"
                  value={item.description}
                  onChange={(v) => update({ ...item, description: v })}
                />
              </>
            )}
          />

          <TextField
            label="Application deadline"
            value={course.applicationDeadline}
            onChange={(v) => updateCourse(i, { ...course, applicationDeadline: v })}
            hint="ISO datetime with offset, e.g. 2026-08-09T23:59:59+05:30 — this drives the countdown timer on the course page, keep it accurate."
          />

          <NumberField
            label="Seats total"
            value={course.seatsTotal}
            onChange={(v) => updateCourse(i, { ...course, seatsTotal: v })}
          />
          <NumberField
            label="Seats claimed"
            value={course.seatsClaimed}
            onChange={(v) => updateCourse(i, { ...course, seatsClaimed: v })}
          />
        </div>
      ))}
    </div>
  );
}
