"use client";

import { Player } from "@remotion/player";
import { BrandReel } from "@/remotion/brand-reel";
import { cn } from "@/lib/utils";

export function BrandReelPlayer({
  className,
  autoPlay = true,
  initialFrame,
}: {
  className?: string;
  autoPlay?: boolean;
  initialFrame?: number;
}) {
  return (
    <div className={cn("aspect-[8/5] w-full", className)} aria-hidden="true">
      <Player
        component={BrandReel}
        durationInFrames={240}
        fps={30}
        compositionWidth={1200}
        compositionHeight={750}
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
