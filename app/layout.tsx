import type { Metadata } from "next";
import { Sofia_Sans } from "next/font/google";
import "./globals.css";

// One family for the whole site. Sofia Sans is the open substitute for the
// design's MarkForMC, and it is variable, which matters because body copy
// sits at weight 450, a half step.
const sofia = Sofia_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-sofia",
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
    <html lang="en" className={sofia.variable}>
      <body>{children}</body>
    </html>
  );
}
