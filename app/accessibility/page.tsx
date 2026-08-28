import type { Metadata } from "next";
import OfficialPage from "../components/OfficialPage";

export const metadata: Metadata = {
  title: "بيان إمكانية الوصول",
  description: "التزام Dev Nexus Academy بتجربة تعليمية قابلة للوصول.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <OfficialPage
      eyebrow="ACCESSIBILITY STATEMENT"
      title={{
        ar: "التعلّم التقني يجب أن يكون أقرب للجميع.",
        en: "Technology learning should be within everyone's reach.",
      }}
      description={{
        ar: "نطوّر الواجهة لتدعم التنقل بلوحة المفاتيح، قارئات الشاشة، اتجاهي الكتابة، والشاشات المختلفة.",
        en: "We develop the interface to support keyboard navigation, screen readers, both writing directions, and different screen sizes.",
      }}
      updated={{
        ar: "آخر تحديث: 27 أغسطس 2026",
        en: "Last updated: August 27, 2026",
      }}
      sections={[
        {
          title: { ar: "الدعم الحالي", en: "Current support" },
          paragraphs: [
            {
              ar: "تستخدم الصفحات عناصر دلالية، رابط تجاوز إلى المحتوى، عناوين مرتبة، تسميات للأزرار والنماذج، وحالات تركيز مرئية. يتبدل RTL وLTR مع اللغة.",
              en: "Pages use semantic elements, a skip link, ordered headings, labeled controls and forms, and visible focus states. RTL and LTR change with language.",
            },
          ],
        },
        {
          title: { ar: "الوسائط الخارجية", en: "External media" },
          paragraphs: [
            {
              ar: "تختلف خصائص الوصول في الفيديوهات والكتب والمقالات الخارجية. يظهر رابط المصدر كمسار بديل عندما لا يعمل التضمين مع تقنية مساعدة.",
              en: "Accessibility varies across external videos, books, and articles. An original-source link is available when embedding does not work with assistive technology.",
            },
          ],
        },
        {
          title: { ar: "التحسين المستمر", en: "Continuous improvement" },
          paragraphs: [
            {
              ar: "نراجع التباين وأهداف اللمس وترتيب التركيز والاستجابة. تُعامل العوائق المؤثرة على الوصول كأخطاء منتج ذات أولوية.",
              en: "We review contrast, touch targets, focus order, and responsiveness. Material accessibility barriers are prioritized as product defects.",
            },
          ],
        },
      ]}
      aside={{
        title: { ar: "ساعدنا على التحسين", en: "Help us improve" },
        description: {
          ar: "أبلغ عن عائق وصول مع خطوات واضحة.",
          en: "Report an accessibility barrier with clear steps.",
        },
        href: "/contact",
        action: { ar: "التواصل والدعم", en: "Contact support" },
      }}
    />
  );
}
