"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

const PHOTOS = [
  { src: "/images/classroom/session-1.jpg", width: 1600, height: 1205, alt: "A full room at a live St.School session, mentor presenting at the front" },
  { src: "/images/classroom/session-2.jpg", width: 1600, height: 1205, alt: "Students seated in rows during a live St.School session" },
  { src: "/images/classroom/session-3.jpg", width: 1600, height: 1067, alt: "A mentor talking with students seated around a conference table" },
  { src: "/images/classroom/session-4.jpg", width: 1600, height: 1205, alt: "Students in a St.School classroom listening to a session" },
] as const;

export function ClassroomGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {PHOTOS.map((photo, i) => (
        <Reveal key={photo.src} delay={i * 0.06} className="overflow-hidden rounded-2xl border border-white/10">
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </Reveal>
      ))}
    </div>
  );
}
