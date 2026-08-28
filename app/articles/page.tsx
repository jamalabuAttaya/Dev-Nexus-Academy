import type { Metadata } from "next";
import ArticleLibrary from "../components/ArticleLibrary";
import PortalHeader from "../components/PortalHeader";
import PortalHero from "../components/PortalHero";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "مقالات البرمجة والتكنولوجيا | Dev Nexus Academy",
  description:
    "مقالات محدثة في جميع تخصصات التكنولوجيا مع قراءة النص الكامل داخل Dev Nexus Academy.",
};

export default function ArticlesPage() {
  return (
    <main className="portal-page articles-page" id="main-content">
      <PortalHeader active="articles" />
      <PortalHero
        motion="articles"
        kicker="FULL IN-PLATFORM READING"
        title={{ ar: "كل فكرة.", en: "Every idea." }}
        accent={{ ar: "تبدأ بشرارة.", en: "Starts with a spark." }}
        description={{
          ar: "مقالات تقنية حية تُفتح وتُقرأ بالكامل داخل قارئ Dev Nexus Academy.",
          en: "Fresh technology articles open and read fully inside the Dev Nexus Academy reader.",
        }}
        metrics={[
          {
            value: "18",
            label: { ar: "مجالًا تقنيًا", en: "technology domains" },
          },
          {
            value: "30+",
            label: { ar: "مقالًا لكل دفعة", en: "articles per batch" },
          },
          {
            value: "AR + EN",
            label: { ar: "واجهة ثنائية اللغة", en: "bilingual interface" },
          },
        ]}
      />
      <div className="portal-container portal-body">
        <ArticleLibrary />
      </div>
      <SiteFooter />
    </main>
  );
}
