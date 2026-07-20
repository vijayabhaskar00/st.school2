import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  withArrow?: boolean;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  withArrow = true,
  external = false,
}: ButtonProps) {
  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet";

  const variants = {
    primary:
      "bg-paper text-ink hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(246,244,251,0.2),0_12px_30px_-8px_rgba(124,92,255,0.55)]",
    secondary:
      "bg-transparent text-paper ring-1 ring-inset ring-white/20 hover:ring-white/40 hover:-translate-y-0.5",
    ghost: "bg-transparent text-paper/80 hover:text-paper px-2 py-1",
  };

  return (
    <Link
      href={href}
      className={cn(base, variants[variant], className)}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      <span>{children}</span>
      {withArrow && (
        <ArrowUpRight
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2.5}
        />
      )}
    </Link>
  );
}
