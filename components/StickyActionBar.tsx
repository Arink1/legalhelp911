import Link from "next/link";
import { PhoneIcon, MessageIcon, MailIcon } from "@/components/Icons";
import { PHONE_TEL, SMS_LINK } from "@/lib/site";

/**
 * Fixed Call / Text / Form bar from wireframe 1a. Call is weighted wider
 * (flex 1.6 vs 1) because a tap-to-call is the primary conversion, and the
 * bar never scrolls away. Pages that render it must also add bottom padding
 * so their last section is not covered: use the `pb-sticky` utility.
 */
export default function StickyActionBar({
  labels = { call: "Call", text: "Text", form: "Form" },
}: {
  labels?: { call: string; text: string; form: string };
}) {
  return (
    <>
      {/* Spacer in normal flow so the fixed bar never covers the footer.
          Lives here rather than on each page so it can't be forgotten. */}
      <div aria-hidden="true" className="h-[72px]" />
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/15 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="mx-auto flex max-w-2xl gap-2 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5">
        <a
          href={PHONE_TEL}
          data-analytics="call_tap_sticky"
          className="flex min-h-[46px] flex-[1.6] items-center justify-center gap-2 rounded-full bg-signal px-4 text-[15px] font-extrabold text-white transition hover:bg-signal-dark"
        >
          <PhoneIcon className="h-4 w-4" />
          {labels.call}
        </a>
        <a
          href={SMS_LINK}
          data-analytics="text_tap_sticky"
          className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full border-[1.75px] border-ink px-4 text-[15px] font-extrabold text-ink transition hover:bg-ink hover:text-white"
        >
          <MessageIcon className="h-4 w-4" />
          {labels.text}
        </a>
        <Link
          href="/contact"
          className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full border-[1.75px] border-ink px-4 text-[15px] font-extrabold text-ink transition hover:bg-ink hover:text-white"
        >
          <MailIcon className="h-4 w-4" />
          {labels.form}
        </Link>
        </div>
      </div>
    </>
  );
}
