"use client";

import { Player } from "@remotion/player";
import { NeuralPulse } from "@/remotion/neural-pulse";
import { cn } from "@/lib/utils";

export function NeuralPulsePlayer({
  className,
  autoPlay = true,
  initialFrame,
}: {
  className?: string;
  autoPlay?: boolean;
  initialFrame?: number;
}) {
  return (
    <div className={cn("aspect-square w-full", className)}>
      <Player
        component={NeuralPulse}
        durationInFrames={180}
        fps={30}
        compositionWidth={800}
        compositionHeight={800}
        style={{ width: "100%", height: "100%" }}
        loop
        autoPlay={autoPlay}
        initialFrame={initialFrame}
        initiallyMuted
        clickToPlay={false}
        showPosterWhenPaused={false}
        controls={false}
      />
    </div>
  );
}
