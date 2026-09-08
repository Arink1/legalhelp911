"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@/components/Icons";
import PhotoSlot from "@/components/PhotoSlot";
import {
  PHONE_DISPLAY,
  PHONE_TEL,
  PRACTICE_AREAS,
  ATTORNEYS,
  YEARS_IN_PRACTICE,
} from "@/lib/site";

const STORAGE_KEY = "lh911.qualifier";

type Timing = "0-30d" | "1-6m" | "6m-2y" | "longer";

type State = {
  practiceArea: string;
  timing: Timing | "";
  facts: string;
  firstName: string;
  phone: string;
  smsConsent: boolean;
  step: number;
};

const EMPTY: State = {
  practiceArea: "",
  timing: "",
  facts: "",
  firstName: "",
  phone: "",
  smsConsent: false,
  step: 1,
};

const TIMING_OPTIONS: { value: Timing; label: string }[] = [
  { value: "0-30d", label: "In the last 30 days" },
  { value: "1-6m", label: "1 to 6 months ago" },
  { value: "6m-2y", label: "6 months to 2 years" },
  { value: "longer", label: "Longer ago" },
];

const FACTS_BY_AREA: Record<string, string[]> = {
  injury: [
    "Someone else caused it",
    "I was hurt and saw a doctor",
    "I was hurt but have not seen a doctor",
    "I am not sure who was at fault",
  ],
  "criminal-defense": [
    "I have a court date coming up",
    "I was arrested and released",
    "There is a warrant out",
    "I am under investigation",
  ],
  "family-divorce": [
    "I want to file",
    "I was served papers",
    "We disagree about custody",
    "I need to change an existing order",
  ],
  immigration: [
    "I have a filing deadline",
    "I am in removal proceedings",
    "I want to petition for family",
    "I want to check my options",
  ],
  employment: [
    "I was fired or forced out",
    "I am owed wages",
    "I am being harassed at work",
    "I reported something and was punished",
  ],
  "wills-estates": [
    "I need a will or trust",
    "Someone passed and there is no will",
    "I am dealing with probate court",
    "There is a dispute over an estate",
  ],
  business: [
    "I need a contract reviewed",
    "I am in a dispute",
    "I am starting a business",
    "I am owed money",
  ],
};

/**
 * Wireframe 1f. Four steps, one question per screen, contact details last
 * because that measurably lifts completion. Answers persist in session
 * storage so a refresh does not restart the flow, and each answer feeds a
 * qualify or disqualify rule rather than only being stored.
 */
