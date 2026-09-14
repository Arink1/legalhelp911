"use client";

import ScalesMark from "@/components/ScalesMark";
import { useEffect, useRef, useState } from "react";
import { FIRM_NAME } from "@/lib/site";

type Status = "idle" | "submitting" | "done" | "error";

/**
 * Footer "Get legal tips by email" link and the newsletter modal it opens.
 *
 * The overlay scrolls (`overflow:auto`, `align-content: safe center`) and
 * the card's left panel has `min-height:0; overflow:auto`, so on a short
 * viewport the form is still reachable rather than clipped.
 */
export default function NewsletterSignup({
  className = "",
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  function openModal() {
    setStatus("idle");
    setError("");
    setOpen(true);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company: data.get("company") ?? "",
          source: window.location.pathname,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "We could not sign you up. Please try again.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "We could not sign you up. Please try again."
      );
    }
  }

  return (
    <>
      <button type="button" onClick={openModal} className={className}>
        Get legal tips by email
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-title"
          className="fixed inset-0 z-[80] grid place-items-start justify-items-center overflow-auto bg-scrim p-4 [align-content:safe_center] sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="relative grid w-full max-w-[760px] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-[28px] bg-canvas shadow-card [max-height:calc(100vh-48px)] sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] sm:rounded-[40px]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 z-[2] grid h-11 w-11 place-items-center rounded-full bg-white text-ink"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="relative order-first min-h-[180px] sm:order-last sm:min-h-[320px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/media/newsletter.webp"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="min-h-0 min-w-0 overflow-auto p-6 sm:p-[clamp(32px,4vw,48px)]">
              <ScalesMark className="w-12 sm:w-14" />

              {status === "done" ? (
                <>
                  <h2
                    id="newsletter-title"
                    className="mb-3 mt-8 text-[26px] font-medium leading-[1.15] tracking-[-0.02em]"
                  >
                    You are on the list
                  </h2>
                  <p className="mb-7 text-[15px] leading-normal text-muted">
                    One short email a month, and nothing else. Unsubscribe from
                    any of them.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                </>
              ) : (
                <form onSubmit={submit} noValidate>
                  <p className="eyebrow mt-8">Monthly email</p>
                  <h2
                    id="newsletter-title"
                    className="mb-3 mt-4 text-[clamp(22px,2.6vw,30px)] font-medium leading-[1.15] tracking-[-0.02em] [text-wrap:pretty]"
                  >
                    Know what you can do before you need a lawyer
                  </h2>
                  <p className="mb-7 text-[15px] leading-normal text-muted">
                    One plain-English email a month from the firm: the deadline
                    people miss, the clause people sign, the call worth making
                    early.
                  </p>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label htmlFor="nl-email" className="field-label">
                        Email address
                      </label>
                      <input
                        ref={inputRef}
                        id="nl-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="field"
                        aria-invalid={status === "error"}
                        aria-describedby={error ? "nl-error" : undefined}
                      />
                      {error && (
                        <p id="nl-error" role="alert" className="field-error">
                          {error}
                        </p>
                      )}
                    </div>
                    {/* Honeypot */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="nl-company">Company</label>
                      <input
                        id="nl-company"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="btn btn-primary btn-lg w-full sm:w-auto sm:self-start"
                    >
                      {status === "submitting" ? "Sending..." : "Sign me up"}
                    </button>
                  </div>
                  <p className="mt-6 text-[13px] leading-normal text-muted">
                    By signing up you agree to receive email from the {FIRM_NAME}{" "}
                    General information only, not legal advice.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
