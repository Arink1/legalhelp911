"use client";

import { useEffect, useState } from "react";
import LogoLockup from "@/components/LogoLockup";

const KEY = "lh911.intro";

/**
 * Concept A, "Balance", from the logo animation handoff: the scale drops in
 * and rocks into true balance, the wordmark wipes in along a baseline, and
 * 911 stamps in red with two pulse rings. Plays once per browser session,
 * never under prefers-reduced-motion, and a click dismisses it early.
 */
export default function LogoIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      sessionStorage.setItem(KEY, "1");
    } catch {
      return;
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), 3700);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="intro" aria-hidden="true" onClick={() => setShow(false)}>
      <div className="intro-stage">
        <LogoLockup className="intro-lockup" live={false} label="" />
        <span className="intro-ring" />
        <span className="intro-ring intro-ring-2" />
        <span className="intro-line" />
      </div>
    </div>
  );
}
