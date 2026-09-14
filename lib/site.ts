// Single source of truth for firm details, contact channels, and the
// practice-area taxonomy. Every CTA, chip, and landing page reads from here.

export const SITE_NAME = "LegalHelp911";
export const FIRM_NAME = "Law Offices of Tyler A. Trumbach, P.A.";
/** Shorter form for tight spots like nav and card headings. */
export const FIRM_SHORT = "Trumbach Law";

export const PHONE_DISPLAY = "(954) 444-6209";
export const PHONE_TEL = "tel:+19544446209";
export const SMS_LINK = "sms:+19544446209";
// The only email the site publishes. Attorneys' direct lines and inboxes
// are never shown; every contact channel routes through firm intake.
export const EMAIL_DISPLAY = "support@legalhelp911.com";
export const EMAIL_LINK = "mailto:support@legalhelp911.com";

// TODO: confirm with the firm. This is the one hard number the site claims,
// so it must be right. The handoff lists 38 years and free consultation as
// the ONLY verified trust signals: do not add settlement figures, award
// badges, review counts, or "no fee unless you win" without proof.
export const YEARS_IN_PRACTICE = 38;

export type PracticeArea = {
  slug: string;
  /** Short label for the homepage chip row. */
  chip: string;
  /** Full name used as a page title and in the directory. */
  title: string;
  /** One-line descriptor. */
  descriptor: string;
  /** Ad-keyword H1 for the landing page. Maps 1:1 to an ad group. */
  h1: string;
  /** Qualifier chips shown under the landing-page H1. */
  qualifiers: string[];
  /** Explainer row: what we handle / what it costs / what happens next. */
  handles: string[];
  /** The honest scarcity line for the urgency band. */
  urgency: string;
  /** Options for the "type of case" select on that page's form. */
  caseTypes: string[];
  /** Basename in /public/media for this page's hero footage (2c). */
  clip: string;
  /** Practice-index row subtitle: the keyword list, not marketing copy. */
  searchedFor: string;
  /** Flagged "new" in the practice index. */
  isNew?: boolean;
  /** Opening paragraph, specific to this practice, not a template. */
  intro: string;
  /** How this kind of work is actually priced. Differs a lot by practice. */
  costs: string;
  /** Three next steps written for this practice. */
  steps: [string, string, string];
  /** Common questions, rendered with FAQPage schema. Deliberately process
   *  focused: no deadlines, dollar figures, or percentages, because those
   *  vary and the handoff forbids inventing them. */
  faq: { q: string; a: string }[];
};

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    slug: "criminal-defense",
    chip: "Criminal",
    title: "Criminal defense",
    descriptor: "DUI, charges, warrants",
    h1: `Criminal defense lawyer in Broward County. ${YEARS_IN_PRACTICE} years. Free case review.`,
    qualifiers: ["Free consultation", "Jail visits available", "Se habla espanol"],
    handles: [
      "DUI and DWI charges",
      "Drug charges and possession",
      "Assault and violent charges",
      "Warrants, bond, and probation issues",
    ],
    urgency: "Court dates do not wait. Get a lawyer before your next hearing.",
    caseTypes: ["DUI or DWI", "Drug charge", "Assault charge", "Warrant or probation", "Other charge"],
    clip: "hero-courtroom",
    searchedFor: "DUI, drug charges, assault, warrants",
    intro:
      "A charge is not a conviction, and the window before your next court date is when most of the useful work happens. Bring us whatever paperwork you were given, even if it is only a citation.",
    costs:
      "Criminal defense is usually quoted as a flat fee for a defined stage of the case, so you know the number before you commit. More serious matters are quoted stage by stage. Everything is set out in writing.",
    steps: [
      "Tell us the charge and your next court date.",
      "We review the paperwork and the stop, free.",
      "We explain the realistic outcomes and timeline.",
    ],
    faq: [
      {
        q: "Should I talk to the police before I have a lawyer?",
        a: "You are generally not required to answer questions beyond identifying yourself, and you can say you want a lawyer present. People routinely talk themselves into trouble trying to be helpful. Asking for a lawyer is not an admission of anything.",
      },
      {
        q: "What actually happens at my first court date?",
        a: "The first appearance is usually procedural rather than a trial: the charge is read, counsel is confirmed, and dates are set. Very little is decided that day, which is exactly why having someone there who knows the courtroom matters.",
      },
      {
        q: "Can a charge be reduced or dropped before trial?",
        a: "It happens, and it often turns on things that are only visible early: how the stop was conducted, whether the evidence was properly obtained, and what the file actually shows. That work is easiest before positions harden.",
      },
      {
        q: "Do I really need a lawyer for a first offence?",
        a: "A first charge still creates a record that follows you into jobs, housing, and licensing. Whether you hire anyone is your call, but find out what the charge actually carries before deciding it is minor.",
      },
    ],
  },
  {
    slug: "family-law",
    chip: "Family",
    title: "Family law",
    descriptor: "Divorce, custody, support",
    h1: `Family law attorney in Broward County. ${YEARS_IN_PRACTICE} years. Free consultation.`,
    qualifiers: ["Free consultation", "Evening appointments", "Se habla espanol"],
    handles: [
      "Divorce and separation",
      "Child custody and time sharing",
      "Child and spousal support",
      "Modifications and enforcement",
    ],
    urgency: "Filing first shapes the case. Know where you stand before you respond.",
    caseTypes: ["Divorce", "Child custody", "Child support", "Modification", "Other family matter"],
    clip: "hero-scales",
    searchedFor: "Divorce, custody, support, time sharing",
    intro:
      "Family matters move on the court calendar rather than yours, and the first filing often shapes everything after it. Whether you are filing or responding, know where you stand before the deadline runs.",
    costs:
      "Family work is generally billed hourly against a retainer, because how long it takes depends on how much is contested. We estimate the likely range at the first meeting and bill against it transparently.",
    steps: [
      "Tell us what has been filed, if anything.",
      "We review the papers and your options, free.",
      "We map the next 30 days so nothing is missed.",
    ],
    faq: [
      {
        q: "Do we have to go to court?",
        a: "Many family matters resolve through agreement or mediation without a contested hearing. Court is the fallback when agreement is not possible, and preparing as though it might happen tends to produce better agreements.",
      },
      {
        q: "How long will this take?",
        a: "It depends almost entirely on how much is contested. Matters where the parties agree on the major points move considerably faster than those where they do not. We give you a realistic range once we see what is in dispute.",
      },
      {
        q: "What if we already have an order and things have changed?",
        a: "Existing orders can generally be modified when circumstances change substantially, though what qualifies is specific and worth checking before you stop following the current order. Do not simply stop paying or withhold time.",
      },
      {
        q: "Should I move out of the house?",
        a: "Do not decide that on your own. Moving out can affect how time sharing and use of the home are handled, so it is worth one conversation before you do it, not after.",
      },
    ],
  },
  {
    slug: "civil-litigation",
    chip: "Litigation",
    title: "Civil litigation",
    descriptor: "Disputes, claims, trials",
    h1: `Civil litigation attorney in Broward County. ${YEARS_IN_PRACTICE} years. Free case review.`,
    qualifiers: ["Free consultation", "Trial experience", "Se habla espanol"],
    handles: [
      "Contract and property disputes",
      "Insurance and claim disputes",
      "Construction and lien claims",
      "Appeals and post-judgment matters",
    ],
    urgency: "Deadlines to answer a lawsuit are measured in days, not weeks.",
    caseTypes: ["Contract dispute", "Property dispute", "Insurance dispute", "Served with a lawsuit", "Other"],
    clip: "hero-courthouse",
    searchedFor: "Contract disputes, property claims, lawsuits, appeals",
    intro:
      "If you have been served, the clock to respond is short and missing it can cost the case outright. If you are the one owed, the same deadlines cut the other way, so the sooner it is assessed the more options remain.",
    costs:
      "Litigation is billed hourly with an estimated range up front, and some claims can be taken on contingency depending on what is recoverable. We tell you plainly when a fight would cost more than it can return.",
    steps: [
      "Send us the complaint, notice, or contract.",
      "We check the response deadline, free.",
      "We give you the options and what each costs.",
    ],
    faq: [
      {
        q: "I was just served. What do I do first?",
        a: "Note the date you were served and get advice immediately. The window to respond is short, and missing it can hand the other side a default judgment without the merits ever being heard.",
      },
      {
        q: "Is it worth suing?",
        a: "That depends on what is recoverable and whether the other side can actually pay. We would rather tell you a claim is not worth the cost than take it and let you find out later.",
      },
      {
        q: "What is discovery, and why does it take so long?",
        a: "Discovery is the exchange of documents and testimony before trial. It is where most cases are actually won or lost, and it is the phase people underestimate most.",
      },
      {
        q: "Will this go to trial?",
        a: "Most civil matters resolve before trial, but the ones that resolve well are usually the ones prepared as though they would not. Preparation is what creates leverage to settle.",
      },
    ],
  },
  {
    slug: "business",
    chip: "Business",
    title: "Business",
    descriptor: "Contracts, formation, disputes",
    h1: `Business attorney in Broward County. ${YEARS_IN_PRACTICE} years. Free consultation.`,
    qualifiers: ["Free consultation", "Flat fees available", "Se habla espanol"],
    handles: [
      "Contracts and agreements",
      "Business formation",
      "Partnership and contract disputes",
      "Collections",
    ],
    urgency: "Contract deadlines and notice periods move fast. Get ahead of them.",
    caseTypes: ["Contract review", "Business formation", "Dispute", "Collections", "Other"],
    clip: "hero-courthouse",
    searchedFor: "Formation, contracts, disputes, buy-sell",
    intro:
      "Most business disputes trace back to a document nobody read closely. Whether you are forming, signing, or already arguing, the contract is usually where the answer is.",
    costs:
      "Formation and contract work is generally quoted as a flat fee. Disputes are billed hourly with an estimated range up front, and we will tell you plainly when a fight would cost more than it can recover.",
    steps: [
      "Send us the agreement or the dispute.",
      "We review the documents, free.",
      "We give you the options and what each costs.",
    ],
    faq: [
      {
        q: "Should a lawyer review a contract before I sign it?",
        a: "Reviewing a contract beforehand costs a fraction of arguing about it afterwards. If the agreement governs money, ownership, or how you exit, it is worth a read.",
      },
      {
        q: "LLC or corporation?",
        a: "It depends on how you intend to take money out, who else is involved, and your tax position, which is worth discussing with both a lawyer and an accountant rather than choosing from a template.",
      },
      {
        q: "A customer will not pay. What are my options?",
        a: "There is usually a sequence: a documented demand, then negotiation, then a claim if it is worth pursuing. The right step depends on the amount owed and what the contract says about disputes.",
      },
      {
        q: "My partner and I are falling out. Is it too late?",
        a: "Not usually, though it gets more expensive the longer it runs. What your operating or shareholder agreement says about exits will shape most of the options.",
      },
    ],
  },
  {
    slug: "personal-injury",
    chip: "Injury",
    title: "Personal injury",
    descriptor: "Crashes, falls, work injuries",
    h1: `Personal injury lawyer in Broward County. ${YEARS_IN_PRACTICE} years. Free case review.`,
    qualifiers: ["Free consultation", "We come to you", "Se habla espanol"],
    handles: [
      "Car, truck, and motorcycle crashes",
      "Slip, trip, and fall injuries",
      "Injuries on the job",
      "Dog bites and premises injuries",
    ],
    urgency: "Injury claims expire. Do not let the clock decide your case.",
    caseTypes: [
      "Car accident",
      "Truck accident",
      "Motorcycle accident",
      "Slip and fall",
      "Work injury",
      "Dog bite",
      "Other injury",
    ],
    clip: "hero-courthouse",
    searchedFor: "Car crashes, falls, dog bites, wrongful death",
    intro:
      "Most injury cases turn on two things: what the medical record says, and how quickly it was created. If someone else caused your injury, the sooner an attorney sees the file, the more of it can still be repaired.",
    costs:
      "Injury matters are commonly handled on a contingency basis, where the fee comes out of any recovery rather than your pocket. Terms vary by case and are set out in writing before you sign. Court costs and case expenses are explained separately.",
    steps: [
      "Send us the crash or incident details.",
      "We request the records and review liability, free.",
      "We tell you what the claim realistically involves.",
    ],
    faq: [
      {
        q: "How long do I have to bring a claim?",
        a: "Florida sets a filing deadline, it is shorter than many people assume, and it was changed in recent years. Do not rely on a number you read somewhere. Confirm which deadline applies to your specific situation.",
      },
      {
        q: "Do I have to give a statement to the other driver's insurer?",
        a: "Generally no. You are usually not required to give a recorded statement to the other side's insurance company, and it is reasonable to say you will follow up after speaking with a lawyer.",
      },
      {
        q: "What if I was partly at fault?",
        a: "Being partly at fault does not automatically end a claim in Florida, though it can reduce or bar recovery depending on the share of fault. How fault is apportioned is often disputed, which is why the early record matters.",
      },
      {
        q: "What if the person who hit me had no insurance?",
        a: "Your own coverage may respond, depending on what you carry. Bring your policy to the first conversation, because what is available is often different from what people expect.",
      },
    ],
  },
];

