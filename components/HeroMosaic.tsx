// Two photo columns drifting in opposite directions, forever.
//
// Each column's set is rendered twice and the column translates by exactly
// one set length (plus half the gap), so the loop has no visible seam. The
// keyframes, durations, and gap live in globals.css under `.mosaic`;
// `prefers-reduced-motion` stops it there too.

type Tile = { src: string; h: number; hm: number };

// Desktop heights come from the handoff (600px frame, 16px gap); mobile
// heights scale the same rhythm into a 230px frame with a 10px gap.
const LEFT: Tile[] = [
  { src: "/media/hero-1.webp", h: 240, hm: 140 },
  { src: "/media/hero-3.webp", h: 300, hm: 190 },
  { src: "/media/hero-5.webp", h: 220, hm: 130 },
];
const RIGHT: Tile[] = [
  { src: "/media/hero-2.webp", h: 280, hm: 180 },
  { src: "/media/hero-4.webp", h: 220, hm: 150 },
  { src: "/media/hero-courthouse.webp", h: 260, hm: 160 },
];

function Column({ tiles, dir }: { tiles: Tile[]; dir: "up" | "down" }) {
  const set = [...tiles, ...tiles];
  return (
    <div
      className={`mosaic-col flex min-w-0 flex-col gap-2.5 md:gap-4 ${
        dir === "up" ? "mosaic-up" : "mosaic-down"
      }`}
    >
      {set.map((t, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${t.src}-${i}`}
          src={t.src}
          alt=""
          aria-hidden="true"
          loading={i < tiles.length ? "eager" : "lazy"}
          decoding="async"
          style={
            {
              "--h": `${t.h}px`,
              "--hm": `${t.hm}px`,
            } as React.CSSProperties
          }
          className="block h-[var(--hm)] w-full flex-none rounded-[2px] object-cover md:h-[var(--h)]"
        />
      ))}
    </div>
  );
}

export default function HeroMosaic() {
  return (
    <div
      aria-hidden="true"
      className="mosaic grid h-[230px] min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2.5 overflow-hidden md:h-[600px] md:gap-4 md:p-4"
    >
      <Column tiles={LEFT} dir="up" />
      <Column tiles={RIGHT} dir="down" />
    </div>
  );
}
