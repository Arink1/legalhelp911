import ScalesMark from "@/components/ScalesMark";
import { SITE_NAME } from "@/lib/site";

/**
 * The full legalhelp911 lockup, rebuilt from the supplied artwork as three
 * pieces (animated mark, navy wordmark, red 911) with the original spacing.
 * Set the height with a font-size class: every piece is sized in em.
 */
export default function LogoLockup({
  className = "",
  live = true,
  label = SITE_NAME,
}: {
  className?: string;
  live?: boolean;
  label?: string;
}) {
  return (
    <span
      className={`lockup ${className}`}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <ScalesMark live={live} className="lockup-mark" tip={5} speed={8} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/logo-word.webp"
        alt=""
        width={1160}
        height={573}
        className="lockup-word"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/logo-911.webp"
        alt=""
        width={340}
        height={573}
        className="lockup-911"
      />
    </span>
  );
}
