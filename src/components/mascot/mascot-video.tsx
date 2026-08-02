"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";

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
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const isInView = useInView(ref, { margin: "-10% 0px" });

  useEffect(() => {
    // The client's first render must match the server-rendered markup, so
    // this gate needs an immediate flip on mount rather than a deferred
    // subscription.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (isInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView]);

  // Until hydration completes, always render the poster image so the
  // client's first render matches the server-rendered HTML exactly.
  // `useReducedMotion()` resolves synchronously to a boolean on the
  // client's very first render but is `null` during server rendering, so
  // branching on it before hydration finishes would swap element types
  // (<video> vs <img>) and produce an unrecoverable hydration mismatch.
  if (!mounted || reduceMotion) {
    return <Image src={posterSrc} alt={alt} width={width} height={height} className={className} />;
  }

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
