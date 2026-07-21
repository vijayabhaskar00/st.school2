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
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark className={cn("h-11 w-auto shrink-0", markClassName)} />
      <span className={cn("font-display flex flex-col leading-[0.95]", textClassName)}>
        <span className="text-lg font-bold tracking-tight text-brand-red">st.</span>
        <span className="text-lg font-bold tracking-tight text-paper">School</span>
      </span>
    </span>
  );
}
