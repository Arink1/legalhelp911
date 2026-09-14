import type { CSSProperties } from "react";

/**
 * The scales mark from the supplied logo, cut into five layers so the
 * crossbar and both trays can tip while the post and base stay planted
 * (the "Scales balancing" concept from the logo animation handoff).
 *
 * The cuts are measured off the artwork and fall in empty space, so the
 * layers read as one solid mark. Size it with a width class; the height
 * follows the artwork's aspect ratio. `tone` recolors the navy artwork for
 * ink or white surfaces. The loop pauses under prefers-reduced-motion.
 */
export default function ScalesMark({
  className = "",
  tone = "brand",
  live = true,
  tip,
  speed,
  style,
}: {
  className?: string;
  tone?: "brand" | "ink" | "white";
  /** Run the balancing loop. */
  live?: boolean;
  /** Tip angle in degrees (default 7). */
  tip?: number;
  /** Loop length in seconds (default 7). */
  speed?: number;
  style?: CSSProperties;
}) {
  const cls = [
    "mark",
    live && "mark-live",
    tone === "white" && "mark-white",
    tone === "ink" && "mark-ink",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const vars = {
    ...(tip !== undefined ? { "--tip": `${tip}deg` } : {}),
    ...(speed !== undefined ? { "--weigh": `${speed}s` } : {}),
    ...style,
  } as CSSProperties;

  return (
    <span className={cls} style={vars} aria-hidden="true">
      {/* static: post shaft, base */}
      <i style={{ clipPath: "inset(23.4% 38.6% 17.5% 38.3%)" }} />
      <i style={{ clipPath: "inset(82.5% 22.9% 0 22.6%)" }} />
      {/* moving as one rigid arm: crossbar + finial, left tray, right tray */}
      <i className="arm" style={{ clipPath: "inset(0 0 76.6% 0)" }} />
      <i className="arm" style={{ clipPath: "inset(23.4% 61.7% 17.5% 0)" }} />
      <i className="arm" style={{ clipPath: "inset(23.4% 0 17.5% 61.4%)" }} />
    </span>
  );
}
