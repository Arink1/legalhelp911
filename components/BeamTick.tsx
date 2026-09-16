/**
 * The beam tick from the brand guide: a short rule with a centre fulcrum,
 * ranked below the full scales mark. Sits before eyebrows (19x9) and as a
 * list bullet (16x7). Draws in currentColor: Oak on light, Brass on walnut.
 */
export default function BeamTick({
  className = "h-[9px] w-[19px]",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 28 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      aria-hidden="true"
      className={`block shrink-0 ${className}`}
    >
      <path d="M2 6L26 6" />
      <path d="M14 2L14 6" />
      <circle cx="14" cy="6" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
