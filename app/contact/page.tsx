import type { Metadata } from "next";
import OfficialPage from "../components/OfficialPage";

export const metadata: Metadata = {
  title: "التواصل والدعم",
  description: "قنوات التواصل والدعم الخاصة بالمنصة.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <OfficialPage
      eyebrow="CONTACT & SUPPORT"
      title={{
        ar: "لنحافظ على جودة المنصة معًا.",
        en: "Let's keep the platform excellent.",
      }}
      description={{
        ar: "للبلاغات عن المصادر أو اقتراح تخصص أو الاستفسارات التقنية، أرسل التفاصيل عبر ملف المطور الرسمي.",
        en: "For source reports, discipline suggestions, or technical enquiries, send the details through the official developer profile.",
      }}
      sections={[
        {
          title: { ar: "دعم المحتوى", en: "Content support" },
          paragraphs: [
            {
              ar: "أرسل اسم المادة والقسم والرابط عند الإبلاغ عن فيديو أو كتاب أو مقال غير متاح.",
              en: "Include the resource title, section, and URL when reporting an unavailable video, book, or article.",
            },
          ],
        },
        {
          title: {
            ar: "التطوير والشراكات",
            en: "Development and partnerships",
          },
          paragraphs: [
            {
              ar: "للتواصل المهني أو التعاون أو مناقشة تطوير المنصة، استخدم رابط Jamal Abu Attaya المثبت في تذييل كل صفحة.",
              en: "For professional enquiries, collaboration, or platform development, use the Jamal Abu Attaya link in every page footer.",
            },
          ],
        },
        {
          title: { ar: "المساهمة التقنية", en: "Technical contribution" },
          paragraphs: [
            {
              ar: "بعد نشر المستودع على GitHub، استخدم Issues للأخطاء وPull Requests للتحسينات وفق دليل المساهمة.",
              en: "After the repository is published, use GitHub Issues for bugs and Pull Requests for improvements following the contribution guide.",
            },
          ],
        },
      ]}
      aside={{
        title: { ar: "ملف المطور", en: "Developer profile" },
        description: {
          ar: "القناة الرسمية للتواصل المهني.",
          en: "The official channel for professional contact.",
        },
        href: "https://jamalabuattaya-portfolio.netlify.app",
        action: { ar: "فتح الملف", en: "Open profile" },
      }}
    />
  );
}
