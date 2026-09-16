import type { Metadata } from "next";
import { Libre_Baskerville, Karla } from "next/font/google";
import "./globals.css";
import LogoIntro from "@/components/LogoIntro";

// Oak & Brass brand guide: Libre Baskerville for display (headlines,
// wordmark, numerals, phone numbers), Karla for text and UI.
const baskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-baskerville",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://legalhelp911.com"),
  title: "LegalHelp911 | Talk to a lawyer today, not next month",
  description:
    "The Law Offices of Tyler A. Trumbach, P.A. handles criminal defense, family law, civil litigation, business matters, and personal injury from Miramar, Florida. The first case review is free.",
  openGraph: {
    title: "LegalHelp911 | Talk to a lawyer today, not next month",
    description:
      "Criminal defense, family law, civil litigation, business, and personal injury in Broward County. Free first case review. Phone intake 24 hours.",
    siteName: "LegalHelp911",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${baskerville.variable} ${karla.variable}`}>
      <body>
        <LogoIntro />
        {children}
      </body>
    </html>
  );
}
