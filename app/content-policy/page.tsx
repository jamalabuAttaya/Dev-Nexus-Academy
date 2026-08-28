import type { Metadata } from "next";
import OfficialPage from "../components/OfficialPage";

export const metadata: Metadata = {
  title: "سياسة المحتوى والمصادر",
  description: "معايير اختيار المصادر التعليمية ومراجعتها ونسبها.",
  alternates: { canonical: "/content-policy" },
};

export default function ContentPolicyPage() {
  return (
    <OfficialPage
      eyebrow="CONTENT & SOURCING POLICY"
      title={{
        ar: "مصادر واضحة، وتصنيف يمكن الوثوق به.",
        en: "Clear sources, trustworthy organization.",
      }}
      description={{
        ar: "تحدد هذه السياسة كيف تُختار المواد التعليمية، وكيف تُنسب إلى أصحابها، ومتى تُراجع أو تُزال.",
        en: "This policy explains how learning resources are selected, credited, reviewed, and removed.",
      }}
      updated={{
        ar: "آخر تحديث: 27 أغسطس 2026",
        en: "Last updated: August 27, 2026",
      }}
      sections={[
        {
          title: { ar: "معايير الاختيار", en: "Selection standards" },
          paragraphs: [
            {
              ar: "نفضّل المحتوى المنظم والمجاني أو ذي الوصول العام والصادر عن جهة تعليمية أو مجتمع تقني معروف. يُراجع العنوان وصلة المادة بالتخصص ومستواها.",
              en: "We prioritize structured, free or public-access material from recognized educators, institutions, or technology communities. Titles, relevance, and level are reviewed.",
            },
          ],
        },
        {
          title: { ar: "نسبة الحقوق", en: "Attribution and rights" },
          paragraphs: [
            {
              ar: "تبقى ملكية المحتوى لمؤلفيه وناشريه. تعرض المنصة المصدر الأصلي ولا تعيد استضافة الملفات المحمية. يُستخدم التضمين فقط عندما يتيحه المزود.",
              en: "Content remains owned by its authors and publishers. The platform shows original sources and does not re-host protected files. Embedding is used only when providers allow it.",
            },
          ],
        },
        {
          title: { ar: "الدقة والتحديث", en: "Accuracy and freshness" },
          paragraphs: [
            {
              ar: "تتغير التقنيات والروابط بسرعة. تُراجع القوائم مع الإصدارات، ويبقى رابط المصدر ظاهرًا ليتحقق المتعلم من المعلومات الحساسة زمنيًا.",
              en: "Technology and links change quickly. Catalogs are reviewed with releases, and original-source links remain visible for time-sensitive verification.",
            },
          ],
        },
        {
          title: { ar: "الإبلاغ والتصحيح", en: "Reports and corrections" },
          paragraphs: [
            {
              ar: "تُراجع بلاغات الروابط المعطلة أو التصنيف غير الدقيق أو حقوق النشر. أرسل اسم المادة ورابطها والقسم الذي ظهرت فيه.",
              en: "Reports about broken links, inaccurate classification, or rights concerns are reviewed. Include the resource title, URL, and section.",
            },
          ],
        },
      ]}
      aside={{
        title: { ar: "وجدت مشكلة في مصدر؟", en: "Found a source issue?" },
        description: {
          ar: "أرسل التفاصيل ليتم فحصها.",
          en: "Send the details for review.",
        },
        href: "/contact",
        action: { ar: "إرسال بلاغ", en: "Report an issue" },
      }}
    />
  );
}
