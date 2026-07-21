"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.15, rotate: -10 },
};

// Icons are selected from a key rather than accepted as a component prop —
// this component is Client and the contact page that renders it is a
// Server Component, and passing a component reference (a function) across
// that boundary isn't serializable.
const ICONS = { mail: Mail, phone: Phone, "map-pin": MapPin } as const;
type IconKey = keyof typeof ICONS;

// One row of the "reach us directly" directory. Wraps the icon in a
// Framer Motion variant that reacts to the row itself being hovered
// (whileHover="hover" on the row propagates to the icon's matching
// variants), while the value text keeps its existing CSS group-hover
// color transition untouched.
export function ContactMethodRow({
  href,
  icon,
  iconClassName,
  label,
  value,
  valueHoverClassName,
}: {
  href?: string;
  icon: IconKey;
  iconClassName: string;
  label: string;
  value: string;
  valueHoverClassName?: string;
}) {
  const Icon = ICONS[icon];
  const content = (
    <>
      <motion.span
        variants={iconVariants}
        transition={{ type: "spring", stiffness: 380, damping: 14 }}
        className="inline-flex shrink-0"
      >
        <Icon className={cn("size-4", iconClassName)} strokeWidth={2.25} />
      </motion.span>
      <span className="flex flex-col">
        <span className="text-[0.65rem] uppercase tracking-[0.14em] text-muted-soft">{label}</span>
        <span
          className={cn(
            "font-display text-base font-medium text-paper transition-colors sm:text-lg",
            valueHoverClassName,
          )}
        >
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        initial="rest"
        whileHover="hover"
        className="group flex items-center gap-4 py-4 transition-colors"
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div initial="rest" whileHover="hover" className="flex items-center gap-4 py-4">
      {content}
    </motion.div>
  );
}
