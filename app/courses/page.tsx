import type { Metadata } from "next";
import PortalHeader from "../components/PortalHeader";
import VideoExplorer from "../components/VideoExplorer";
import PortalHero from "../components/PortalHero";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "الكورسات والفيديو | Dev Nexus Academy",
  description:
    "كورسات فيديو شاملة لجميع مجالات التكنولوجيا تعمل داخل Dev Nexus Academy.",
};

export default function CoursesPage() {
  return (
    <main className="portal-page" id="main-content">
      <PortalHeader active="courses" />
      <PortalHero
        motion="courses"
        kicker="THE COMPLETE TECHNOLOGY HUB"
        title={{ ar: "كل التكنولوجيا.", en: "Every technology." }}
        accent={{ ar: "تنبض أمامك.", en: "Alive in one hub." }}
        description={{
          ar: "لكل تخصص هويته الحركية الخاصة، من تدفّق البيانات إلى درع الأمن وحركة الكود.",
          en: "Every discipline has its own motion identity—from data streams to cyber shields and flowing code.",
        }}
        metrics={[
          {
            value: "20",
            label: { ar: "قسمًا رسميًا", en: "official sections" },
          },
          {
            value: "7+",
            label: { ar: "كورسات لكل قسم", en: "courses per section" },
          },
          {
            value: "AR + EN",
            label: { ar: "واجهة ثنائية اللغة", en: "bilingual interface" },
          },
        ]}
      />
      <div className="portal-container portal-body">
        <VideoExplorer />
      </div>
      <SiteFooter />
    </main>
  );
}
