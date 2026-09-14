"use client";

import { useId, useState } from "react";

export type AccordionItem = {
  title: string;
  body: React.ReactNode;
};

/**
 * Single-open accordion. First item open by default; clicking the open item
 * closes it. Closed panels stay in the DOM (`hidden`) so the copy is still
 * there for search engines and FAQ schema.
 *
 * `variant="circle"` is the FAQ treatment (32px ring with a 1.5px ink
 * border); `variant="bare"` is the practice accordion (bare glyph).
 */
export default function Accordion({
  items,
  variant = "bare",
  defaultOpen = 0,
  titleClassName,
}: {
  items: AccordionItem[];
  variant?: "bare" | "circle";
  defaultOpen?: number;
  titleClassName?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const base = useId();

  const titleCls =
    titleClassName ??
    (variant === "circle"
      ? "text-[17px] sm:text-[19px]"
      : "text-[16px] sm:text-[18px]");

  return (
    <div className="flex flex-col">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${base}-panel-${i}`;
        const buttonId = `${base}-button-${i}`;
        return (
          <div
            key={item.title}
            className={
              variant === "circle"
                ? "border-t border-hairline py-1"
                : "border-b border-hairline"
            }
          >
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={`flex min-h-[44px] w-full items-center justify-between gap-6 bg-transparent py-5 text-left font-medium leading-[1.3] tracking-[-0.01em] text-ink sm:py-6 ${titleCls}`}
              >
                <span>{item.title}</span>
                <span
                  aria-hidden="true"
                  className={
                    variant === "circle"
                      ? "grid h-8 w-8 flex-none place-items-center rounded-full text-[18px] leading-none shadow-[inset_0_0_0_1.5px_#141413]"
                      : "grid h-7 w-7 flex-none place-items-center text-[20px] leading-none"
                  }
                >
                  {isOpen ? "–" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={variant === "circle" ? "pb-7 pr-0 sm:pr-14" : "pb-6 pr-0 sm:pr-12"}
            >
              {item.body}
            </div>
          </div>
        );
      })}
      {variant === "circle" && <div className="border-t border-hairline" />}
    </div>
  );
}
