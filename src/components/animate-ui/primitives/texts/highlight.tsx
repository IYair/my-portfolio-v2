"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import * as React from "react";

import { useIsInView, type UseIsInViewOptions } from "@/hooks/use-is-in-view";

type HighlightTextProps = Omit<HTMLMotionProps<"span">, "children"> & {
  text: string;
  delay?: number;
  blur?: boolean;
  blurAmount?: number;
  glass?: boolean;
} & UseIsInViewOptions;

function HighlightText({
  ref,
  text,
  style,
  inView = false,
  inViewMargin = "0px",
  inViewOnce = true,
  transition = { duration: 2, ease: "easeInOut" },
  delay = 0,
  blur = false,
  blurAmount = 8,
  glass = false,
  ...props
}: HighlightTextProps) {
  const { ref: localRef, isInView } = useIsInView(ref as React.Ref<HTMLElement>, {
    inView,
    inViewOnce,
    inViewMargin,
  });

  return (
    <span
      ref={localRef}
      data-slot="highlight-text-wrapper"
      style={{ position: "relative", display: "inline-block" }}
    >
      {/* Blur layer behind text */}
      {blur && (
        <motion.span
          data-slot="highlight-text-blur"
          initial={{ backgroundSize: "0% 100%" }}
          animate={isInView ? { backgroundSize: "100% 100%" } : undefined}
          transition={{
            ...transition,
            delay: (transition?.delay ?? 0) + delay / 1000,
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
            filter: `blur(${blurAmount}px)`,
            zIndex: -1,
            ...style,
          }}
          aria-hidden="true"
        />
      )}
      {/* Main text with highlight */}
      <motion.span
        data-slot="highlight-text"
        initial={{ backgroundSize: "0% 100%" }}
        animate={isInView ? { backgroundSize: "100% 100%" } : undefined}
        transition={{
          ...transition,
          delay: (transition?.delay ?? 0) + delay / 1000,
        }}
        style={{
          position: "relative",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left center",
          display: "inline-block",
          objectFit: "contain",
          ...(glass && {
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "13px",
            padding: "2px 4px",
          }),
          ...style,
        }}
        {...props}
      >
        {text}
      </motion.span>
    </span>
  );
}

export { HighlightText, type HighlightTextProps };
