import type { Course } from "@/data/content";
import { cn } from "@/lib/utils";
import { COLOR_THEME } from "./color-theme";

export function StackChips({
  stack,
  color,
  className,
}: {
  stack: string[];
  color: Course["color"];
  className?: string;
}) {
  const theme = COLOR_THEME[color];
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {stack.map((item) => (
        <span
          key={item}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-tight",
            theme.chipBorder,
            theme.chipBg,
            theme.chipText,
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
