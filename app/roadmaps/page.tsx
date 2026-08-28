import type { Metadata } from "next";
import PortalHeader from "../components/PortalHeader";
import RoadmapExplorer from "../components/RoadmapExplorer";
import PortalHero from "../components/PortalHero";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "خرائط طريق تخصصات التكنولوجيا | Dev Nexus Academy",
  description:
    "خرائط طريق تفاعلية للويب والبيانات والأمن السيبراني وDevOps وهندسة البرمجيات.",
};

export default function RoadmapsPage() {
  return (
    <main className="portal-page roadmaps-page" id="main-content">
      <PortalHeader active="roadmaps" />
      <PortalHero
        motion="roadmaps"
        kicker="VISUAL DEVELOPER ROADMAPS"
        title={{ ar: "شاهد طريقك.", en: "See your path." }}
        accent={{ ar: "ثم تحرّك نحوه.", en: "Then move through it." }}
        description={{
          ar: "خرائط عقد وفروع نابضة بالحياة داخل Dev Nexus Academy، مع حفظ تقدمك خطوة بخطوة.",
          en: "Living node-and-branch maps inside Dev Nexus Academy, with progress saved step by step.",
        }}
        metrics={[
          {
            value: "16",
            label: { ar: "مسارًا وظيفيًا", en: "career roadmaps" },
          },
          { value: "96", label: { ar: "مرحلة تعلّم", en: "learning stages" } },
          { value: "Local", label: { ar: "حفظ التقدم", en: "progress saved" } },
        ]}
      />
      <div className="portal-container portal-body">
        <RoadmapExplorer />
      </div>
      <SiteFooter />
    </main>
  );
}
