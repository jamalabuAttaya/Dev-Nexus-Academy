"use client";

import { useLanguage } from "./LanguageProvider";
import MotionScene from "./MotionScene";

type BilingualText = { ar: string; en: string };
type Metric = { value: string; label: BilingualText };

export default function PortalHero({
  kicker,
  title,
  accent,
  description,
  metrics,
  motion,
}: {
  kicker: string;
  title: BilingualText;
  accent: BilingualText;
  description: BilingualText;
  metrics: Metric[];
  motion: "courses" | "books" | "articles" | "roadmaps";
}) {
  const { tr } = useLanguage();
  return (
    <section className={`portal-hero compact portal-hero-${motion}`}>
      <MotionScene variant={motion} />
      <div className="portal-container portal-hero-grid">
        <div>
          <span className="portal-kicker">{kicker}</span>
          <h1>
            {tr(title.ar, title.en)}
            <br />
            <em>{tr(accent.ar, accent.en)}</em>
          </h1>
          <p>{tr(description.ar, description.en)}</p>
        </div>
        <div className="portal-metrics">
          {metrics.map((metric) => (
            <div key={metric.value}>
              <strong>{metric.value}</strong>
              <span>{tr(metric.label.ar, metric.label.en)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
