"use client";

import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";

// Video output from image-to-video generation has no alpha channel, unlike
// the source WebP stills — this mask fades the video's rectangular edges
// into whatever sits behind it instead of showing a hard box edge.
const EDGE_MASK = "radial-gradient(closest-side, black 78%, transparent 100%)";

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

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (isInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView]);

  if (reduceMotion) {
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
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <span className="sr-only">{alt}</span>
    </>
  );
}
