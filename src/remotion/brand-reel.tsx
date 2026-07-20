import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// A bespoke, looping "product reel" built with Remotion — not a stock
// animation. It stages two panels (a Python/FastAPI code editor and a
// UI/UX design canvas) building themselves, then lands on the line that
// ties the two programs together. Runs entirely in DOM/CSS, no image
// assets, so it renders identically in the static export.

const CODE_LINES = [
  { text: "from fastapi import FastAPI", color: "var(--color-violet-light)" },
  { text: "app = FastAPI()", color: "var(--color-paper)" },
  { text: "", color: "var(--color-paper)" },
  { text: '@app.get("/cohort")', color: "var(--color-coral-light)" },
  { text: "def get_cohort():", color: "var(--color-violet-light)" },
  { text: '    return {"seats": 33}', color: "var(--color-paper)" },
];

const WindowChrome = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
    <span className="size-2.5 rounded-full bg-coral/70" />
    <span className="size-2.5 rounded-full bg-acid/70" />
    <span className="size-2.5 rounded-full bg-violet-light/70" />
    <span className="font-display ml-3 text-[13px] font-medium tracking-tight text-paper/50">
      {label}
    </span>
  </div>
);

function CodePanel() {
  const frame = useCurrentFrame();
  const cursorOn = Math.floor(frame / 15) % 2 === 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-elevated/90 shadow-2xl">
      <WindowChrome label="main.py" />
      <div className="flex-1 px-5 py-5 font-mono text-[15px] leading-[1.9]">
        {CODE_LINES.map((line, i) => {
          const start = 12 + i * 14;
          const progress = spring({
            frame: frame - start,
            fps: 30,
            config: { damping: 18, mass: 0.5 },
          });
          const isLast = i === CODE_LINES.length - 1;
          return (
            <div
              key={i}
              style={{
                opacity: progress,
                transform: `translateX(${interpolate(progress, [0, 1], [-14, 0])}px)`,
                color: line.color,
                whiteSpace: "pre",
              }}
            >
              {line.text || " "}
              {isLast && (
                <span style={{ opacity: cursorOn ? 1 : 0, color: "var(--color-acid)" }}>
                  {" "}
                  ▍
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DesignPanel() {
  const frame = useCurrentFrame();

  const rectProgress = spring({
    frame: frame - 15,
    fps: 30,
    config: { damping: 16, mass: 0.6 },
  });

  const cursorX = interpolate(frame, [15, 70], [8, 84], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [15, 70], [10, 62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorOpacity = interpolate(frame, [15, 22, 78, 92], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const swatches = ["var(--color-violet)", "var(--color-coral)", "var(--color-acid)"];

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-elevated/90 shadow-2xl">
      <WindowChrome label="home.fig" />
      <div className="relative flex-1 px-5 py-5">
        <div
          className="absolute rounded-xl border-2 border-dashed border-violet-light/60"
          style={{
            left: "8%",
            top: "10%",
            width: `${76 * rectProgress}%`,
            height: `${52 * rectProgress}%`,
            opacity: rectProgress,
          }}
        />

        {[0, 1, 2].map((i) => {
          const p = spring({
            frame: frame - (110 + i * 10),
            fps: 30,
            config: { damping: 12 },
          });
          return (
            <div
              key={i}
              className="absolute rounded-md"
              style={{
                left: `${12 + i * 24}%`,
                top: "68%",
                width: "18%",
                height: 10,
                background: "rgba(246,244,251,0.14)",
                transform: `scaleX(${p})`,
                transformOrigin: "left center",
              }}
            />
          );
        })}

        <div className="absolute bottom-5 left-5 flex gap-3">
          {swatches.map((color, i) => {
            const p = spring({
              frame: frame - (150 + i * 8),
              fps: 30,
              config: { damping: 10 },
            });
            return (
              <div
                key={color}
                className="size-7 rounded-full border border-white/20"
                style={{
                  background: color,
                  transform: `scale(${p})`,
                  opacity: p,
                }}
              />
            );
          })}
        </div>

        <div
          className="absolute size-4 rounded-full border-2 border-paper bg-coral shadow-[0_0_16px_rgba(255,91,61,0.8)]"
          style={{
            left: `${cursorX}%`,
            top: `${cursorY}%`,
            opacity: cursorOpacity,
          }}
        />
      </div>
    </div>
  );
}

function KineticLine({
  words,
  accentIndex,
  startFrame,
}: {
  words: string[];
  accentIndex: number;
  startFrame: number;
}) {
  const frame = useCurrentFrame();

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {words.map((word, i) => {
        const p = spring({
          frame: frame - (startFrame + i * 6),
          fps: 30,
          config: { damping: 14, mass: 0.6 },
        });
        return (
          <span
            key={i}
            className="font-display text-[2.6rem] font-medium tracking-tight sm:text-[3rem]"
            style={{
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [22, 0])}px)`,
              color: i === accentIndex ? "var(--color-coral)" : "var(--color-paper)",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

export function BrandReel() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const panelsIn = spring({ frame, fps: 30, config: { damping: 20 } });

  const bannerOpacity = interpolate(
    frame,
    [148, 168, durationInFrames - 20, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill className="bg-ink">
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,92,255,0.22), transparent)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(246,244,251,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(246,244,251,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <AbsoluteFill className="flex flex-col items-center justify-center gap-10 px-14 py-12">
        <div
          className="grid w-full grid-cols-2 gap-6"
          style={{
            opacity: panelsIn,
            transform: `translateY(${interpolate(panelsIn, [0, 1], [24, 0])}px)`,
            height: "62%",
          }}
        >
          <CodePanel />
          <DesignPanel />
        </div>

        <Sequence from={0} durationInFrames={durationInFrames} layout="none">
          <div style={{ opacity: bannerOpacity }}>
            <KineticLine
              words={["Two", "tracks.", "One", "outcome."]}
              accentIndex={3}
              startFrame={148}
            />
          </div>
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
