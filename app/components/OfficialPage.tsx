"use client";

import Link from "next/link";
import PortalHeader from "./PortalHeader";
import SiteFooter from "./SiteFooter";
import { useLanguage } from "./LanguageProvider";

export type BilingualText = { ar: string; en: string };
export type OfficialSection = {
  title: BilingualText;
  paragraphs: BilingualText[];
  points?: BilingualText[];
};

type Props = {
  active?: "about" | "account" | "none";
  eyebrow: string;
  title: BilingualText;
  description: BilingualText;
  updated?: BilingualText;
  sections: OfficialSection[];
  aside?: {
    title: BilingualText;
    description: BilingualText;
    href: string;
    action: BilingualText;
  };
};

export default function OfficialPage({
  active = "none",
  eyebrow,
  title,
  description,
  updated,
  sections,
  aside,
}: Props) {
  const { tr } = useLanguage();

  return (
    <main className="portal-page official-page" id="main-content">
      <PortalHeader active={active} />
      <section className="official-hero">
        <div className="portal-container">
          <span>{eyebrow}</span>
          <h1>{tr(title.ar, title.en)}</h1>
          <p>{tr(description.ar, description.en)}</p>
          {updated && <small>{tr(updated.ar, updated.en)}</small>}
        </div>
      </section>
      <div className="portal-container official-layout">
        <article className="official-content">
          {sections.map((section, index) => (
            <section key={section.title.en}>
              <span className="official-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2>{tr(section.title.ar, section.title.en)}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.en}>{tr(paragraph.ar, paragraph.en)}</p>
                ))}
                {section.points && (
                  <ul>
                    {section.points.map((point) => (
                      <li key={point.en}>{tr(point.ar, point.en)}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </article>
        {aside && (
          <aside className="official-aside">
            <span>DEV NEXUS</span>
            <h2>{tr(aside.title.ar, aside.title.en)}</h2>
            <p>{tr(aside.description.ar, aside.description.en)}</p>
            <Link href={aside.href}>
              {tr(aside.action.ar, aside.action.en)} <b>↗</b>
            </Link>
          </aside>
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
