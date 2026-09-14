import { OFFICE, FIRM_NAME, PHONE_DISPLAY, EMAIL_DISPLAY, YEARS_IN_PRACTICE, PRACTICE_AREAS } from "@/lib/site";

/**
 * LocalBusiness / LegalService structured data, emitted with the firm's real
 * address so the office shows up in local search and map results.
 *
 * `telephone` reads the firm's real line from lib/site.ts.
 */
export default function LocalBusinessSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: FIRM_NAME,
    url: "https://legalhelp911.com",
    telephone: PHONE_DISPLAY,
    email: EMAIL_DISPLAY,
    address: {
      "@type": "PostalAddress",
      streetAddress: OFFICE.street,
      addressLocality: OFFICE.city,
      addressRegion: OFFICE.region,
      postalCode: OFFICE.postalCode,
      addressCountry: "US",
    },
    areaServed: { "@type": "AdministrativeArea", name: OFFICE.county },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    knowsLanguage: ["en", "es"],
    foundingDate: String(new Date().getFullYear() - YEARS_IN_PRACTICE),
    makesOffer: PRACTICE_AREAS.map((p) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: p.title },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
