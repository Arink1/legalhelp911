import Link from "next/link";
import { PhoneIcon, MessageIcon, MailIcon } from "@/components/Icons";
import { PHONE_TEL, SMS_LINK } from "@/lib/site";

/**
 * Fixed Call / Text / Form bar, phones only. Desktop already has the phone
 * and the "Free case review" button pinned in the nav pill. Call is weighted
 * wider because a tap-to-call is the primary conversion.
 */
export default function StickyActionBar({
  labels = { call: "Call", text: "Text", form: "Form" },
}: {
  labels?: { call: string; text: string; form: string };
}) {
  return (
    <div className="lg:hidden">
      {/* Spacer in normal flow so the fixed bar never covers the footer. */}
      <div aria-hidden="true" className="h-[76px]" />
      <div className="fixed inset-x-0 bottom-0 z-50 bg-canvas/90 backdrop-blur supports-[backdrop-filter]:bg-canvas/80">
        <div className="mx-auto flex max-w-2xl gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <a
            href={PHONE_TEL}
            data-analytics="call_tap_sticky"
            className="btn btn-primary min-h-[48px] flex-[1.6] px-4 text-[15px]"
          >
            <PhoneIcon className="h-4 w-4" />
            {labels.call}
          </a>
          <a
            href={SMS_LINK}
            data-analytics="text_tap_sticky"
            className="btn btn-secondary min-h-[48px] flex-1 px-4 text-[15px]"
          >
            <MessageIcon className="h-4 w-4" />
            {labels.text}
          </a>
          <Link href="/contact" className="btn btn-secondary min-h-[48px] flex-1 px-4 text-[15px]">
            <MailIcon className="h-4 w-4" />
            {labels.form}
          </Link>
        </div>
      </div>
    </div>
  );
}
