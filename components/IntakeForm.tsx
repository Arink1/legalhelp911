"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CASE_TYPES, YEARS_IN_PRACTICE } from "@/lib/site";

/**
 * Wireframe 1g intake form. Two fields to start; practice area, description,
 * and best-time-to-call are revealed once name and phone are both non-empty.
 * Revealed fields keep their values if they collapse again, so nothing the
 * visitor typed is ever thrown away.
 */
export default function IntakeForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [caseType, setCaseType] = useState("");
  const [description, setDescription] = useState("");
  const [bestTime, setBestTime] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [touched, setTouched] = useState<{ name?: boolean; phone?: boolean }>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  const revealed = name.trim().length > 0 && phone.trim().length > 0;

  const nameError =
    touched.name && name.trim().length < 2 ? "Please enter your name." : "";
  const phoneError =
    touched.phone && (phone.match(/\d/g) || []).length < 10
      ? "Please enter a valid phone number."
      : "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ name: true, phone: true });
    if (name.trim().length < 2 || (phone.match(/\d/g) || []).length < 10) {
      setStatus("error");
      setError("");
      return;
    }

    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          case_type: caseType || "Something else",
          description: [
            description,
            bestTime ? "Best time to call: " + bestTime : "",
          ]
            .filter(Boolean)
            .join("\n"),
          consent: true,
          company,
          source: "contact page",
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
        sessionStorage.setItem("lh911.lastPhone", phone);
      } catch {
        // private mode: the thank-you page falls back to generic copy
      }
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "We could not send your request. Please try again or call us."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div>
        <label htmlFor="i-name" className="mb-1 block px-1 text-[12.5px] font-semibold">
          Name
        </label>
        <input
          id="i-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          autoComplete="name"
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "i-name-error" : undefined}
          className="field-pill"
        />
        {nameError && (
          <p id="i-name-error" className="mt-1 px-1 text-[11px] font-medium text-signal-dark">
            {nameError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="i-phone" className="mb-1 block px-1 text-[12.5px] font-semibold">
          Mobile number
        </label>
        <input
          id="i-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          autoComplete="tel"
          aria-invalid={Boolean(phoneError)}
          aria-describedby={phoneError ? "i-phone-error" : undefined}
          className="field-pill"
        />
        {phoneError && (
          <p id="i-phone-error" className="mt-1 px-1 text-[11px] font-medium text-signal-dark">
            {phoneError}
          </p>
        )}
      </div>

      {/* Progressive disclosure: grid-rows trick animates height cleanly */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          revealed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!revealed}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 pt-1">
            <div>
              <label htmlFor="i-case" className="mb-1 block px-1 text-[12.5px] font-semibold">
                Practice area
              </label>
              <select
                id="i-case"
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                tabIndex={revealed ? 0 : -1}
                className="field-pill"
              >
                <option value="">Choose one</option>
                {CASE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="i-desc" className="mb-1 block px-1 text-[12.5px] font-semibold">
                What happened?{" "}
                <span className="font-normal text-muted">(optional)</span>
              </label>
              <textarea
                id="i-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                tabIndex={revealed ? 0 : -1}
                className="field-area"
              />
            </div>

            <div>
              <label htmlFor="i-time" className="mb-1 block px-1 text-[12.5px] font-semibold">
                Best time to call
              </label>
              <select
                id="i-time"
                value={bestTime}
                onChange={(e) => setBestTime(e.target.value)}
                tabIndex={revealed ? 0 : -1}
                className="field-pill"
              >
                <option value="">Any time</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="i-company">Company</label>
        <input
          id="i-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === "error" && error && (
        <p role="alert" className="frame border-signal/40 bg-signal/5 px-3 py-2 text-[12.5px] text-signal-dark">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="pill pill-primary w-full disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send, get a call today"}
      </button>

      <p className="text-center text-[11px] leading-relaxed text-muted">
        We reply within 1 business hour &middot; {YEARS_IN_PRACTICE} years
        &middot; free consultation
      </p>
    </form>
  );
}
