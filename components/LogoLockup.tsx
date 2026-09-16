import ScalesMark from "@/components/ScalesMark";
import { SITE_NAME } from "@/lib/site";

/**
 * The LegalHelp911.com lockup: animated scales mark plus the typeset
 * wordmark (Libre Baskerville 700, "911" in Seal Red). Set the height with
 * a font-size class; the mark is sized in em off the same value.
 * `tone="dark"` swaps to the Brass mark and parchment type for walnut.
 */
export default function LogoLockup({
  className = "",
  live = true,
  label = SITE_NAME,
  tone = "light",
  mark = true,
}: {
  className?: string;
  live?: boolean;
  label?: string;
  tone?: "light" | "dark";
  mark?: boolean;
}) {
  return (
    <span
      className={`lockup ${tone === "dark" ? "lockup-dark" : ""} ${className}`}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      {mark && (
        <ScalesMark
          live={live}
          tone={tone === "dark" ? "brass" : "oak"}
          className="lockup-mark"
        />
      )}
      <span className="lockup-word">
        LegalHelp<span className="lockup-911">911</span>.com
      </span>
    </span>
  );
}
