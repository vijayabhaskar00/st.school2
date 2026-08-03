import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
} from "remotion";

// The UI/UX Design program's bespoke hero piece — a design system assembling
// itself. A baseline grid and column guides draw in, wireframe boxes snap onto
// the grid with spring physics, a type scale steps into place, a grey palette
// resolves into the brand ramp, Figma-style redlines flash over the spacing,
// and the whole board settles into a "shipped" state before looping.
//
// Deliberately unlike the other composition in this repo: neural-pulse is a
// node graph — this one is orthogonal, snapped, and rectilinear, because
// that's what the craft actually looks like.
// Deterministic throughout (remotion's seeded `random`, never Math.random).

const FPS = 30;

// Six acts, one shared clock. Every sub-component below derives its own
// timing from `getPhaseWeights(frame)` so the board state, the redlines, the
// cursor and the act label can never drift apart. `local` is exported in the
// return value so components can stagger their own springs off the one
// canonical cycle position.
const CYCLE_LENGTH = 240;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

function getPhaseWeights(frame: number) {
  const local = frame % CYCLE_LENGTH;

  // Act 1 — guides draw in, then recede to a working dim.
  const grid = interpolate(local, [0, 34], [0, 1], clamp);
  const guides = interpolate(local, [34, 66, 200, 226], [1, 0.55, 0.55, 0.14], clamp);
  // Act 2 — boxes snap onto the grid (gate; per-box springs read `local`).
  const blocks = interpolate(local, [38, 96], [0, 1], clamp);
  // Act 3 — type scale steps in.
  const typeset = interpolate(local, [98, 142], [0, 1], clamp);
  // Act 4 — palette resolves grey -> brand ramp.
  const palette = interpolate(local, [132, 180], [0, 1], clamp);
  // Act 5 — redlines / dimension ticks flash in, then out.
  const measure = interpolate(local, [168, 182, 202, 214], [0, 1, 1, 0], clamp);
  // Act 6 — shipped: strokes solidify, fills land, selection handles appear.
  const ship = interpolate(local, [206, 228], [0, 1], clamp);
  // Clean hand-off back to an empty artboard.
  const exit = interpolate(local, [228, 240], [0, 1], clamp);

  return { local, grid, guides, blocks, typeset, palette, measure, ship, exit };
}

// --- Layout, on an 8pt grid ------------------------------------------------
// Everything lives inside a 416x456 artboard centred in the 800x800 square,
// which keeps every element (and every label) well inside the inscribed
// circle the CSS wrapper crops to.
const FRAME = { x: 192, y: 152, w: 416, h: 456 };
const CONTENT = { x: 216, right: 584, w: 368 };

type Box = { id: string; x: number; y: number; w: number; h: number; rx: number };

const BOXES: Box[] = [
  { id: "nav", x: 216, y: 176, w: 368, h: 32, rx: 8 },
  { id: "hero", x: 216, y: 224, w: 368, h: 128, rx: 12 },
  { id: "cardA", x: 216, y: 440, w: 176, h: 96, rx: 10 },
  { id: "cardB", x: 408, y: 440, w: 176, h: 96, rx: 10 },
];

const TYPE_BARS = [
  { x: 216, y: 368, w: 248, h: 20, step: "48" },
  { x: 216, y: 402, w: 328, h: 12, step: "32" },
  { x: 216, y: 424, w: 240, h: 12, step: "16" },
];

const SWATCHES = [
  { x: 268, color: "var(--color-brand-red)" },
  { x: 324, color: "var(--color-violet-light)" },
  { x: 380, color: "var(--color-coral)" },
  { x: 436, color: "var(--color-coral-light)" },
  { x: 492, color: "var(--color-acid)" },
];
const SWATCH = { y: 552, size: 40 };

// Four columns + 16px gutters inside the content width.
const COLUMNS = [216, 312, 408, 504];
const COLUMN_WIDTH = 80;

