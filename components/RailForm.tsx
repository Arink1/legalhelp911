"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRACTICE_AREAS } from "@/lib/site";

/**
 * Short two-field case-review card for the article right rail. Deliberately
 * only name and phone: it interrupts reading, so it asks for the minimum.
 */
export default function RailForm({ practiceSlug }: { practiceSlug?: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  const practiceTitle =
    PRACTICE_AREAS.find((p) => p.slug === practiceSlug)?.title ?? "Not specified";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name.trim().length < 2 || (phone.match(/\d/g) || []).length < 10) {
      setStatus("error");
      setError("Please add your name and a valid phone number.");
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
          case_type: practiceTitle,
          consent: true,
          source: ("article rail | " + window.location.pathname).slice(0, 100),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Please try again or call us.");
      }
      try {
        sessionStorage.setItem("lh911.lastPhone", phone);
      } catch {
        // private mode
      }
      router.push("/thank-you");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Please try again or call us.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="frame bg-card p-4">
      <p className="font-display text-base font-extrabold">
        Was this your accident?
      </p>
      <div className="mt-3 space-y-2.5">
        <div>
          <label htmlFor="r-name" className="mb-1 block px-1 text-[11.5px] font-semibold">
            Name
          </label>
          <input
            id="r-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="field-pill min-h-[40px] py-2 text-[13px]"
          />
        </div>
        <div>
          <label htmlFor="r-phone" className="mb-1 block px-1 text-[11.5px] font-semibold">
            Phone
          </label>
          <input
            id="r-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className="field-pill min-h-[40px] py-2 text-[13px]"
          />
        </div>
        {status === "error" && error && (
          <p role="alert" className="px-1 text-[11px] font-medium text-signal-dark">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="pill pill-primary min-h-[42px] w-full text-[13.5px] disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : "Get a free review"}
        </button>
        <p className="text-center text-[10.5px] text-muted">
          Confidential. No fee to ask.
        </p>
      </div>
    </form>
  );
}