export function getPractice(slug: string): PracticeArea | undefined {
  return PRACTICE_AREAS.find((p) => p.slug === slug);
}

/** Flat list for the general intake form's case-type select. */
export const CASE_TYPES: string[] = [
  ...PRACTICE_AREAS.map((p) => p.title),
  "Something else",
];

/* ── Navigation ─────────────────────────────────────────────────────── */

// Three-link nav (plus Home, rendered by SiteNav) pinned in the white pill
// on every page alongside the phone and the ink "Free case review" button.
export const NAV_LINKS = [
  { href: "/practice", label: "Practice areas" },
  { href: "/attorneys", label: "Attorneys" },
  { href: "/contact", label: "Contact" },
] as const;

// Everything else the site publishes, reachable from the footer.
export const FOOTER_FIRM_LINKS = [
  { href: "/attorneys", label: "Attorneys" },
  { href: "/results", label: "Notable matters" },
  { href: "/about", label: "About the firm" },
  { href: "/news", label: "Legal news" },
  { href: "/contact", label: "Contact and directions" },
  { href: "/es", label: "Español" },
] as const;

/* ── People ─────────────────────────────────────────────────────────── */

export type Attorney = {
  slug: string;
  /** TODO: the firm has not supplied real names yet. */
  name: string;
  role: string;
  /** Practice slugs this attorney takes. */
  practices: string[];
  years: number;
  badges: string[];
  bio: string;
  /** Full bio paragraphs, used on the bio page when supplied. */
  bioLong?: string[];
  admissions: string[];
  education?: string[];
  /** Self-described focus areas, which can be broader than our five. */
  focus?: string[];
  languages?: string[];
  community: string[];
  photo?: string;
  /** Square crop for the round avatars on the qualifier and thank-you pages. */
  photoSquare?: string;
};

