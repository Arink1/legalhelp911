import ScalesIcon from "@/components/ScalesIcon";

/**
 * One of the twelve photography slots the handoff calls out. Until the firm
 * supplies real photography, this renders a labelled placeholder saying what
 * belongs there. Pass `src` and the slot becomes a real image with the
 * design system's washed treatment (desaturated, lower contrast).
 *
 * Photos to supply: lead attorney on location, office/team, three attorney
 * headshots, a client avatar, practice hero and process shots, office map.
 */
export default function PhotoSlot({
  label,
  src,
  className = "",
  rounded = "rounded-[14px]",
}: {
  label: string;
  src?: string;
  className?: string;
  rounded?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={label}
        className={`object-cover ${rounded} [filter:saturate(0.8)_contrast(0.92)] ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`Photo placeholder: ${label}`}
      className={`flex flex-col items-center justify-center gap-1.5 border-[1.5px] border-dashed border-muted/60 bg-ink/[0.03] px-3 text-center ${rounded} ${className}`}
    >
      <ScalesIcon className="h-6 w-6 text-brass/50" />
      <span className="kicker">{label}</span>
    </div>
  );
}
