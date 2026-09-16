"use client";

/**
 * The jump row under the practice-areas header: numeral plus title for
 * each entry, smooth-scrolling to it with the sticky nav's height taken
 * off. Scrolls horizontally on phones, wraps on wider screens.
 */
export default function PracticeJumpRow({
  items,
}: {
  items: { id: string; num: string; title: string }[];
}) {
  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector("header");
    const navH = header ? header.getBoundingClientRect().height : 90;
    const y = el.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <div className="border-b border-linen bg-parchment">
      <div className="strip mx-auto max-w-[1280px] items-center gap-x-1 px-3 py-1.5 sm:px-6 md:flex-wrap md:overflow-visible">
        {items.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => jump(i.id)}
            className="inline-flex min-h-[44px] items-center gap-2.5 px-3.5 py-4 text-[13px] font-bold uppercase leading-[1.2] tracking-[0.12em] text-walnut hover:text-oak"
          >
            <span className="font-display text-[13px] font-bold leading-none text-oak">
              {i.num}
            </span>
            {i.title}
          </button>
        ))}
      </div>
    </div>
  );
}
