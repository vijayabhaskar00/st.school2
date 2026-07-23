"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Word = { text: string; highlight?: boolean };

// The hero pull-quote used to fade in as one block, like every other
// heading on the site. As the page's opening line it earns a heavier
// entrance: each word masks up from below on its own stagger, so the
// quote reads like it's being said rather than just appearing. The space
// between words is a plain sibling text node deliberately left outside the
// overflow-hidden wrapper — nested inside it, the browser would treat each
// wrapper as one unbreakable inline-block box with nowhere to wrap a line.
export function StaggerHeadline({
  words,
  className,
}: {
  words: Word[];
  className?: string;
}) {
  return (
    <h1 className={cn(className)}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-1 align-bottom">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 0.65,
                delay: 0.1 + i * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn("inline-block", word.highlight && "text-gradient")}
            >
              {word.text}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </h1>
  );
}
