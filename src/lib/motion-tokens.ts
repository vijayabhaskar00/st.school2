// Shared motion vocabulary. Most existing components declare their own
// local `const EASE = [0.16, 1, 0.3, 1]` — that curve stays the default for
// everyday micro-interactions (hover states, small reveals) and isn't worth
// mass-migrating everywhere at once. What's been missing is a *second* tier
// for scene-level moments (hero entrances, route transitions) that should
// read as more deliberate/cinematic than a button hover — and a couple of
// shared spring presets so new code stops inventing stiffness/damping pairs
// ad hoc. New motion work should pull from here; existing files aren't
// required to migrate just to migrate.

/** Default micro-interaction curve used across the existing codebase — kept here too so new code can share the reference instead of redeclaring it. */
export const EASE_SNAPPY = [0.16, 1, 0.3, 1] as const;

/** Slower, more deliberate curve for scene-level moments: hero entrances, route transitions, anything that should feel directed rather than incidental. */
export const EASE_CINEMATIC = [0.22, 1, 0.36, 1] as const;

/** Gentle settle — content easing into place (cards, panels, reveals that want weight without bounce). */
export const SPRING_SOFT = { type: "spring", stiffness: 200, damping: 26, mass: 0.9 } as const;

/** Quick, responsive settle — cursor-following and hover-driven motion that needs to feel immediate. */
export const SPRING_SNAPPY = { type: "spring", stiffness: 400, damping: 22 } as const;
