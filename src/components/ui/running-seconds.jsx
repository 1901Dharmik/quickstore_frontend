"use client";

import { motion } from "framer-motion";

/**
 * RunningSeconds
 * A small ticking sub-dial — the page's signature motif. A watch's defining
 * trait is that it never stops moving; this repeats that idea in miniature
 * wherever it appears (header mark, hero, footer) instead of a static logo.
 * Pure , no color — motion carries the distinction instead.
 */
export function RunningSeconds({ size = 20, label, className = "" }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="relative inline-block shrink-0 rounded-full border border-current"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <motion.span
          className="absolute left-1/2 top-1/2 block h-[38%] w-px origin-bottom bg-current"
          style={{ marginLeft: -0.5, marginTop: `-38%` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
      </span>
      {label ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
          {label}
        </span>
      ) : null}
    </div>
  );
}
