import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
} from "remotion";

// The homepage-exclusive hero piece — dramatizes the brand's actual hook
// (1,000+ applications, 33 seats) instead of a generic demo reel. A field
// of dim "applicant" particles surrounds a slowly rotating ring of 33
// bright, connected nodes — the selected cohort — swept periodically by an
// expanding radar-style pulse. Built once, deterministically (remotion's
// seeded `random`) so it's identical on every render.

const OUTER_COUNT = 70;
const RING_COUNT = 33;
const CENTER = { x: 400, y: 400 };
const RING_RADIUS = 190;

function OuterField() {
  const frame = useCurrentFrame();

  return (
    <>
      {Array.from({ length: OUTER_COUNT }, (_, i) => {
        const seed = `outer-${i}`;
        const x = 40 + random(seed + "x") * 720;
        const y = 40 + random(seed + "y") * 720;
        const size = 1.5 + random(seed + "r") * 2.5;
        const breathe = 0.4 + Math.sin((frame + i * 9) / 40) * 0.25;
        const entrance = spring({
          frame: frame - random(seed + "d") * 30,
          fps: 30,
          config: { damping: 14 },
        });
        return (
          <circle
            key={seed}
            cx={x}
            cy={y}
            r={size}
            fill="var(--color-muted)"
            opacity={Math.max(0, breathe) * entrance}
          />
        );
      })}
    </>
  );
}

