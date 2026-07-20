import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/brand/logo-mark";

export function Logo({
  className,
  markClassName,
  textClassName,
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-9 w-auto shrink-0", markClassName)} />
      <span className={cn("font-display text-xl font-bold tracking-tight", textClassName)}>
        <span className="text-brand-red">st.</span>{" "}
        <span className="text-paper">School</span>
      </span>
    </span>
  );
}
