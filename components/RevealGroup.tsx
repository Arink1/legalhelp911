"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Adds `is-in` once its children scroll into view, which starts the staggered
 * card reveal defined in globals.css.
 *
 * Fires once and then stops observing: a row that keeps pulsing is noise, and
 * on a page where someone is deciding whether to trust a law firm, noise reads
 * as cheap. Reduced-motion users get the finished state immediately, handled
 * in CSS so there is no flash of hidden content.
 */
export default function RevealGroup({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    // No IntersectionObserver (or reduced motion): just show it.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLUListElement>}
      className={`${className} ${shown ? "is-in" : ""}`}
    >
      {children}
    </Tag>
  );
}
