// Shared parsing for parentBrand.stats values ("1M+", "500+", "10+", "Forbes").
// Splits a leading number from its trailing suffix so it can be animated as a
// count-up; values with no leading number (e.g. "Forbes") are left alone so
// callers can render them as a static badge instead of counting to nothing.

export type ParsedStat = { number: number; suffix: string };

export function parseStatNumber(raw: string): ParsedStat | null {
  const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  return { number: parseFloat(match[1]), suffix: match[2] };
}
