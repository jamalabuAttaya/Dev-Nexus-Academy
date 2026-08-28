import type { Metadata } from "next";
import OfficialPage from "../components/OfficialPage";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية في Dev Nexus Academy.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <OfficialPage
      eyebrow="PRIVACY POLICY"
      title={{
        ar: "خصوصيتك جزء من جودة المنتج.",
        en: "Privacy is part of product quality.",
      }}
      description={{
        ar: "توضح هذه السياسة البيانات التي تستخدمها المنصة، سبب استخدامها، والخيارات المتاحة لك.",
        en: "This policy explains what data the platform uses, why it is used, and the choices available to you.",
      }}
      updated={{
        ar: "آخر تحديث: 27 أغسطس 2026",
        en: "Last updated: August 27, 2026",
      }}
      sections={[
        {
          title: { ar: "البيانات المحلية", en: "Local data" },
          paragraphs: [
            {
              ar: "تحفظ المنصة تفضيل اللغة وتقدم خرائط الطريق في مساحة التخزين المحلية للمتصفح. يمكن حذف هذه البيانات من إعدادات المتصفح.",
              en: "The platform stores language preference and roadmap progress in browser storage. You can remove this data through browser settings.",
            },
          ],
        },
        {
          title: { ar: "بيانات الحساب", en: "Account data" },
          paragraphs: [
            {
              ar: "عند إنشاء حساب، تعالج خدمة Laravel الاسم والبريد الإلكتروني وكلمة المرور المشفرة وبيانات الالتحاق والتقدم. لا تُخزن كلمات المرور كنص واضح.",
              en: "When you create an account, Laravel processes your name, email, hashed password, enrollments, and progress. Passwords are never stored as plain text.",
            },
          ],
        },
        {
          title: { ar: "الخدمات الخارجية", en: "External services" },
          paragraphs: [
            {
              ar: "تستخدم المنصة YouTube وOpen Library وInternet Archive وDEV Community. قد تستقبل هذه الخدمات معلومات تقنية وفق سياساتها عند تحميل محتواها.",
              en: "The platform uses YouTube, Open Library, Internet Archive, and DEV Community. Those providers may receive technical information under their own policies when content loads.",
            },
          ],
        },
        {
          title: { ar: "الأمان والاحتفاظ", en: "Security and retention" },
          paragraphs: [
            {
              ar: "تستخدم بيئة الإنتاج HTTPS وتقيّد API بالنطاقات المسموحة. تُحتفظ بيانات الحساب ما دام الحساب فعالًا أو حسب المتطلبات التشغيلية والقانونية.",
              en: "Production uses HTTPS and restricts API access to allowed origins. Account data is retained while an account remains active or as operationally and legally required.",
            },
          ],
        },
      ]}
      aside={{
        title: { ar: "هل لديك سؤال؟", en: "Have a question?" },
        description: {
          ar: "راجع الأسئلة الشائعة أو تواصل معنا.",
          en: "Review the FAQ or contact us.",
        },
        href: "/contact",
        action: { ar: "التواصل", en: "Contact" },
      }}
    />
  );
}