const BASELINES = Array.from({ length: 19 }, (_, i) => FRAME.y + 24 * (i + 1));

// --- Guides ----------------------------------------------------------------

function Guides() {
  const frame = useCurrentFrame();
  const { grid, guides, ship } = getPhaseWeights(frame);

  return (
    <g>
      {/* Column tints */}
      {COLUMNS.map((x, i) => {
        const reveal = interpolate(grid, [0.25 + i * 0.12, 0.65 + i * 0.12], [0, 1], clamp);
        return (
          <rect
            key={`col-${x}`}
            x={x}
            y={FRAME.y + 16}
            width={COLUMN_WIDTH}
            height={FRAME.h - 32}
            fill="var(--color-coral)"
            opacity={0.05 * reveal * guides}
          />
        );
      })}

      {/* Baseline grid, drawing left to right */}
      {BASELINES.map((y, i) => {
        const reveal = interpolate(grid, [i * 0.03, i * 0.03 + 0.42], [0, 1], clamp);
        if (reveal <= 0) return null;
        return (
          <line
            key={`base-${y}`}
            x1={FRAME.x}
            y1={y}
            x2={FRAME.x + FRAME.w * reveal}
            y2={y}
            stroke="var(--color-paper)"
            strokeOpacity={0.09 * guides}
            strokeWidth={2}
          />
        );
      })}

      {/* Margin guides, drawing top to bottom */}
      {[CONTENT.x, CONTENT.right].map((x, i) => {
        const reveal = interpolate(grid, [0.15 + i * 0.1, 0.75 + i * 0.1], [0, 1], clamp);
        if (reveal <= 0) return null;
        return (
          <line
            key={`margin-${x}`}
            x1={x}
            y1={FRAME.y}
            x2={x}
            y2={FRAME.y + FRAME.h * reveal}
            stroke="var(--color-coral-light)"
            strokeOpacity={0.45 * guides}
            strokeWidth={2}
            strokeDasharray="6 8"
          />
        );
      })}

      {/* Artboard outline — grey while in progress, coral once shipped */}
      <rect
        x={FRAME.x}
        y={FRAME.y}
        width={FRAME.w}
        height={FRAME.h}
        rx={16}
        fill="none"
        stroke="var(--color-muted)"
        strokeOpacity={0.3 * grid * (1 - ship)}
        strokeWidth={2}
      />
      <rect
        x={FRAME.x}
        y={FRAME.y}
        width={FRAME.w}
        height={FRAME.h}
        rx={16}
        fill="none"
        stroke="var(--color-coral-light)"
        strokeOpacity={0.75 * ship}
        strokeWidth={2}
      />

      {/* Layer name, the way a canvas always has one */}
      <text
        className="font-display"
        x={FRAME.x}
        y={138}
        fontSize={20}
        letterSpacing={2}
        fill="var(--color-muted-soft)"
        opacity={0.55 * grid * (1 - ship)}
      >
        ARTBOARD / HOME
      </text>
      <text
        className="font-display"
        x={FRAME.x}
        y={138}
        fontSize={20}
        letterSpacing={2}
        fill="var(--color-coral-light)"
        opacity={0.9 * ship}
      >
        ARTBOARD / HOME
      </text>

      {/* Selection handles — the artboard is "picked" once it ships */}
      {ship > 0.02 &&
        [
          [FRAME.x, FRAME.y],
          [FRAME.x + FRAME.w, FRAME.y],
          [FRAME.x, FRAME.y + FRAME.h],
          [FRAME.x + FRAME.w, FRAME.y + FRAME.h],
        ].map(([hx, hy]) => (
          <rect
            key={`handle-${hx}-${hy}`}
            x={hx - 5}
            y={hy - 5}
            width={10}
            height={10}
            rx={2}
            fill="var(--color-paper)"
            stroke="var(--color-coral-light)"
            strokeWidth={2}
            opacity={ship}
          />
        ))}
    </g>
  );
}