// TODO: placeholder people. The handoff flags attorney names and count as
// still needed from the firm. Replace names, roles, and photos
// before launch; nothing here should ship as-is.
//
// PORTRAIT WARNING: PLACEHOLDER_PORTRAIT is a generated likeness, not a real
// person at this firm. It is fine for design review, but publishing it under
// a named attorney on a live law-firm site would present a fabricated person
// as real, which is misleading to consumers and a bar-advertising problem in
// most states. Swap in real headshots before this site takes traffic.
export const ATTORNEYS: Attorney[] = [
  {
    slug: "tyler-trumbach",
    name: "Tyler Andrew Trumbach, Esq.",
    role: "Principal Attorney",
    practices: ["civil-litigation", "criminal-defense", "business", "family-law", "personal-injury"],
    years: 0, // TODO: admission year not supplied; see YEARS_IN_PRACTICE note
    badges: ["Florida & New York bars", "Federal courts"],
    bio:
      "Tyler Andrew Trumbach is admitted to the bars of both Florida and New York. He is the principal of the Law Offices of Tyler A. Trumbach, P.A., and handles a wide variety of matters while focusing on complex civil litigation and criminal defense.",
    bioLong: [
      "Tyler began his academic career at Columbia University, graduating with a B.A. in Economics and History. While at Columbia he was involved in various political organizations.",
      "He then attended Fordham University School of Law, where he earned his J.D. At Fordham he was an active member of the Urban Law Journal, writing a note analysing the effects of Dodd-Frank on the mortgage market, and took part in the Fordham Criminal Defense Clinic, representing low income clients in Manhattan Criminal Court under the supervision of the clinic professors.",
      "Tyler is the principal of the Law Offices of Tyler A. Trumbach, P.A. He handles a wide variety of cases and focuses on complex civil litigation and criminal defense.",
    ],
    admissions: [
      "The Florida Bar",
      "First Judicial Department of New York",
      "U.S. District Court, Southern District of Florida",
      "U.S. District Court, Middle District of Florida",
    ],
    education: [
      "Fordham University School of Law, Juris Doctor",
      "Columbia University, B.A. History & Economics",
    ],
    focus: [
      "Complex civil litigation",
      "Commercial and business disputes",
      "SEC compliance",
      "Criminal defense",
      "Personal injury",
      "Business restructuring",
      "Family law",
    ],
    languages: ["English"],
    community: [],
    photo: "/media/tyler-trumbach.webp",
    photoSquare: "/media/tyler-trumbach-square.webp",
  },
  {
    slug: "jesmany-jomarron",
    name: "Jesmany Jomarron, Esq.",
    role: "Of Counsel",
    practices: ["civil-litigation", "business", "personal-injury"],
    years: 0, // TODO: admission year not supplied
    badges: ["Trial lawyer", "Se habla espanol"],
    bio:
      "Jesmany Jomarron is a trial lawyer who serves as Of Counsel to the firm, focusing on complex, high exposure litigation.",
    bioLong: [
      "Jesmany Jomarron is a trial lawyer who serves as Of Counsel to the firm, focusing on complex, high exposure litigation.",
      "He handles contested matters involving commercial disputes, insurance and coverage litigation, and cases involving serious personal harm. Mr. Jomarron is brought into matters where the stakes are significant and the case turns on how it is structured and tried.",
      "Over the course of his career he has handled thousands of contested matters and recovered millions of dollars for his clients. His work includes cases resolved through dispositive motion practice, trial, and appeal.",
      "Before representing plaintiffs, Mr. Jomarron represented insurers and corporate defendants, which gives him insight into how high exposure claims are evaluated, defended, and resolved.",
    ],
    admissions: [
      "The Florida Bar",
      "U.S. Court of Appeals, Eleventh Circuit",
      "U.S. District Court, Southern District of Florida",
      "U.S. District Court, Middle District of Florida",
      "U.S. District Court, Northern District of Florida",
    ],
    education: [
      "St. Thomas University School of Law, Juris Doctor, summa cum laude",
      "Florida International University, B.B.A. Finance, magna cum laude",
    ],
    focus: [
      "Complex civil litigation",
      "Commercial and business disputes",
      "Insurance and coverage litigation",
      "Trial strategy and case development",
    ],
    languages: ["English", "Spanish"],
    community: [],
    // No photo: real attorney, no headshot supplied yet.
  },
  {
    slug: "mauricio-padilla",
    name: "Mauricio Padilla, Esq.",
    role: "Of Counsel",
    practices: ["criminal-defense", "civil-litigation", "personal-injury"],
    years: 0, // TODO: admission year not supplied
    badges: ["Trial lawyer", "State and federal courts"],
    bio:
      "Mauricio Padilla is a trial lawyer focused on high stakes criminal defense and complex civil litigation.",
    bioLong: [
      "Mauricio Padilla is a trial lawyer focused on high stakes criminal defense and complex civil litigation.",
      "He represents clients in serious felony and federal matters, including homicide prosecutions, organized criminal activity, and multi defendant cases, as well as catastrophic injury, wrongful death, and civil rights litigation.",
      "Mr. Padilla handles nationally recognised, high profile matters, including representation in the prosecution arising from the murder of Jahseh Onfroy (XXXTentacion) and litigation connected to the murder of Dan Markel, the Florida State University professor killed in a contract killing. He is also currently involved in litigation against Roblox Corporation involving child safety issues, reflecting his work on complex, high exposure cases across multiple jurisdictions.",
      "Alongside his criminal defense practice, Mr. Padilla represents plaintiffs in significant civil actions involving police misconduct, negligent security, and catastrophic personal injury. Across his career he has litigated thousands of contested matters and secured millions of dollars in recoveries for his clients.",
    ],
    admissions: [
      "The Florida Bar",
      "U.S. District Court, Southern District of Florida",
      "U.S. District Court, Middle District of Florida",
      "U.S. District Court, District of Puerto Rico",
    ],
    education: [
      "University of Miami School of Law, Juris Doctor",
      "Florida International University, B.A. Mass Communication",
    ],
    focus: [
      "Criminal defense, state and federal",
      "Civil rights litigation, section 1983",
      "Catastrophic injury and wrongful death",
      "Negligent security and premises liability",
    ],
    community: [],
    // No photo: real attorney, no headshot supplied yet.
  },
];