function ringPosition(i: number, rotation: number) {
  const angle = (i / RING_COUNT) * Math.PI * 2 + (rotation * Math.PI) / 180;
  return {
    x: CENTER.x + Math.cos(angle) * RING_RADIUS,
    y: CENTER.y + Math.sin(angle) * RING_RADIUS,
  };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// A stream of "applicant" comets flying in from the outer field and
// landing on a ring node — the literal 1,000-apply-33-selected story,
// not just an ambient ring. Each comet is a deterministic, staggered
// loop so it reads as a continuous flow rather than a single event.
const COMET_COUNT = 7;
const CYCLE = 64;
const TRAIL_STEPS = [0, 0.05, 0.1, 0.15];

function Comets({ rotation }: { rotation: number }) {
  const frame = useCurrentFrame();

  return (
    <>
      {Array.from({ length: COMET_COUNT }, (_, i) => {
        const seed = `comet-${i}`;
        const startFrame = Math.floor(random(seed + "start") * CYCLE);
        const local = ((frame - startFrame) % CYCLE + CYCLE) % CYCLE;
        const t = local / CYCLE;
        if (t > 0.85) return null;
        const travelT = Math.min(1, t / 0.85);

        const targetIndex = Math.floor(random(seed + "target") * RING_COUNT);
        const target = ringPosition(targetIndex, rotation);

        const originAngle = random(seed + "angle") * Math.PI * 2;
        const originRadius = 340 + random(seed + "radius") * 40;
        const origin = {
          x: CENTER.x + Math.cos(originAngle) * originRadius,
          y: CENTER.y + Math.sin(originAngle) * originRadius,
        };

        const posAt = (progress: number) => {
          const eased = easeOutCubic(Math.max(0, Math.min(1, progress)));
          return {
            x: origin.x + (target.x - origin.x) * eased,
            y: origin.y + (target.y - origin.y) * eased,
          };
        };

        const head = posAt(travelT);
        const arrivalFlash = interpolate(t, [0.78, 0.85], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <g key={seed}>
            {TRAIL_STEPS.map((back, si) => {
              const p = posAt(travelT - back);
              const fade = (1 - si / TRAIL_STEPS.length) * interpolate(travelT, [0, 0.08], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <circle
                  key={si}
                  cx={p.x}
                  cy={p.y}
                  r={si === 0 ? 3 : 3 - si * 0.6}
                  fill="var(--color-coral-light)"
                  opacity={fade * 0.85}
                />
              );
            })}
            {arrivalFlash > 0 && (
              <circle
                cx={target.x}
                cy={target.y}
                r={4.5 + arrivalFlash * 14}
                fill="none"
                stroke="var(--color-coral-light)"
                strokeWidth={1.5}
                opacity={(1 - arrivalFlash) * 0.9}
              />
            )}
            <circle cx={head.x} cy={head.y} r={7} fill="var(--color-coral-light)" opacity={0.25} filter="url(#cometGlow)" />
          </g>
        );
      })}
    </>
  );
}

function SelectionRing() {
  const frame = useCurrentFrame();
  const rotation = frame * 0.25;

  const ringPositions = Array.from({ length: RING_COUNT }, (_, i) => ({
    ...ringPosition(i, rotation),
    i,
  }));

  // Expanding radar pulse, repeating every 90 frames.
  const pulseT = (frame % 90) / 90;
  const pulseRadius = interpolate(pulseT, [0, 1], [20, 340]);
  const pulseOpacity = interpolate(pulseT, [0, 0.15, 1], [0, 0.5, 0]);

  return (
    <>
      <defs>
        <filter id="nodeGlow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="cometGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      <circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={pulseRadius}
        fill="none"
        stroke="var(--color-coral-light)"
        strokeWidth={1.5}
        opacity={pulseOpacity}
      />

      {ringPositions.map((p) => {
        const next = ringPositions[(p.i + 1) % RING_COUNT];
        return (
          <line
            key={`line-${p.i}`}
            x1={p.x}
            y1={p.y}
            x2={next.x}
            y2={next.y}
            stroke={p.i % 2 === 0 ? "var(--color-violet-light)" : "var(--color-coral-light)"}
            strokeOpacity={0.2}
            strokeWidth={1}
          />
        );
      })}

      <Comets rotation={rotation} />

      {ringPositions.map((p) => {
        const entrance = spring({
          frame: frame - 20 - p.i * 2,
          fps: 30,
          config: { damping: 10, mass: 0.5 },
        });
        const breathe = 1 + Math.sin((frame + p.i * 14) / 22) * 0.18;
        return (
          <g key={`node-${p.i}`}>
            <circle cx={p.x} cy={p.y} r={11 * breathe} fill="var(--color-brand-red)" opacity={0.18 * entrance} />
            <circle
              cx={p.x}
              cy={p.y}
              r={4.5}
              fill="var(--color-coral-light)"
              opacity={entrance}
              filter="url(#nodeGlow)"
            />
          </g>
        );
      })}

      <circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={40}
        fill="none"
        stroke="var(--color-paper)"
        strokeOpacity={0.15}
        strokeDasharray="3 5"
      />
    </>
  );
}

function KineticStat() {
  const frame = useCurrentFrame();
  const cycleLength = 130;
  const local = frame % cycleLength;

  const phaseOneOpacity = interpolate(local, [0, 15, 55, 70], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phaseTwoOpacity = interpolate(local, [70, 85, 120, cycleLength], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Anchored at the composition's dead center (inside the empty dashed
  // ring), the one point where the circular crop applied by the CSS wrapper
  // never clips text regardless of length — the inscribed circle is at its
  // full diameter there.
  return (
    <div className="relative flex h-10 items-center justify-center">
      <div
        className="font-display absolute text-lg font-semibold text-paper sm:text-xl"
        style={{ opacity: phaseOneOpacity }}
      >
        1,000+ applicants
      </div>
      <div
        className="font-display absolute text-lg font-semibold text-coral-light sm:text-xl"
        style={{ opacity: phaseTwoOpacity }}
      >
        33 selected
      </div>
    </div>
  );
}

export function SelectionField() {
  return (
    <AbsoluteFill className="bg-ink">
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(224,33,43,0.16), transparent)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(246,244,251,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(246,244,251,0.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <svg viewBox="0 0 800 800" className="absolute inset-0 h-full w-full">
        <OuterField />
        <SelectionRing />
      </svg>

      <AbsoluteFill className="flex items-center justify-center">
        <KineticStat />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
