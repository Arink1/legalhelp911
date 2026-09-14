"use client";

import { useEffect, useState } from "react";
import { CASE_TYPES, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

type Status = "idle" | "submitting" | "sent" | "error";
type FieldKey = "name" | "phone" | "email" | "case_type" | "consent";
type Errors = Partial<Record<FieldKey, string>>;

const DEADLINES = [
  "No date yet",
  "Within a week",
  "Within a month",
  "There is a date this week",
];

/**
 * The contact page's free-case-review form. Validates on blur, posts to the
 * existing `api/lead.py` endpoint, and swaps to the success state in place.
 */
export default function CaseReviewForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [consent, setConsent] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (status !== "sent") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(
      new CustomEvent("lh911:conversion", { detail: { type: "lead_submitted" } })
    );
  }, [status]);

  function validate(field: FieldKey, value: string, checked?: boolean): string {
    switch (field) {
      case "name":
        return value.trim().length < 2 ? "Please enter your full name." : "";
      case "phone":
        return (value.match(/\d/g) || []).length < 10
          ? "Please enter a valid phone number."
          : "";
      case "email":
        return value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
          ? "Please enter a valid email address."
          : "";
      case "case_type":
        return value ? "" : "Please choose the type of matter.";
      case "consent":
        return checked ? "" : "Please tick the box so the firm can contact you.";
      default:
        return "";
    }
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const field = e.target.name as FieldKey;
    const msg = validate(field, e.target.value);
    setErrors((prev) => ({ ...prev, [field]: msg || undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<
      string,
      string
    >;

    const next: Errors = {};
    for (const field of ["name", "phone", "email", "case_type"] as const) {
      const msg = validate(field, data[field] ?? "");
      if (msg) next[field] = msg;
    }
    const consentMsg = validate("consent", "", consent);
    if (consentMsg) next.consent = consentMsg;

    if (Object.keys(next).length > 0) {
      setErrors(next);
      setStatus("error");
      setFormError("");
      return;
    }

    setStatus("submitting");
    setErrors({});
    setFormError("");

    const params = new URLSearchParams(window.location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign"]
      .map((k) => (params.get(k) ? k + "=" + params.get(k) : ""))
      .filter(Boolean)
      .join("&");
    const source = ["contact page", utm].filter(Boolean).join(" | ").slice(0, 100);

    const description = [
      data.deadline && data.deadline !== DEADLINES[0]
        ? "Court date or deadline: " + data.deadline
        : "",
      data.description ?? "",
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          case_type: data.case_type,
          description,
          consent: true,
          company: data.company, // honeypot
          source,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.error ||
            "We could not send your request. Please try again or call us."
        );
      }
      try {
        sessionStorage.setItem("lh911.lastPhone", data.phone);
      } catch {
        // private mode
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setFormError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "We could not send your request. Please try again or call us."
      );
    }
  }

  function reset() {
    setStatus("idle");
    setErrors({});
    setFormError("");
    setConsent(false);
    setFormKey((k) => k + 1);
  }

  function fieldError(k: FieldKey) {
    if (!errors[k]) return null;
    return (
      <p id={`cr-${k}-error`} className="field-error">
        {errors[k]}
      </p>
    );
  }

  if (status === "sent") {
    return (
      <div className="card flex flex-col gap-4 sm:p-10" data-analytics="lead_submitted">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-ink text-canvas">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="text-[26px] font-medium leading-[1.2] tracking-[-0.02em]">
          We have your details
        </h2>
        <p className="text-[16px] leading-normal text-muted">
          Someone from the firm will call you back. If your matter has a hearing
          or a filing deadline in the next few days, call{" "}
          <a href={PHONE_TEL} className="font-medium text-ink">
            {PHONE_DISPLAY}
          </a>{" "}
          now rather than waiting.
        </p>
        <p className="text-[14px] leading-normal text-muted">
          Sending this form does not create an attorney-client relationship.
        </p>
        <div className="mt-2">
          <button type="button" onClick={reset} className="btn btn-secondary">
            Send another matter
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      key={formKey}
      id="case-review"
      onSubmit={handleSubmit}
      noValidate
      className="card flex flex-col gap-5 sm:p-10"
    >
      <h2 className="h3">Your details</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-5">
        <div>
          <label htmlFor="cr-name" className="field-label">
            Full name
          </label>
          <input
            id="cr-name"
            name="name"
            autoComplete="name"
            placeholder="Jordan Reyes"
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "cr-name-error" : undefined}
            className="field"
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="cr-phone" className="field-label">
            Phone
          </label>
          <input
            id="cr-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(954) 000-0000"
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "cr-phone-error" : "cr-phone-hint"}
            className="field"
          />
          {errors.phone ? (
            fieldError("phone")
          ) : (
            <p id="cr-phone-hint" className="field-hint">
              The number we should call
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-5">
        <div>
          <label htmlFor="cr-email" className="field-label">
            Email
          </label>
          <input
            id="cr-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "cr-email-error" : undefined}
            className="field"
          />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor="cr-case" className="field-label">
            Type of matter
          </label>
          <select
            id="cr-case"
            name="case_type"
            defaultValue=""
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.case_type)}
            aria-describedby={errors.case_type ? "cr-case_type-error" : undefined}
            className="field"
          >
            <option value="" disabled>
              Select a matter
            </option>
            {CASE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {fieldError("case_type")}
        </div>
      </div>

      <div>
        <label htmlFor="cr-desc" className="field-label">
          What happened?
        </label>
        <textarea
          id="cr-desc"
          name="description"
          rows={5}
          placeholder="Tell it the way you would tell a friend. Include any court date or deadline you have been given."
          className="field field-textarea"
        />
      </div>

      <div>
        <label htmlFor="cr-deadline" className="field-label">
          Do you have a court date or deadline?
        </label>
        <select id="cr-deadline" name="deadline" defaultValue={DEADLINES[0]} className="field">
          {DEADLINES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Honeypot: invisible to people, filled by bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="cr-company">Company</label>
        <input id="cr-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-[15px] leading-normal text-ink">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "cr-consent-error" : undefined}
            className="checkbox"
          />
          <span>
            The firm may contact me by phone, text, or email about this matter,
            including by automated means. Consent is not a condition of hiring
            the firm. Message and data rates may apply.
          </span>
        </label>
        {fieldError("consent")}
      </div>

      {status === "error" && formError && (
        <p role="alert" className="rounded-[20px] bg-canvas px-5 py-3 text-[14px] font-medium">
          {formError}
        </p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn btn-primary btn-lg w-full sm:w-auto"
        >
          {status === "submitting" ? "Sending..." : "Send my matter"}
        </button>
        <span className="text-[14px] leading-5 text-muted">
          Submitting does not create an attorney-client relationship.
        </span>
      </div>
    </form>
  );
}
