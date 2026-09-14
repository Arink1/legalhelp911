import Link from "next/link";

type Step = {
  eyebrow: string;
  title: string;
  caption: string;
  src: string;
  cta: string;
  href: string;
  /** Desktop stagger. Margin, not transform: it has to affect layout so a
   *  wrapped third item never rides up over the second item's caption. */
  offset: string;
};

const STEPS: Step[] = [
  {
    eyebrow: "Step one",
    title: "Tell us what you are facing",
    caption:
      "The charge, the filing, the crash, or the contract, plus any date you have been given.",
    src: "/media/step-1.webp",
    cta: "Start now",
    href: "/contact",
    offset: "md:mt-0",
  },
  {
    eyebrow: "Step two",
    title: "We review the paperwork, free",
    caption:
      "Bring whatever you were handed, even if it is only a citation or a notice.",
    src: "/media/step-2.webp",
    cta: "See practice areas",
    href: "/practice",
    offset: "md:mt-[110px]",
  },
  {
    eyebrow: "Step three",
    title: "You get the realistic options",
    caption:
      "Likely outcomes, the timeline, and how the work is priced, in writing.",
    src: "/media/step-3.webp",
    cta: "Meet the attorneys",
    href: "/attorneys",
    offset: "md:mt-[30px]",
  },
];

/**
 * "First steps": three circular portraits, staggered, each with a white
 * satellite CTA docked on its lower-right perimeter. A ghost headline and a
 * thin orange orbital arc sit behind them. On phones it collapses to a
 * plain list of 96px circles.
 */
export default function StepPortraits() {
  return (
    <section className="relative px-6 py-16 md:py-24">
      {/* Ghost headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-5 top-10 hidden select-none whitespace-nowrap text-[120px] font-medium leading-none tracking-[-0.03em] text-[#e6e1dd] md:block"
      >
        First steps
      </div>
      {/* Orbital arc */}
      <svg
        aria-hidden="true"
        viewBox="0 0 620 240"
        width="620"
        height="240"
        className="pointer-events-none absolute left-[12%] top-[230px] hidden md:block"
        fill="none"
      >
        <path
          d="M10 230 C 120 40, 500 40, 610 230"
          stroke="#f37338"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      <p className="eyebrow md:hidden">First steps</p>

      <ol className="relative mx-auto mt-5 flex max-w-[1280px] flex-col gap-6 md:mt-0 md:flex-row md:flex-wrap md:justify-center md:gap-x-[72px] md:gap-y-16 md:pt-[140px]">
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            className={`flex items-center gap-4 md:block md:w-[280px] md:self-start ${s.offset}`}
          >
            <div className="relative h-24 w-24 flex-none md:h-[280px] md:w-[280px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt=""
                width={800}
                height={800}
                loading="lazy"
                decoding="async"
                className="block h-full w-full rounded-full object-cover"
              />
              <Link
                href={s.href}
                className="absolute -right-2 bottom-2 hidden min-h-[56px] items-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-ink shadow-card transition-colors hover:bg-canvas hover:text-ink hover:no-underline md:inline-flex"
              >
                {s.cta}
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
            <div className="min-w-0 md:mt-7">
              <p className="hidden text-[13px] font-bold uppercase tracking-[0.04em] text-muted md:block">
                {s.eyebrow}
              </p>
              <h3 className="mt-0 text-[17px] font-medium leading-[1.2] tracking-[-0.01em] md:mt-3 md:text-[22px]">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <p className="mt-1 text-[14px] leading-[1.45] text-muted md:mt-3 md:text-[15px]">
                {s.caption}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
