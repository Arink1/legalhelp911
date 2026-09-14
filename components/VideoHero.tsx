"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Basename in /public/media, without extension. */
  clip: string;
  /** Scrim style. "bottom" = 2a mobile home, "flat" = 2c hero band. */
  scrim?: "bottom" | "flat";
  className?: string;
  children: React.ReactNode;
};

/**
 * Background-video hero from the 2a/2c wireframes.
 *
 * The poster still is the LCP element: it renders in the markup immediately
 * and the video is only mounted afterwards, and only when it is appropriate
 * to spend the bytes. These cases get the poster and no video fetch at all:
 *   - prefers-reduced-motion: reduce
 *   - Save-Data enabled, or a slow-2g/2g effective connection
 *   - any decode or load failure
 * Phones play the clip too: it is small, muted, and inline.
 */
export default function VideoHero({
  clip,
  scrim = "bottom",
  className = "",
  children,
}: Props) {
  const [playVideo, setPlayVideo] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // navigator.connection is not in every browser's typings
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const thinPipe =
      Boolean(conn?.saveData) ||
      ["slow-2g", "2g"].includes(conn?.effectiveType ?? "");

    if (reducedMotion || thinPipe) return;
    setPlayVideo(true);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    // Some browsers reject autoplay even when muted; fall back to the poster
    // rather than leaving a frozen first frame.
    const attempt = el.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => setFailed(true));
    }
  }, [playVideo]);

  const scrimClass =
    scrim === "bottom"
      ? "bg-[linear-gradient(to_top,rgba(20,18,16,0.92)_0%,rgba(20,18,16,0.78)_55%,rgba(20,18,16,0)_100%)]"
      : "bg-[rgba(20,18,16,0.55)]";

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      {/* Poster: always present, paints first, and is the LCP image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/media/${clip}.webp`}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />

      {playVideo && !failed && (
        <video
          ref={videoRef}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          poster={`/media/${clip}.webp`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setFailed(true)}
        >
          <source src={`/media/${clip}.webm`} type="video/webm" />
          <source src={`/media/${clip}.mp4`} type="video/mp4" />
        </video>
      )}

      {/* Scrim so text never sits on raw footage */}
      <div aria-hidden="true" className={`absolute inset-0 -z-[5] ${scrimClass}`} />

      {children}
    </div>
  );
}