// --- Boxes snapping onto the grid ------------------------------------------

function Blocks() {
  const frame = useCurrentFrame();
  const { local, grid, ship } = getPhaseWeights(frame);
  const detail = interpolate(ship, [0.15, 0.75], [0, 1], clamp);

  return (
    <g>
      {BOXES.map((b, i) => {
        const start = 38 + i * 8;
        const entrance = spring({
          frame: local - start,
          fps: FPS,
          config: { damping: 12, mass: 0.7 },
        });
        // Deterministic off-grid start position — each box flies in from
        // somewhere slightly different, then snaps.
        const offX = (random(`box-${b.id}-x`) - 0.5) * 110;
        const offY = (random(`box-${b.id}-y`) - 0.5) * 90 - 26;
        const dx = offX * (1 - entrance);
        const dy = offY * (1 - entrance);
        const scale = 0.88 + entrance * 0.12;
        const cx = b.x + b.w / 2;
        const cy = b.y + b.h / 2;

        // The snap flash — the little confirmation pop when a frame locks
        // onto the grid.
        const snap = interpolate(
          local,
          [start + 9, start + 15, start + 30],
          [0, 0.85, 0],
          clamp,
        );
        const ghost = interpolate(grid, [0.4, 0.9], [0, 1], clamp) * (1 - entrance) * 0.5;

        return (
          <g key={b.id}>
            {/* Where it's headed */}
            <rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={b.rx}
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth={2}
              strokeDasharray="4 8"
              opacity={ghost}
            />

            <g
              transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy}) translate(${dx} ${dy})`}
              opacity={entrance}
            >
              {/* Wireframe fill -> shipped fill */}
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx={b.rx}
                fill="var(--color-ink-elevated)"
                opacity={0.75 * (1 - ship * 0.35)}
              />
              {b.id === "hero" ? (
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx={b.rx}
                  fill="url(#dsbHero)"
                  opacity={0.9 * ship}
                />
              ) : (
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx={b.rx}
                  fill="var(--color-coral)"
                  opacity={0.12 * ship}
                />
              )}

              {/* Dashed wireframe stroke crossfading to a solid one */}
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx={b.rx}
                fill="none"
                stroke="var(--color-muted)"
                strokeWidth={2}
                strokeDasharray="8 6"
                opacity={0.85 * (1 - ship)}
              />
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx={b.rx}
                fill="none"
                stroke="var(--color-coral-light)"
                strokeWidth={2.5}
                opacity={0.8 * ship}
              />
              {snap > 0 && (
                <rect
                  x={b.x - 4}
                  y={b.y - 4}
                  width={b.w + 8}
                  height={b.h + 8}
                  rx={b.rx + 4}
                  fill="none"
                  stroke="var(--color-coral-light)"
                  strokeWidth={2.5}
                  opacity={snap}
                />
              )}

              {/* Contents land last — the payoff of the shipped act */}
              {b.id === "nav" && (
                <g opacity={detail}>
                  <rect x={b.x + 12} y={b.y + 8} width={16} height={16} rx={4} fill="var(--color-paper)" opacity={0.9} />
                  {[0, 1, 2].map((d) => (
                    <rect
                      key={d}
                      x={b.x + b.w - 92 + d * 28}
                      y={b.y + 13}
                      width={20}
                      height={6}
                      rx={3}
                      fill="var(--color-paper)"
                      opacity={0.55}
                    />
                  ))}
                </g>
              )}
              {(b.id === "cardA" || b.id === "cardB") && (
                <g opacity={detail}>
                  <circle cx={b.x + 26} cy={b.y + 28} r={10} fill="var(--color-coral-light)" opacity={0.85} />
                  <rect x={b.x + 16} y={b.y + 52} width={b.w - 60} height={8} rx={4} fill="var(--color-paper)" opacity={0.6} />
                  <rect x={b.x + 16} y={b.y + 68} width={b.w - 96} height={8} rx={4} fill="var(--color-paper)" opacity={0.35} />
                </g>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );
}

// --- Type scale ------------------------------------------------------------

function TypeScale() {
  const frame = useCurrentFrame();
  const { local, measure, ship } = getPhaseWeights(frame);

  return (
    <g>
      {TYPE_BARS.map((bar, i) => {
        const entrance = spring({
          frame: local - (98 + i * 8),
          fps: FPS,
          config: { damping: 13, mass: 0.6 },
        });
        const sx = Math.max(0.001, entrance);
        return (
          <g key={bar.step}>
            <g
              transform={`translate(${bar.x} 0) scale(${sx} 1) translate(${-bar.x} 0)`}
              opacity={Math.min(1, entrance * 1.4)}
            >
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.w}
                height={bar.h}
                rx={bar.h / 2}
                fill="var(--color-muted)"
                opacity={0.55 * (1 - ship)}
              />
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.w}
                height={bar.h}
                rx={bar.h / 2}
                fill="var(--color-paper)"
                opacity={0.85 * ship}
              />
            </g>
            {/* Scale steps, called out with the redlines */}
            <text
              className="font-display"
              x={FRAME.x - 10}
              y={bar.y + bar.h / 2 + 7}
              fontSize={22}
              textAnchor="end"
              fill="var(--color-coral-light)"
              opacity={measure * entrance}
            >
              {bar.step}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// --- Palette ---------------------------------------------------------------

function Palette() {
  const frame = useCurrentFrame();
  const { local, ship } = getPhaseWeights(frame);

  return (
    <g>
      {SWATCHES.map((s, i) => {
        const entrance = spring({
          frame: local - (70 + i * 4),
          fps: FPS,
          config: { damping: 14, mass: 0.6 },
        });
        // Grey placeholder crossfading to the brand ramp — two stacked rects
        // swapping opacity rather than tweening a color string.
        const resolve = interpolate(local, [132 + i * 6, 156 + i * 6], [0, 1], clamp);
        const pop = 1 + Math.sin(Math.PI * resolve) * 0.1;
        const cx = s.x + SWATCH.size / 2;
        const cy = SWATCH.y + SWATCH.size / 2;

        return (
          <g
            key={s.color}
            transform={`translate(${cx} ${cy}) scale(${(0.8 + entrance * 0.2) * pop}) translate(${-cx} ${-cy})`}
            opacity={entrance}
          >
            <rect
              x={s.x}
              y={SWATCH.y}
              width={SWATCH.size}
              height={SWATCH.size}
              rx={8}
              fill="var(--color-ink-elevated)"
              stroke="var(--color-muted)"
              strokeWidth={2}
              strokeOpacity={0.5 * (1 - resolve)}
              opacity={1 - resolve}
            />
            <rect
              x={s.x}
              y={SWATCH.y}
              width={SWATCH.size}
              height={SWATCH.size}
              rx={8}
              fill={s.color}
              opacity={resolve}
            />
            <rect
              x={s.x}
              y={SWATCH.y}
              width={SWATCH.size}
              height={SWATCH.size}
              rx={8}
              fill="none"
              stroke="var(--color-paper)"
              strokeWidth={2}
              strokeOpacity={0.25 * ship * resolve}
            />
          </g>
        );
      })}
    </g>
  );
}

// --- Redlines --------------------------------------------------------------

function DimLine({
  x1,
  y1,
  x2,
  y2,
  label,
  offset,
  opacity,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  offset: number;
  opacity: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.max(1, Math.hypot(dx, dy));
  // Unit normal, so caps and the label sit perpendicular to the measurement.
  const nx = -dy / len;
  const ny = dx / len;
  const cap = 7;
  const mx = (x1 + x2) / 2 + nx * offset;
  const my = (y1 + y2) / 2 + ny * offset;
  const pillW = label.length * 13 + 16;

  return (
    <g opacity={opacity}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-coral-light)" strokeWidth={2} />
      <line
        x1={x1 - nx * cap}
        y1={y1 - ny * cap}
        x2={x1 + nx * cap}
        y2={y1 + ny * cap}
        stroke="var(--color-coral-light)"
        strokeWidth={2}
      />
      <line
        x1={x2 - nx * cap}
        y1={y2 - ny * cap}
        x2={x2 + nx * cap}
        y2={y2 + ny * cap}
        stroke="var(--color-coral-light)"
        strokeWidth={2}
      />
      <rect
        x={mx - pillW / 2}
        y={my - 14}
        width={pillW}
        height={28}
        rx={6}
        fill="var(--color-ink)"
        opacity={0.9}
      />
      <text
        className="font-display"
        x={mx}
        y={my + 8}
        fontSize={22}
        textAnchor="middle"
        fill="var(--color-coral-light)"
      >
        {label}
      </text>
    </g>
  );
}

function Redlines() {
  const frame = useCurrentFrame();
  const { local, measure } = getPhaseWeights(frame);
  if (measure <= 0) return null;

  // Staggered so the three measurements pop in sequence, like a designer
  // tabbing between two elements to check the gap.
  const stagger = (i: number) =>
    measure * interpolate(local, [168 + i * 8, 180 + i * 8], [0, 1], clamp);

  return (
    <g>
      <DimLine x1={202} y1={224} x2={202} y2={352} label="128" offset={26} opacity={stagger(0)} />
      <DimLine x1={392} y1={488} x2={408} y2={488} label="16" offset={-30} opacity={stagger(1)} />
      <DimLine
        x1={CONTENT.x}
        y1={622}
        x2={CONTENT.right}
        y2={622}
        label="368"
        offset={0}
        opacity={stagger(2)}
      />
    </g>
  );
}

// --- The designer's cursor -------------------------------------------------

const CURSOR_PATH = [
  { at: 0, x: 300, y: 632 },
  { at: 26, x: 212, y: 198 },
  { at: 54, x: 402, y: 300 },
  { at: 86, x: 300, y: 470 },
  { at: 118, x: 340, y: 388 },
  { at: 152, x: 290, y: 572 },
  { at: 188, x: 402, y: 492 },
  { at: 216, x: 556, y: 198 },
  { at: 240, x: 300, y: 632 },
];

const CLICKS = [54, 86, 118, 152, 216];

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function cursorAt(local: number) {
  for (let i = 0; i < CURSOR_PATH.length - 1; i += 1) {
    const a = CURSOR_PATH[i];
    const b = CURSOR_PATH[i + 1];
    if (local >= a.at && local <= b.at) {
      const t = easeInOutCubic((local - a.at) / (b.at - a.at));
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
  }
  return { x: CURSOR_PATH[0].x, y: CURSOR_PATH[0].y };
}

function Cursor() {
  const frame = useCurrentFrame();
  const { local } = getPhaseWeights(frame);
  const { x, y } = cursorAt(local);

  return (
    <g>
      {CLICKS.map((at) => {
        const t = interpolate(local, [at, at + 16], [0, 1], clamp);
        if (t <= 0 || t >= 1) return null;
        const p = cursorAt(at);
        return (
          <circle
            key={at}
            cx={p.x}
            cy={p.y}
            r={6 + t * 30}
            fill="none"
            stroke="var(--color-coral-light)"
            strokeWidth={2}
            opacity={(1 - t) * 0.8}
          />
        );
      })}
      <g transform={`translate(${x} ${y}) scale(1.5)`}>
        <path
          d="M0 0 L0 17 L4.4 13.2 L7.4 20 L10.6 18.6 L7.7 12 L13.6 12 Z"
          fill="var(--color-paper)"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}

// --- Act label -------------------------------------------------------------

// [fade-in start, fully in, hold until, fully out] — same clock as the board.
const ACTS: { title: string; sub: string; window: [number, number, number, number] }[] = [
  { title: "Grid", sub: "8 pt baseline", window: [2, 14, 36, 46] },
  { title: "Layout", sub: "Snap to columns", window: [46, 56, 90, 100] },
  { title: "Type", sub: "48 / 32 / 16", window: [100, 110, 130, 140] },
  { title: "Color", sub: "Ramp resolved", window: [140, 150, 168, 178] },
  { title: "Spacing", sub: "Redlines checked", window: [178, 188, 202, 212] },
  { title: "Shipped", sub: "Design system v1", window: [212, 222, 232, 240] },
];

function ActLabel() {
  const frame = useCurrentFrame();
  const { local } = getPhaseWeights(frame);

  // Anchored in the clear band between the artboard frame (which ends at
  // FRAME.y + FRAME.h = 608, plus the "368" content-width redline just
  // under it) and the bottom of the circular crop — - putting it on the
  // composition's centre line instead drops it straight onto the type
  // scale and hero, where the kicker becomes unreadable the moment those
  // fill in during the Shipped act. Sizes are fixed px in composition
  // units, so they scale with the player rather than the viewport.
  return (
    <div className="relative flex h-[86px] w-full items-start justify-center">
      {ACTS.map((act) => {
        const opacity = interpolate(local, act.window, [0, 1, 1, 0], clamp);
        if (opacity <= 0) return null;
        const rise = interpolate(local, [act.window[0], act.window[1]], [10, 0], clamp);
        return (
          <div
            key={act.title}
            className="absolute flex flex-col items-center gap-2 text-center"
            style={{ opacity, transform: `translateY(${rise}px)` }}
          >
            <div
              className="font-display font-medium text-paper"
              style={{ fontSize: 40, lineHeight: 1 }}
            >
              {act.title}
            </div>
            <div
              className="font-display uppercase text-coral-light"
              style={{ fontSize: 19, letterSpacing: "0.18em" }}
            >
              {act.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Composition -----------------------------------------------------------

function Board() {
  const frame = useCurrentFrame();
  const { ship, exit } = getPhaseWeights(frame);
  // A single polish sweep across the artboard as it ships.
  const sweep = interpolate(ship, [0, 1], [FRAME.x - 260, FRAME.x + FRAME.w + 120], clamp);
  const sweepOpacity = interpolate(ship, [0, 0.25, 0.8, 1], [0, 0.5, 0.5, 0], clamp);

  return (
    <g opacity={1 - exit}>
      <Guides />
      <Blocks />
      <TypeScale />
      <Palette />
      <g clipPath="url(#dsbFrameClip)">
        <rect
          x={sweep}
          y={FRAME.y - 40}
          width={150}
          height={FRAME.h + 80}
          fill="url(#dsbSweep)"
          opacity={sweepOpacity}
          transform={`translate(0 380) skewX(-12) translate(0 -380)`}
        />
      </g>
      <Redlines />
    </g>
  );
}

export function DesignSystemBuild() {
  return (
    <AbsoluteFill className="bg-ink">
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255,75,75,0.18), transparent)",
        }}
      />
      {/* A dot grid rather than the line grids used by the other two pieces */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(246,244,251,0.07) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <svg viewBox="0 0 800 800" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="dsbHero" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-red)" />
            <stop offset="100%" stopColor="var(--color-coral-light)" />
          </linearGradient>
          <linearGradient id="dsbSweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-paper)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-paper)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-paper)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="dsbFrameClip">
            <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} rx={16} />
          </clipPath>
        </defs>

        <Board />
        <Cursor />
      </svg>

      {/* AbsoluteFill is already `display:flex; flex-direction:column`, so the
          bottom edge is the MAIN axis here — it takes justify-end, not
          items-end (items-* would only push the label right). */}
      <AbsoluteFill className="items-center justify-end" style={{ paddingBottom: 60 }}>
        <ActLabel />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export const DESIGN_SYSTEM_BUILD_CYCLE = CYCLE_LENGTH;
