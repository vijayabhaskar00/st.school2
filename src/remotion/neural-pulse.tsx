import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// A bespoke, energetic Remotion piece for the Python Full-Stack + AI
// program hero — a pulsing neural network with traveling signal dots and
// a kinetic word cycler. Distinct from both the homepage reel (calm,
// two-panel "what we build" demo) and the UI/UX mascot illustration.

type Node = { x: number; y: number; layer: number; index: number };
type Connection = { from: Node; to: Node; seed: number };

const INPUT: Node[] = [
  { x: 170, y: 230, layer: 0, index: 0 },
  { x: 170, y: 400, layer: 0, index: 1 },
  { x: 170, y: 570, layer: 0, index: 2 },
];

const HIDDEN: Node[] = [
  { x: 400, y: 170, layer: 1, index: 0 },
  { x: 400, y: 330, layer: 1, index: 1 },
  { x: 400, y: 470, layer: 1, index: 2 },
  { x: 400, y: 630, layer: 1, index: 3 },
];

const OUTPUT: Node[] = [
  { x: 630, y: 300, layer: 2, index: 0 },
  { x: 630, y: 500, layer: 2, index: 1 },
];

const CONNECTIONS: Connection[] = [
  { from: INPUT[0], to: HIDDEN[0], seed: 1 },
  { from: INPUT[0], to: HIDDEN[1], seed: 2 },
  { from: INPUT[1], to: HIDDEN[1], seed: 3 },
  { from: INPUT[1], to: HIDDEN[2], seed: 4 },
  { from: INPUT[1], to: HIDDEN[0], seed: 5 },
  { from: INPUT[2], to: HIDDEN[2], seed: 6 },
  { from: INPUT[2], to: HIDDEN[3], seed: 7 },
  { from: HIDDEN[0], to: OUTPUT[0], seed: 8 },
  { from: HIDDEN[1], to: OUTPUT[0], seed: 9 },
  { from: HIDDEN[2], to: OUTPUT[1], seed: 10 },
  { from: HIDDEN[3], to: OUTPUT[1], seed: 11 },
  { from: HIDDEN[1], to: OUTPUT[1], seed: 12 },
];

const ALL_NODES = [...INPUT, ...HIDDEN, ...OUTPUT];

function NetworkLines() {
  const frame = useCurrentFrame();

  return (
    <svg viewBox="0 0 800 800" className="absolute inset-0 h-full w-full">
      {CONNECTIONS.map((c, i) => {
        const speed = 0.55 + random(`speed-${c.seed}`) * 0.5;
        const phase = random(`phase-${c.seed}`);
        const t = (frame * 0.01 * speed + phase) % 1;
        const dotX = c.from.x + (c.to.x - c.from.x) * t;
        const dotY = c.from.y + (c.to.y - c.from.y) * t;
        const dotOpacity = interpolate(t, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

        return (
          <g key={i}>
            <line
              x1={c.from.x}
              y1={c.from.y}
              x2={c.to.x}
              y2={c.to.y}
              stroke="var(--color-violet-light)"
              strokeOpacity={0.18}
              strokeWidth={1.5}
            />
            <circle cx={dotX} cy={dotY} r={4} fill="var(--color-coral-light)" opacity={dotOpacity} />
          </g>
        );
      })}

      {ALL_NODES.map((n, i) => {
        const pulse = spring({
          frame: frame - n.layer * 8 - n.index * 4,
          fps: 30,
          config: { damping: 8, mass: 0.6 },
          durationInFrames: 40,
        });
        const breathe = 1 + Math.sin((frame + i * 12) / 18) * 0.08;
        return (
          <g key={i}>
            <circle
              cx={n.x}
              cy={n.y}
              r={16 * breathe}
              fill="var(--color-violet)"
              opacity={0.15 * pulse}
            />
            <circle
              cx={n.x}
              cy={n.y}
              r={7}
              fill="var(--color-violet-light)"
              opacity={0.5 + 0.5 * pulse}
            />
          </g>
        );
      })}
    </svg>
  );
}

function Particles() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const particles = Array.from({ length: 22 }, (_, i) => i);

  return (
    <>
      {particles.map((i) => {
        const seed = `particle-${i}`;
        const x = 60 + random(seed + "x") * 680;
        const baseY = random(seed + "y") * 800;
        const speed = 0.3 + random(seed + "s") * 0.6;
        const y = (baseY - frame * speed) % 840;
        const wrappedY = y < -20 ? y + 840 : y;
        const size = 1.5 + random(seed + "r") * 2.5;
        const opacity = interpolate(
          frame % durationInFrames,
          [0, 20, durationInFrames - 20, durationInFrames],
          [0, 0.5, 0.5, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div
            key={i}
            className="absolute rounded-full bg-coral-light"
            style={{ left: x, top: wrappedY, width: size, height: size, opacity }}
          />
        );
      })}
    </>
  );
}

const WORDS = ["Train.", "Fine-tune.", "Deploy.", "Ship."];

function KineticWord() {
  const frame = useCurrentFrame();
  const cycleLength = 45;
  const index = Math.floor(frame / cycleLength) % WORDS.length;
  const localFrame = frame % cycleLength;

  const pop = spring({
    frame: localFrame,
    fps: 30,
    config: { damping: 11, mass: 0.5 },
  });
  const exitFade = interpolate(localFrame, [cycleLength - 12, cycleLength], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="font-display text-6xl font-bold text-paper"
      style={{
        opacity: pop * exitFade,
        transform: `scale(${0.7 + pop * 0.3})`,
      }}
    >
      {WORDS[index]}
    </div>
  );
}

export function NeuralPulse() {
  return (
    <AbsoluteFill className="bg-ink">
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 70% at 50% 40%, rgba(224,33,43,0.28), transparent)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(246,244,251,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(246,244,251,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <Particles />
      <NetworkLines />

      <AbsoluteFill className="flex items-end justify-center pb-20">
        <KineticWord />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
