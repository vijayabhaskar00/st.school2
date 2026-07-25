"use client";

import { Player } from "@remotion/player";
import {
  DesignSystemBuild,
  DESIGN_SYSTEM_BUILD_CYCLE,
} from "@/remotion/design-system-build";
import { cn } from "@/lib/utils";

export function DesignSystemBuildPlayer({
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
        component={DesignSystemBuild}
        // Exactly one internal cycle — anything that isn't a whole multiple of
        // the composition's cycle length cuts the loop mid-transition.
        durationInFrames={DESIGN_SYSTEM_BUILD_CYCLE}
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
