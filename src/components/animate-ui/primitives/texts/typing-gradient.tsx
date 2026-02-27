"use client";

import { motion, useAnimate } from "motion/react";
import * as React from "react";

type TypingGradientTextProps = Omit<React.ComponentProps<"span">, "children"> & {
  text: string;
  gradient?: string;
  neon?: boolean;
  typingDuration?: number;
  typingDelay?: number;
  gradientCycleDuration?: number;
  gradientCycleDelay?: number;
};

function TypingGradientText({
  text,
  style,
  gradient = "linear-gradient(90deg, #3b82f6 0%, #a855f7 20%, #ec4899 50%, #a855f7 80%, #3b82f6 100%)",
  neon = false,
  typingDuration = 100,
  typingDelay = 0,
  gradientCycleDuration = 2,
  gradientCycleDelay = 10,
  ...props
}: TypingGradientTextProps) {
  const [displayedText, setDisplayedText] = React.useState("");
  const [isComplete, setIsComplete] = React.useState(false);
  const [scope, animate] = useAnimate();
  const [scopeNeon, animateNeon] = useAnimate();

  React.useEffect(() => {
    const timeoutIds: Array<ReturnType<typeof setTimeout>> = [];

    // Wait for initial delay
    const initialTimeout = setTimeout(() => {
      let currentIndex = 0;

      const type = () => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.substring(0, currentIndex));
          currentIndex++;
          const id = setTimeout(type, typingDuration);
          timeoutIds.push(id);
        } else {
          setIsComplete(true);
        }
      };

      type();
    }, typingDelay);

    timeoutIds.push(initialTimeout);

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [text, typingDuration, typingDelay]);

  React.useEffect(() => {
    if (!isComplete) return;

    let cancelled = false;

    const runGradientCycle = async () => {
      while (!cancelled) {
        // Wait before cycle (delay first)
        await new Promise(resolve => setTimeout(resolve, gradientCycleDelay * 1000));

        if (cancelled) break;

        // Animate gradient (shine effect sweeping from left to right)
        // Custom cubic-bezier for more pronounced easing: slow start -> fast end
        await animate(
          scope.current,
          { backgroundPosition: "-200% 0%" },
          { duration: gradientCycleDuration, ease: [0.2, 1, 0, 1] }
        );

        // Reset position instantly (back to start)
        await animate(scope.current, { backgroundPosition: "0% 0%" }, { duration: 0 });
      }
    };

    const runNeonCycle = async () => {
      while (!cancelled) {
        // Wait before cycle (delay first)
        await new Promise(resolve => setTimeout(resolve, gradientCycleDelay * 1000));

        if (cancelled) break;

        // Animate neon gradient (shine effect sweeping from left to right)
        // Custom cubic-bezier for more pronounced easing: slow start -> fast end
        await animateNeon(
          scopeNeon.current,
          { backgroundPosition: "-200% 0%" },
          { duration: gradientCycleDuration, ease: [0.2, 1, 0, 1] }
        );

        // Reset position instantly (back to start)
        await animateNeon(scopeNeon.current, { backgroundPosition: "0% 0%" }, { duration: 0 });
      }
    };

    runGradientCycle();
    if (neon) {
      runNeonCycle();
    }

    return () => {
      cancelled = true;
    };
  }, [
    isComplete,
    animate,
    animateNeon,
    gradientCycleDuration,
    gradientCycleDelay,
    neon,
    scope,
    scopeNeon,
  ]);

  const baseStyle: React.CSSProperties = {
    backgroundImage: gradient,
    margin: 0,
    color: "transparent",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    backgroundSize: "200% 100%",
    backgroundPosition: "0% 0%",
    display: "inline",
  };

  return (
    <span
      data-slot="typing-gradient-text"
      style={{ position: "relative", display: "inline-block", ...style }}
      {...props}
    >
      <motion.span ref={scope} style={baseStyle}>
        {displayedText}
      </motion.span>

      {neon && isComplete && (
        <motion.span
          ref={scopeNeon}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            mixBlendMode: "plus-lighter",
            filter: "blur(8px)",
            ...baseStyle,
          }}
        >
          {displayedText}
        </motion.span>
      )}
    </span>
  );
}

export { TypingGradientText, type TypingGradientTextProps };
