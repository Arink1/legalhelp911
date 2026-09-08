import type { Metadata } from "next";
import { Spectral, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-spectral",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://legalhelp911.com"),
  title: "Trumbach Firm | Talk to a lawyer in the next 5 minutes",
  description:
    "Hurt, arrested, or served papers? 38 years in practice, free consultation, we answer 24/7.",
  openGraph: {
    title: "Trumbach Firm | Talk to a lawyer in the next 5 minutes",
    description:
      "Hurt, arrested, or served papers? 38 years in practice, free consultation, we answer 24/7.",
    // No hard-coded url here: pages that set their own canonical would
    // otherwise all share the homepage URL in their social preview.
    siteName: "Trumbach Firm",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spectral.variable} ${publicSans.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
