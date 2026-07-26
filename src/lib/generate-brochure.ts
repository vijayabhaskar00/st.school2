import type { Course } from "@/data/content";
import { site, contact } from "@/data/content";

const RED: [number, number, number] = [224, 33, 43];
const CHARCOAL: [number, number, number] = [43, 43, 46];
const MUTED: [number, number, number] = [90, 90, 95];
const PAGE_W = 595.28; // A4 pt
const PAGE_H = 841.89;
const MARGIN = 56;
const CONTENT_W = PAGE_W - MARGIN * 2;

// jsPDF only runs in the browser, so it's dynamically imported here rather
// than at module scope — keeps it out of every page's initial bundle and
// safely no-ops if this ever got called during static prerendering.
export async function downloadBrochure(course: Course) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  let y = 0;

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  // Header band
  doc.setFillColor(...CHARCOAL);
  doc.rect(0, 0, PAGE_W, 96, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...RED);
  doc.text("st.", MARGIN, 52);
  doc.setTextColor(255, 255, 255);
  doc.text("School", MARGIN + 26, 52);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(210, 210, 212);
  doc.text(`A ${site.parentBrand} initiative — ${site.city}`, MARGIN, 72);
  y = 132;

  // Course title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 22);
  const titleLines = doc.splitTextToSize(course.name, CONTENT_W);
  doc.text(titleLines, MARGIN, y);
  y += titleLines.length * 24 + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...RED);
  const taglineLines = doc.splitTextToSize(course.tagline, CONTENT_W);
  doc.text(taglineLines, MARGIN, y);
  y += taglineLines.length * 16 + 14;

  // Meta row
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(
    `${course.duration}   ·   ${course.mode}   ·   ${course.level}`,
    MARGIN,
    y,
  );
  y += 22;

  // Summary
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 64);
  const summaryLines = doc.splitTextToSize(course.summary, CONTENT_W);
  doc.text(summaryLines, MARGIN, y);
  y += summaryLines.length * 15 + 22;

  const sectionHeading = (label: string) => {
    ensureSpace(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...CHARCOAL);
    doc.text(label, MARGIN, y);
    doc.setDrawColor(...RED);
    doc.setLineWidth(2);
    doc.line(MARGIN, y + 6, MARGIN + 28, y + 6);
    y += 24;
    doc.setFont("helvetica", "normal");
  };

  // Stack
  sectionHeading("Tech & Tools");
  doc.setFontSize(10.5);
  doc.setTextColor(40, 40, 44);
  doc.text(course.stack.join("   ·   "), MARGIN, y);
  y += 26;

  // Outcomes
  sectionHeading("What you'll walk away able to do");
  doc.setFontSize(10.5);
  for (const outcome of course.outcomes) {
    ensureSpace(18);
    doc.setTextColor(...RED);
    doc.text("✓", MARGIN, y);
    doc.setTextColor(40, 40, 44);
    const lines = doc.splitTextToSize(outcome, CONTENT_W - 16);
    doc.text(lines, MARGIN + 16, y);
    y += lines.length * 14 + 5;
  }
  y += 8;

  // Curriculum
  sectionHeading("Curriculum, phase by phase");
  for (const phase of course.curriculum) {
    ensureSpace(46);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...CHARCOAL);
    doc.text(`${phase.phase} — ${phase.title}`, MARGIN, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    const descLines = doc.splitTextToSize(phase.description, CONTENT_W);
    doc.text(descLines, MARGIN, y);
    y += descLines.length * 13 + 3;
    doc.setFontSize(9.5);
    doc.setTextColor(90, 90, 95);
    const topicsLines = doc.splitTextToSize(phase.topics.join("  ·  "), CONTENT_W);
    doc.text(topicsLines, MARGIN, y);
    y += topicsLines.length * 12 + 16;
  }

  // Highlights
  sectionHeading("Why this program");
  for (const highlight of course.highlights) {
    ensureSpace(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...CHARCOAL);
    doc.text(highlight.title, MARGIN, y);
    y += 13;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(highlight.description, CONTENT_W);
    doc.text(lines, MARGIN, y);
    y += lines.length * 12 + 10;
  }

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
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...RED);
  doc.text(`Only ${course.seatsTotal} seats per cohort — apply early.`, MARGIN, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 64);
  doc.text(`Apply: ${site.url}/contact   ·   ${contact.email}   ·   ${contact.phone}`, MARGIN, y);

  doc.save(`st-school-${course.slug}-brochure.pdf`);
}
