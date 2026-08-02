"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { assetBasePath } from "@/lib/base-path";

// Video output from image-to-video generation has no alpha channel, unlike
// the source WebP stills — this mask fades the video's rectangular edges
// into whatever sits behind it instead of showing a hard box edge. This
// used to be a CSS `radial-gradient()` computed live, but browsers don't
// dither computed gradients — over a fade this wide, on a dark background,
// that showed up as visible banded/pixelated-looking steps. A pre-rendered
// PNG alpha mask (public/images/mascot/edge-mask.png, generated with sharp
// — see scratch generation script in git history if it needs regenerating)
// bakes in dithering noise, and the browser's own upscaling from its small
// source size (232x288) adds further smoothing, so the fade reads as
// continuous instead of stepped. The opaque zone still stops at the same
// ~92%-of-half-extent boundary the old gradient used, so the character's
// own silhouette (hair crown, shoe soles near the top/bottom of the frame)
// stays fully opaque — only the empty background margin around them fades.
const EDGE_MASK = `url(${assetBasePath}/images/mascot/edge-mask.png)`;
const EDGE_MASK_STYLE = {
  maskImage: EDGE_MASK,
  WebkitMaskImage: EDGE_MASK,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
} as const;

export function MascotVideo({
  videoSrc,
  posterSrc,
  alt,
  width,
  height,
  className,
}: {
  videoSrc: string;
  posterSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { margin: "-10% 0px" });

  // The <video> element is always rendered — the server render, the
  // client's first (hydration) render, and every render after all produce
  // the same markup, so there's no element-type mismatch to hydrate
  // around. It also means `ref` is already attached to a real DOM node by
  // the time useInView's IntersectionObserver effect runs on mount (that
  // effect only fires once, so a ref that only shows up after a later
  // conditional swap would never get observed). Reduced motion is handled
  // purely by never calling .play(): a <video poster> shows that static
  // frame until playback starts, so a user who never gets a .play() call
  // sees exactly the still image, with no separate <Image> branch needed.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (isInView && !reduceMotion) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView, reduceMotion]);

  return (
    <>
      <video
        ref={ref}
        src={videoSrc}
        poster={posterSrc}
        width={width}
        height={height}
        className={className}
        style={EDGE_MASK_STYLE}
        preload="none"
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      {alt ? <span className="sr-only">{alt}</span> : null}
    </>
  );
}
