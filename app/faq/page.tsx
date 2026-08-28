import type { Metadata } from "next";
import OfficialPage from "../components/OfficialPage";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات واضحة عن المحتوى والحسابات والخصوصية.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <OfficialPage
      eyebrow="HELP CENTER"
      title={{ ar: "الأسئلة الشائعة", en: "Frequently asked questions" }}
      description={{
        ar: "إجابات واضحة عن المحتوى والحسابات والخصوصية وطريقة التعلم.",
        en: "Clear answers about content, accounts, privacy, and learning.",
      }}
      sections={[
        {
          title: {
            ar: "هل استخدام المنصة مجاني؟",
            en: "Is the platform free?",
          },
          paragraphs: [
            {
              ar: "نعم. تصفح الكورسات والكتب العامة والمقالات وخرائط الطريق متاح دون اشتراك مدفوع. قد تطبق المصادر الخارجية شروطها الخاصة.",
              en: "Yes. Courses, public books, articles, and roadmaps are available without a paid subscription. External providers may apply their own terms.",
            },
          ],
        },
        {
          title: { ar: "هل أحتاج إلى حساب؟", en: "Do I need an account?" },
          paragraphs: [
            {
              ar: "لا تحتاج إلى حساب للتصفح. الحساب مخصص لحفظ الالتحاقات والتقدم المتصل بخدمة Laravel.",
              en: "No account is required for browsing. Accounts are used for enrollments and progress connected to Laravel.",
            },
          ],
        },
        {
          title: {
            ar: "لماذا لا يعمل مصدر أحيانًا؟",
            en: "Why might a resource be unavailable?",
          },
          paragraphs: [
            {
              ar: "قد يغيّر الناشر صلاحية التضمين أو يحذف المادة أو يقيّدها جغرافيًا. استخدم رابط المصدر الأصلي الظاهر مع المادة.",
              en: "Publishers may change embedding permissions, remove material, or restrict it by region. Use the original-source link shown with the item.",
            },
          ],
        },
        {
          title: {
            ar: "أين يُحفظ تقدم المسارات؟",
            en: "Where is roadmap progress saved?",
          },
          paragraphs: [
            {
              ar: "يُحفظ تقدم خرائط الطريق محليًا في متصفح الجهاز الحالي. مسح بيانات الموقع يحذف هذا التقدم.",
              en: "Roadmap progress is stored locally in the current browser. Clearing site data removes it.",
            },
          ],
        },
        {
          title: {
            ar: "هل تمنح المنصة شهادات؟",
            en: "Does the platform issue certificates?",
          },
          paragraphs: [
            {
              ar: "لا تصدر المنصة حاليًا شهادات اعتماد. هدفها تنظيم المصادر وبناء رحلة تعلم واضحة.",
              en: "The platform does not currently issue accredited certificates. It organizes resources into a clear learning journey.",
            },
          ],
        },
      ]}
      aside={{
        title: { ar: "لم تجد الإجابة؟", en: "Still need an answer?" },
        description: {
          ar: "تواصل معنا مع تفاصيل سؤالك.",
          en: "Contact us with your question details.",
        },
        href: "/contact",
        action: { ar: "تواصل معنا", en: "Contact us" },
      }}
    />
  );
}