export function getAttorney(slug: string): Attorney | undefined {
  return ATTORNEYS.find((a) => a.slug === slug);
}

/* ── Office ─────────────────────────────────────────────────────────── */

export const OFFICE = {
  // Confirmed against the Florida Bar member profile. Used verbatim on the homepage,
  // contact page, footer, and in the LocalBusiness structured data.
  street: "3400 Lakeside Dr, Suite 100",
  city: "Miramar",
  region: "FL",
  postalCode: "33027",
  county: "Broward County",
  address: "3400 Lakeside Dr, Suite 100, Miramar, FL 33027",
  perks: ["Se habla espanol", "Accessible entrance"],
  hoursLine: "Mon to Fri, 9 to 6. Evenings and weekends by appointment.",
  hours: [
    ["Office", "Monday to Friday, 9am to 6pm"],
    ["Evenings and weekends", "By appointment"],
    ["Phone intake", "24 hours, every day"],
  ] as [string, string][],
  afterHours: "After hours you reach our answering service, not voicemail.",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent("3400 Lakeside Dr, Suite 100, Miramar, FL 33027"),
};


/* ── Notable matters ────────────────────────────────────────────────── */

/**
 * Matters the firm supplied in its attorneys' own bios. These describe
 * involvement, not outcomes, because no outcomes were supplied.
 *
 * RULE: nothing goes in this list that the firm has not put in writing.
 * Do not add settlement figures, verdict amounts, or win claims without
 * documentation the firm can produce, because Florida Bar rule 4-7.13
 * requires past-results statements to be objectively verifiable.
 */
export type NotableMatter = {
  headline: string;
  detail: string;
  attorneySlug: string;
  practiceSlug: string;
};

export const NOTABLE_MATTERS: NotableMatter[] = [
  {
    headline: "Prosecution arising from the murder of Jahseh Onfroy (XXXTentacion)",
    detail:
      "Representation in one of the most closely followed homicide prosecutions in Florida in recent years.",
    attorneySlug: "mauricio-padilla",
    practiceSlug: "criminal-defense",
  },
  {
    headline: "Litigation connected to the murder of Dan Markel",
    detail:
      "Work connected to the contract killing of the Florida State University law professor, a matter litigated across several years and multiple defendants.",
    attorneySlug: "mauricio-padilla",
    practiceSlug: "criminal-defense",
  },
  {
    headline: "Litigation against Roblox Corporation over child safety",
    detail:
      "Ongoing civil litigation against a major technology platform concerning child safety.",
    attorneySlug: "mauricio-padilla",
    practiceSlug: "civil-litigation",
  },
];

/** Every court the firm's attorneys are admitted in, deduplicated. */
export function allAdmissions(): string[] {
  return [...new Set(ATTORNEYS.flatMap((a) => a.admissions))].sort();
}
