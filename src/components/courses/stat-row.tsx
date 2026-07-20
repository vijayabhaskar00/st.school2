import { Clock, Laptop, GraduationCap } from "lucide-react";
import type { Course } from "@/data/content";
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
    { icon: Clock, label: "Duration", value: course.duration },
    { icon: Laptop, label: "Mode", value: course.mode },
    { icon: GraduationCap, label: "Level", value: course.level },
  ];

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", theme.bgSoft)}>
            <Icon className={cn("size-4", theme.solidText)} strokeWidth={2.25} />
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
