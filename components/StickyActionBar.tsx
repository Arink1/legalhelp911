import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

/**
 * The sticky brass call bar from the mobile handoff: one tap-to-call
 * button pinned above the home indicator on every scrolling screen, phones
 * and tablets only. Desktop already has the phone and "Free case review"
 * in the nav.
 */
export default function StickyActionBar({
  labels = { call: "Call" },
}: {
  labels?: { call: string; text?: string; form?: string };
}) {
  return (
    <div className="lg:hidden">
      {/* Spacer in normal flow so the fixed bar never covers the footer. */}
      <div aria-hidden="true" className="h-[92px]" />
      <a
        href={PHONE_TEL}
        data-analytics="call_tap_sticky"
        className="btn btn-primary fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-50 shadow-callbar"
      >
        {labels.call} {PHONE_DISPLAY}
      </a>
    </div>
  );
}
