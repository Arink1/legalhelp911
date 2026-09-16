import type { CSSProperties } from "react";

/**
 * The Oak & Brass scales mark, sliced into five clip-path layers so the top
 * beam and both pans can tip as one rigid group while the pivot block and
 * plinth stay planted (the "weigh and settle" loop from the brand guide).
 *
 * Size it with a width class; the height follows the 46:44 mark box. `tone`
 * picks the Oak artwork for light grounds or the Brass artwork for walnut.
 * The loop pauses under prefers-reduced-motion. Legacy tones from the
 * previous system ("brand", "ink", "white") still resolve.
 */
export default function ScalesMark({
  className = "",
  tone = "oak",
  live = true,
  speed,
  style,
}: {
  className?: string;
  tone?: "oak" | "brass" | "brand" | "ink" | "white";
  /** Run the weigh-and-settle loop. */
  live?: boolean;
  /** Loop length in seconds (default 9). */
  speed?: number;
  /** Accepted for older call sites; the guide fixes the tip at 7 degrees. */
  tip?: number;
  style?: CSSProperties;
}) {
  const brass = tone === "brass" || tone === "white";
  const cls = ["mark", live && "mark-live", brass && "mark-brass", className]
    .filter(Boolean)
    .join(" ");
  const vars = {
    ...(speed !== undefined ? { "--weigh": `${speed}s` } : {}),
    ...style,
  } as CSSProperties;

  return (
    <span className={cls} style={vars} aria-hidden="true">
      <span>
        {/* static: pivot block, plinth */}
        <i style={{ clipPath: "inset(26.606% 39.276% 29.949% 42.636%)" }} />
        <i style={{ clipPath: "inset(70.051% 27.003% 0 30.362%)" }} />
        {/* moving as one rigid group: top beam, left pan, right pan */}
        <i className="arm" style={{ clipPath: "inset(0 0 73.394% 0)" }} />
        <i className="arm" style={{ clipPath: "inset(26.606% 57.364% 29.949% 0)" }} />
        <i className="arm" style={{ clipPath: "inset(26.606% 0 29.949% 60.724%)" }} />
      </span>
    </span>
  );
}
