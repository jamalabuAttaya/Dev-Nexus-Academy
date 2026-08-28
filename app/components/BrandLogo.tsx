type BrandLogoProps = {
  compact?: boolean;
  inverse?: boolean;
};

export default function BrandLogo({
  compact = false,
  inverse = false,
}: BrandLogoProps) {
  return (
    <span
      className={`nexus-brand ${compact ? "compact" : ""} ${inverse ? "inverse" : ""}`}
      dir="ltr"
    >
      <span className="nexus-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" role="presentation">
          <path className="mark-frame" d="M32 4 56 18v28L32 60 8 46V18L32 4Z" />
          <path
            className="mark-code"
            d="m26 21-10 11 10 11M38 21l10 11-10 11"
          />
          <path className="mark-link" d="M27 32h10" />
          <circle className="mark-node" cx="32" cy="32" r="4" />
          <circle className="mark-signal" cx="48" cy="18" r="2.5" />
        </svg>
      </span>
      {!compact && (
        <span className="brand-word">
          Dev <b>Nexus</b> <em>Academy</em>
        </span>
      )}
    </span>
  );
}
