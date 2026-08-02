import Image from "next/image";
import type { Course } from "@/data/content";
import { assetBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import { COLOR_THEME } from "./color-theme";

export function CourseStatRow({
  course,
  className,
}: {
  course: Pick<Course, "duration" | "mode" | "level" | "color">;
  className?: string;
}) {
  const theme = COLOR_THEME[course.color];
  const stats = [
    { icon: `${assetBasePath}/images/icons/duration.webp`, label: "Duration", value: course.duration },
    { icon: `${assetBasePath}/images/icons/mode.webp`, label: "Mode", value: course.mode },
    { icon: `${assetBasePath}/images/icons/level.webp`, label: "Level", value: course.level },
  ];

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {stats.map(({ icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-full", theme.bgSoft)}>
            <Image src={icon} alt="" width={56} height={56} className="size-10 object-contain" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-soft">
              {label}
            </span>
            <span className="text-sm font-medium text-paper/90">{value}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
