import type { Metadata } from "next";
import { TopBar, Footer } from "@/components/SiteChrome";
import CaseReviewForm from "@/components/CaseReviewForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import { EMAIL_DISPLAY, EMAIL_LINK, PHONE_DISPLAY, PHONE_TEL, SITE_NAME, OFFICE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Free case review | ${SITE_NAME}`,
  description: `Tell us what happened and we will tell you what the matter realistically involves. If there is a court date or a deadline, call ${PHONE_DISPLAY}. Phone intake is staffed 24 hours.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <LocalBusinessSchema />
      <TopBar />
      <main>
        <section className="px-5 pb-[clamp(48px,6vw,88px)] pt-8 sm:px-6 md:pt-[clamp(48px,6vw,72px)]">
          <div className="mx-auto max-w-[1280px]">
            <div className="max-w-[720px]">
              <p className="eyebrow mb-5">Free case review</p>
              <h1 className="h1-page mb-4 text-walnut">Tell us what happened</h1>
              <p className="lead">
                Two minutes now, and we will tell you what the matter
                realistically involves. If there is a court date or a deadline,
                call{" "}
                <a
                  href={PHONE_TEL}
                  data-analytics="call_tap_contact_intro"
                  className="font-bold text-walnut"
                >
                  {PHONE_DISPLAY}
                </a>{" "}
                instead. Phone intake is staffed 24 hours.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-7 md:mt-12">
              <CaseReviewForm />

              <div className="flex flex-col gap-6">
                <div className="card-ink">
                  <p className="label label-brass">Urgent right now</p>
                  <h2 className="mb-3 mt-3.5 font-display text-[26px] font-bold leading-[1.2] text-parchment">
                    Call {PHONE_DISPLAY}
                  </h2>
                  <p className="mb-6 text-[15px] leading-[1.65] text-cream">
                    A hearing tomorrow, an arrest, a warrant, or a lawsuit you
                    have just been served: call rather than typing. Phone intake
                    runs 24 hours. {OFFICE.afterHours} Jail visits are available.
                  </p>
                  <a
                    href={PHONE_TEL}
                    data-analytics="call_tap_contact_urgent"
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    Call now
                  </a>
                </div>

                <div className="card-plain md:p-[clamp(28px,3vw,40px)]">
                  <h2 className="mb-[18px] font-display text-[20px] font-bold leading-[1.25] text-walnut">
                    The office
                  </h2>
                  <address className="mb-3.5 text-[15px] not-italic leading-[1.65] text-body">
                    {OFFICE.street}
                    <br />
                    {OFFICE.city}, {OFFICE.region} {OFFICE.postalCode}
                    <br />
                    {OFFICE.county}
                  </address>
                  <p className="mb-3.5 text-[15px] leading-[1.65] text-muted">
                    {OFFICE.hours[0][1]}. {OFFICE.hours[1][0]} by appointment.{" "}
                    {OFFICE.perks.join(". ")}.
                  </p>
                  <p className="mb-3.5 text-[15px] leading-[1.65]">
                    Email{" "}
                    <a href={EMAIL_LINK} data-analytics="email_tap_contact" className="font-semibold">
                      {EMAIL_DISPLAY}
                    </a>
                  </p>
                  <p className="text-[15px] leading-[1.65]">
                    <a
                      href={OFFICE.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get directions
                    </a>
                  </p>
                </div>

                <p className="text-[13px] leading-[1.5] text-muted">
                  Please do not send confidential or time-critical details
                  through this form. Until a representation agreement is signed,
                  no attorney-client relationship exists and no work is being
                  done on your behalf.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
