"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CASE_TYPES, YEARS_IN_PRACTICE, PRACTICE_AREAS } from "@/lib/site";

type Status = "idle" | "submitting" | "error";
type FieldKey = "name" | "phone" | "email" | "case_type" | "consent";
type Errors = Partial<Record<FieldKey, string>>;

export default function LeadForm({
  practiceSlug,
  caseTypes = CASE_TYPES,
  showDateField = false,
  title = "Tell us what happened",
}: {
  practiceSlug?: string;
  caseTypes?: readonly string[];
  showDateField?: boolean;
  title?: string;
}) {
  // The handoff fixes the practice-page field order as Name / Phone / Date of
  // accident / Brief description. When the page already knows the practice
  // there is nothing to ask, so the case-type select and the optional email
  // are dropped rather than adding friction to a paid-traffic landing page.
  const knowsPractice = Boolean(practiceSlug);
  const practiceTitle =
    PRACTICE_AREAS.find((p) => p.slug === practiceSlug)?.title ?? "Not specified";
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");

  // Validate on blur, not on keystroke, per the handoff.
  function validate(field: FieldKey, value: string, checked?: boolean): string {
    switch (field) {
      case "name":
        return value.trim().length < 2 ? "Please enter your name." : "";
      case "phone":
        return (value.match(/\d/g) || []).length < 10
          ? "Please enter a valid phone number."
          : "";
      case "email":
        return value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
          ? "Please enter a valid email address."
          : "";
      case "case_type":
        return value ? "" : "Please choose one.";
      case "consent":
        return checked ? "" : "Please tick the box so we can contact you.";
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
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;

    const next: Errors = {};
    const required = knowsPractice
      ? (["name", "phone"] as const)
      : (["name", "phone", "email", "case_type"] as const);
    for (const field of required) {
      const msg = validate(field, data[field] ?? "");
      if (msg) next[field] = msg;
    }
    const consentMsg = validate("consent", "", Boolean(data.consent));
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

    // Source attribution the handoff requires on every submission.
    const params = new URLSearchParams(window.location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign"]
      .map((k) => (params.get(k) ? k + "=" + params.get(k) : ""))
      .filter(Boolean)
      .join("&");

    const description = [
      data.incident_date ? "Date of incident: " + data.incident_date : "",
      data.description ?? "",
    ]
      .filter(Boolean)
      .join("\n");

    const source = [
      practiceSlug ? "practice:" + practiceSlug : "site",
      window.location.pathname,
      utm,
    ]
      .filter(Boolean)
      .join(" | ")
      .slice(0, 100);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          case_type: data.case_type || practiceTitle,
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
        // private mode: the thank-you page falls back to generic copy
      }
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setFormError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "We could not send your request. Please try again or call us."
      );
    }
  }

  function fieldError(k: FieldKey) {
    if (!errors[k]) return null;
    return (
      <p
        id={k + "-error"}
        className="mt-1 px-1 text-[11px] font-medium text-signal-dark"
      >
        {errors[k]}
      </p>
    );
  }

  return (
    <form
      id="case-review"
      onSubmit={handleSubmit}
      noValidate
      className="frame bg-card p-5 shadow-[0_18px_44px_-28px_rgba(14,29,48,0.4)] sm:p-6"
    >
      <h2 className="font-display text-xl font-extrabold tracking-[-0.02em]">
        {title}
      </h2>
      <p className="mt-1 text-[12.5px] text-muted">
        {YEARS_IN_PRACTICE} years &middot; free consultation
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block px-1 text-[12.5px] font-semibold"
          >
            Your name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="field-pill"
          />
          {fieldError("name")}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-1 block px-1 text-[12.5px] font-semibold"
          >
            Mobile number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="field-pill"
          />
          {fieldError("phone")}
        </div>

        {!knowsPractice && (
        <div>
          <label
            htmlFor="email"
            className="mb-1 block px-1 text-[12.5px] font-semibold"
          >
            Email <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="field-pill"
          />
          {fieldError("email")}
        </div>
        )}

        {showDateField && (
          <div>
            <label
              htmlFor="incident_date"
              className="mb-1 block px-1 text-[12.5px] font-semibold"
            >
              Date of accident{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              id="incident_date"
              name="incident_date"
              type="date"
              className="field-pill"
            />
          </div>
        )}

        {!knowsPractice && (
        <div>
          <label
            htmlFor="case_type"
            className="mb-1 block px-1 text-[12.5px] font-semibold"
          >
            Type of case
          </label>
          <select
            id="case_type"
            name="case_type"
            defaultValue=""
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.case_type)}
            aria-describedby={errors.case_type ? "case_type-error" : undefined}
            className="field-pill"
          >
            <option value="" disabled>
              Choose one
            </option>
            {caseTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {fieldError("case_type")}
        </div>
        )}

        <div>
          <label
            htmlFor="description"
            className="mb-1 block px-1 text-[12.5px] font-semibold"
          >
            Brief description{" "}
            <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="field-area"
            placeholder="A few sentences helps us route you faster."
          />
        </div>

        {/* Honeypot: invisible to people, filled by bots. No CAPTCHA, they cost leads. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>

        <div>
          <label className="flex items-start gap-2.5 px-1 text-[11px] leading-relaxed text-muted">
            <input
              type="checkbox"
              name="consent"
              value="yes"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? "consent-error" : undefined}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brass"
            />
            <span>
              OK to call, text, or email me about my case, including by
              automated means. Consent is not a condition of hiring us. Message
              and data rates may apply.
            </span>
          </label>
          {fieldError("consent")}
        </div>

        {status === "error" && formError && (
          <p
            role="alert"
            className="frame border-signal/40 bg-signal/5 px-3 py-2 text-[12.5px] text-signal-dark"
          >
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="pill pill-primary w-full disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : "Get my free review"}
        </button>

        <p className="text-center text-[11px] text-muted">
          Confidential. No fee to ask.
        </p>
      </div>
    </form>
  );
}