export default function QualifierFlow() {
  const [state, setState] = useState<State>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [outcome, setOutcome] = useState<"qualified" | "referral" | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setState({ ...EMPTY, ...JSON.parse(saved) });
    } catch {
      // ignore unreadable storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore write failures (private mode)
    }
  }, [state, hydrated]);

  const set = (patch: Partial<State>) => setState((s) => ({ ...s, ...patch }));
  const back = () => set({ step: Math.max(1, state.step - 1) });

  /**
   * Disqualify rule. Statute-of-limitations style cutoffs vary by state, so
   * this is deliberately conservative: an old injury or employment matter
   * routes to a referral screen rather than promising a call. Never a dead end.
   */
  function evaluate(s: State): "qualified" | "referral" {
    const timeSensitive = ["injury", "employment"].includes(s.practiceArea);
    if (timeSensitive && s.timing === "longer") return "referral";
    return "qualified";
  }

  async function submit() {
    setSubmitting(true);
    setError("");
    const result = evaluate(state);
    const area = PRACTICE_AREAS.find((p) => p.slug === state.practiceArea);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.firstName,
          phone: state.phone,
          case_type: area ? area.title : "Something else",
          description: [
            "Qualifier result: " + result,
            "When: " +
              (TIMING_OPTIONS.find((t) => t.value === state.timing)?.label ??
                "not given"),
            "Facts: " + (state.facts || "not given"),
            "OK to text: " + (state.smsConsent ? "yes" : "no"),
          ].join("\n"),
          consent: true,
          source: "qualifier | " + (state.practiceArea || "unknown"),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please call us.");
      }
      setOutcome(result);
      set({ step: 5 });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please call us."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return <div className="min-h-[320px]" aria-busy="true" />;
  }

  /* ── Result screen: the actual conversion point ──────────────────── */
  if (state.step === 5 && outcome) {
    const referral = outcome === "referral";
    return (
      <div className="text-center" data-analytics="qualifier_result">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            referral ? "bg-brass-soft" : "bg-brass"
          }`}
        >
          <CheckIcon
            className={`h-7 w-7 ${referral ? "text-brass" : "text-white"}`}
          />
        </div>

        <h1 className="mt-5 font-display text-2xl font-extrabold leading-tight tracking-[-0.025em]">
          {referral
            ? "We may not be the right fit, but do not stop here."
            : "Your case looks worth a conversation."}
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-muted">
          {referral
            ? "Based on how long ago this happened, the deadline to act may have passed. Deadlines vary by state and there are exceptions, so it is still worth one free call before you assume it is closed."
            : `An attorney with ${YEARS_IN_PRACTICE} years in this practice will call you. Free.`}
        </p>

        <div className="mx-auto mt-7 max-w-sm space-y-2.5">
          <a
            href={PHONE_TEL}
            data-analytics="call_tap_qualifier_result"
            className="pill pill-primary min-h-[54px] w-full text-base"
          >
            <PhoneIcon className="h-5 w-5" />
            Call now, skip the wait
          </a>
          <Link href="/contact" className="pill pill-outline w-full">
            Pick a time instead
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <PhotoSlot
            label="Attorney"
            src={ATTORNEYS[0].photoSquare}
            className="h-[52px] w-[52px] shrink-0"
            rounded="rounded-full"
          />
          <p className="text-left text-[12px] leading-tight text-muted">
            <span className="block font-semibold text-ink">
              {ATTORNEYS[0].name}
            </span>
            {YEARS_IN_PRACTICE} years in practice
          </p>
        </div>
      </div>
    );
  }

  const total = 4;
  const pct = (state.step / total) * 100;

  return (
    <div>
      {/* Progress header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={back}
          disabled={state.step === 1}
          aria-label="Go back a step"
          className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-ink disabled:opacity-30"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        <div
          className="h-[5px] flex-1 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={state.step}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Step ${state.step} of ${total}`}
        >
          <div
            className="h-full rounded-full bg-brass transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-mono text-[11px] font-bold text-muted">
          {state.step} / {total}
        </span>
      </div>

      {/* Step 1: practice area */}
      {state.step === 1 && (
        <Step title="What are you dealing with?" sub="Answer 4 questions. An attorney reviews it today, free.">
          {PRACTICE_AREAS.map((p) => (
            <OptionRow
              key={p.slug}
              label={p.title}
              hint={p.descriptor}
              onClick={() => set({ practiceArea: p.slug, step: 2 })}
            />
          ))}
          <OptionRow
            label="Something else"
            muted
            onClick={() => set({ practiceArea: "", step: 2 })}
          />
        </Step>
      )}

      {/* Step 2: timing */}
      {state.step === 2 && (
        <Step title="When did it happen?">
          {TIMING_OPTIONS.map((t) => (
            <OptionRow
              key={t.value}
              label={t.label}
              onClick={() => set({ timing: t.value, step: 3 })}
            />
          ))}
        </Step>
      )}

      {/* Step 3: facts */}
      {state.step === 3 && (
        <Step title="Which of these fits best?">
          {(FACTS_BY_AREA[state.practiceArea] ?? [
            "I need to understand my options",
            "Someone is taking legal action against me",
            "I want to take legal action",
            "Something else",
          ]).map((f) => (
            <OptionRow key={f} label={f} onClick={() => set({ facts: f, step: 4 })} />
          ))}
        </Step>
      )}

      {/* Step 4: contact, asked last */}
      {state.step === 4 && (
        <Step title="Where should the attorney reach you?">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="space-y-3"
          >
            <div>
              <label htmlFor="firstName" className="mb-1 block px-1 text-[12.5px] font-semibold">
                First name
              </label>
              <input
                id="firstName"
                value={state.firstName}
                onChange={(e) => set({ firstName: e.target.value })}
                autoComplete="given-name"
                className="field-pill"
              />
            </div>
            <div>
              <label htmlFor="qphone" className="mb-1 block px-1 text-[12.5px] font-semibold">
                Mobile number
              </label>
              <input
                id="qphone"
                type="tel"
                value={state.phone}
                onChange={(e) => set({ phone: e.target.value })}
                autoComplete="tel"
                className="field-pill"
              />
            </div>
            <label className="flex items-start gap-2.5 px-1 text-[11.5px] text-muted">
              <input
                type="checkbox"
                checked={state.smsConsent}
                onChange={(e) => set({ smsConsent: e.target.checked })}
                className="mt-0.5 h-4 w-4 shrink-0 accent-brass"
              />
              OK to text me about my case
            </label>

            {error && (
              <p role="alert" className="frame border-signal/40 bg-signal/5 px-3 py-2 text-[12px] text-signal-dark">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={
                submitting ||
                state.firstName.trim().length < 2 ||
                (state.phone.match(/\d/g) || []).length < 10
              }
              className="pill pill-primary w-full disabled:opacity-50"
            >
              {submitting ? "Checking..." : "See my result"}
            </button>
            <p className="text-center text-[11px] text-muted">
              Confidential &middot; no obligation
            </p>
          </form>
        </Step>
      )}
    </div>
  );
}

function Step({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h1 className="font-display text-[19px] font-extrabold leading-tight tracking-[-0.025em]">
        {title}
      </h1>
      {sub && <p className="mt-1.5 text-[12.5px] text-muted">{sub}</p>}
      <div className="mt-5 space-y-2.5">{children}</div>
    </div>
  );
}

/** Full-width bordered row with a chevron. Tapping it advances the step. */
function OptionRow({
  label,
  hint,
  muted,
  onClick,
}: {
  label: string;
  hint?: string;
  muted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[46px] w-full items-center justify-between gap-3 rounded-[14px] border-[1.5px] border-ink px-4 py-3 text-left transition hover:bg-ink hover:text-white ${
        muted ? "text-muted" : ""
      }`}
    >
      <span>
        <span className="block text-[13.5px] font-semibold leading-tight">
          {label}
        </span>
        {hint && <span className="mt-0.5 block text-[11.5px] opacity-70">{hint}</span>}
      </span>
      <ChevronRightIcon className="h-4 w-4 shrink-0" />
    </button>
  );
}
