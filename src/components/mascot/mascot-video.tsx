"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Video output from image-to-video generation has no alpha channel, unlike
// the source WebP stills — this mask fades the video's rectangular edges
// into whatever sits behind it instead of showing a hard box edge. The stop
// is set high (92%) so the character's own silhouette (hair crown, shoe
// soles near the top/bottom of the frame) stays fully opaque — only the
// empty background margin around them fades. `closest-side` with no
// explicit shape defaults to an ellipse inscribed in the box, so on this
// component's ~4:5 portrait aspect ratio the vertical radius is shorter
// than the number alone suggests; keep this in mind if the source art
// changes and the fade needs re-tuning.
const EDGE_MASK = "radial-gradient(closest-side, black 92%, transparent 100%)";

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
        style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
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
