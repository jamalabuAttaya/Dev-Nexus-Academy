type LocalizedTextProps = {
  ar: React.ReactNode;
  en: React.ReactNode;
};

/**
 * Renders both translations as server HTML. LanguageProvider only changes
 * html[lang], so static home sections do not need client-side hydration.
 */
export default function LocalizedText({ ar, en }: LocalizedTextProps) {
  return (
    <>
      <span className="localized-copy localized-copy-ar" lang="ar">
        {ar}
      </span>
      <span className="localized-copy localized-copy-en" lang="en">
        {en}
      </span>
    </>
  );
}
