import type { Metadata } from "next";
import { TopBar, Footer } from "@/components/SiteChrome";
import CaseReviewForm from "@/components/CaseReviewForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import { PHONE_DISPLAY, PHONE_TEL, SITE_NAME, OFFICE } from "@/lib/site";

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
        <section className="px-5 pb-16 pt-12 sm:px-6 md:pb-[clamp(64px,8vw,112px)] md:pt-[72px]">
          <div className="mx-auto max-w-[1280px]">
            <div className="max-w-[720px]">
              <p className="eyebrow">Free case review</p>
              <h1 className="h1-page mb-4 mt-6">Tell us what happened</h1>
              <p className="lead">
                Two minutes now, and we will tell you what the matter
                realistically involves. If there is a court date or a deadline,
                call{" "}
                <a
                  href={PHONE_TEL}
                  data-analytics="call_tap_contact_intro"
                  className="font-medium text-ink"
                >
                  {PHONE_DISPLAY}
                </a>{" "}
                instead. Phone intake is staffed 24 hours.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-6 md:mt-14 md:gap-8">
              <CaseReviewForm />

              <div className="flex flex-col gap-6">
                <div className="card-ink md:p-10">
                  <p className="text-[13px] font-bold uppercase leading-none tracking-[0.04em] text-white/70">
                    Urgent right now
                  </p>
                  <h2 className="mb-3 mt-4 text-[26px] font-medium leading-[1.15] tracking-[-0.02em] text-white">
                    Call {PHONE_DISPLAY}
                  </h2>
                  <p className="mb-6 text-[15px] leading-normal text-white/80">
                    A hearing tomorrow, an arrest, a warrant, or a lawsuit you
                    have just been served: call rather than typing. Phone intake
                    runs 24 hours. {OFFICE.afterHours} Jail visits are available.
                  </p>
                  <a
                    href={PHONE_TEL}
                    data-analytics="call_tap_contact_urgent"
                    className="btn btn-cream w-full sm:w-auto"
                  >
                    Call now
                  </a>
                </div>

                <div className="card-lifted md:p-10">
                  <h2 className="mb-5 text-[20px] font-medium leading-[1.2] tracking-[-0.01em]">
                    The office
                  </h2>
                  <address className="mb-4 text-[15px] not-italic leading-normal">
                    {OFFICE.street}
                    <br />
                    {OFFICE.city}, {OFFICE.region} {OFFICE.postalCode}
                    <br />
                    {OFFICE.county}
                  </address>
                  <p className="mb-4 text-[15px] leading-normal text-muted">
                    {OFFICE.hours[0][1]}. {OFFICE.hours[1][0]} by appointment.{" "}
                    {OFFICE.perks.join(". ")}.
                  </p>
                  <p className="text-[15px] leading-normal">
                    <a
                      href={OFFICE.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get directions
                    </a>
                  </p>
                </div>

                <p className="text-[13px] leading-normal text-muted">
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
