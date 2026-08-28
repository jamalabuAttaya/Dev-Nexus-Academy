import type { Metadata } from "next";
import OfficialPage from "../components/OfficialPage";

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description: "شروط استخدام Dev Nexus Academy والمحتوى الخارجي.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <OfficialPage
      eyebrow="TERMS OF USE"
      title={{
        ar: "تعلّم مفتوح، واستخدام مسؤول.",
        en: "Open learning, responsible use.",
      }}
      description={{
        ar: "باستخدام المنصة فإنك توافق على هذه الشروط وعلى احترام حقوق ناشري المحتوى ومجتمع المتعلمين.",
        en: "By using the platform, you agree to these terms and to respect content publishers and the learning community.",
      }}
      updated={{
        ar: "آخر تحديث: 27 أغسطس 2026",
        en: "Last updated: August 27, 2026",
      }}
      sections={[
        {
          title: { ar: "الغرض التعليمي", en: "Educational purpose" },
          paragraphs: [
            {
              ar: "تقدم المنصة فهرسة وتجربة تعلم تقنية. لا تمنح شهادات اعتماد ولا تضمن نتيجة مهنية محددة.",
              en: "The platform provides technology curation and a learning experience. It does not issue accredited certificates or guarantee a career outcome.",
            },
          ],
        },
        {
          title: {
            ar: "المحتوى الخارجي والحقوق",
            en: "External content and rights",
          },
          paragraphs: [
            {
              ar: "تبقى ملكية الفيديوهات والكتب والمقالات لمصادرها الأصلية. العرض المضمّن أو الربط لا ينقل الملكية إلى المنصة.",
              en: "Videos, books, and articles remain the property of their original sources. Embedding or linking does not transfer ownership.",
            },
          ],
        },
        {
          title: {
            ar: "الحسابات والاستخدام",
            en: "Accounts and acceptable use",
          },
          paragraphs: [
            {
              ar: "أنت مسؤول عن حماية بيانات الدخول. يُمنع الوصول غير المصرح به أو تعطيل الخدمة أو إساءة استخدام واجهات API.",
              en: "You are responsible for protecting sign-in credentials. Unauthorized access, service disruption, and API abuse are prohibited.",
            },
          ],
        },
        {
          title: {
            ar: "التوفر وحدود المسؤولية",
            en: "Availability and liability",
          },
          paragraphs: [
            {
              ar: "قد تتغير المصادر الخارجية أو تتوقف. المواد مقدمة كما هي؛ تحقّق من المعلومات الحساسة في الوثائق الرسمية قبل تطبيقها على أنظمة إنتاج.",
              en: "External sources may change or become unavailable. Materials are provided as-is; verify sensitive information in official documentation before production use.",
            },
          ],
        },
      ]}
      aside={{
        title: { ar: "حقوق واضحة", en: "Clear sourcing" },
        description: {
          ar: "ستجد رابط المصدر الأصلي بجوار كل مادة خارجية.",
          en: "An original-source link is shown with each external resource.",
        },
        href: "/content-policy",
        action: { ar: "سياسة المحتوى", en: "Content policy" },
      }}
    />
  );
}
