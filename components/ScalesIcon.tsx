// Line-art scales of justice. Inherits color via currentColor so it can
// render brass in the header and as a faint watermark on dark sections.
export default function ScalesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* finial */}
      <circle cx="32" cy="7" r="2.5" fill="currentColor" stroke="none" />
      {/* column */}
      <path d="M32 10v40" />
      {/* beam */}
      <path d="M12 15h40" />
      {/* left straps and pan */}
      <path d="M12 15 6 30M12 15l6 15" />
      <path d="M4 30a8 8 0 0 0 16 0" />
      {/* right straps and pan */}
      <path d="M52 15l-6 15M52 15l6 15" />
      <path d="M44 30a8 8 0 0 0 16 0" />
      {/* pedestal */}
      <path d="M32 50l-7 5h14z" />
      <path d="M20 55h24" />
    </svg>
  );
}
