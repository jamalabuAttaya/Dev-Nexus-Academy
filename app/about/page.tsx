import type { Metadata } from "next";
import OfficialPage from "../components/OfficialPage";

export const metadata: Metadata = {
  title: "عن المنصة",
  description: "رسالة Dev Nexus Academy ومنهجها في تنظيم المعرفة التقنية.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <OfficialPage
      active="about"
      eyebrow="ABOUT THE NEXUS"
      title={{
        ar: "معرفة تقنية منظمة، بلا ضوضاء.",
        en: "Technology knowledge, organized.",
      }}
      description={{
        ar: "تجمع المنصة المصادر التعليمية المفتوحة في تجربة ثنائية اللغة تنقل المتعلم من الاستكشاف إلى مسار واضح وتطبيق عملي.",
        en: "The platform brings open learning resources into a bilingual experience that moves learners from discovery to a clear, practical path.",
      }}
      sections={[
        {
          title: { ar: "رسالتنا", en: "Our mission" },
          paragraphs: [
            {
              ar: "نؤمن أن الوصول إلى تعليم تقني جيد يجب أن يكون واضحًا ومتاحًا. لذلك ننظم الدورات والكتب العامة والمقالات وخرائط الطريق حسب المجال والمستوى ونوع المصدر.",
              en: "Quality technology education should be clear and accessible. Courses, public books, articles, and roadmaps are organized by discipline, level, and source type.",
            },
          ],
        },
        {
          title: { ar: "كيف نختار المحتوى", en: "How content is selected" },
          paragraphs: [
            {
              ar: "نفضّل المصادر المجانية أو ذات الوصول العام، ونُظهر المصدر الأصلي وحقوقه بوضوح. تُراجع ملاءمة المادة للتخصص ومستواها قبل إضافتها.",
              en: "We prioritize free or public-access resources and clearly identify the original source and rights. Discipline relevance and level are reviewed before inclusion.",
            },
          ],
          points: [
            {
              ar: "20 تخصصًا تقنيًا بتصنيف متسق.",
              en: "20 consistently classified technology disciplines.",
            },
            {
              ar: "تجربة قراءة ومشاهدة داخل المنصة عند السماح بذلك.",
              en: "In-platform reading and playback where providers allow it.",
            },
            {
              ar: "مسارات ثنائية اللغة قابلة لتتبع التقدم.",
              en: "Bilingual roadmaps with progress tracking.",
            },
          ],
        },
        {
          title: { ar: "منهج تجربة التعلم", en: "Learning experience" },
          paragraphs: [
            {
              ar: "تبدأ الرحلة بخريطة طريق، ثم تنتقل إلى دورة مناسبة ومواد قراءة مساندة. يحفظ المتصفح تقدم المسارات محليًا، ويربط الحساب الالتحاقات بخدمة Laravel.",
              en: "A journey starts with a roadmap, continues with a suitable course, and is supported by reading material. Roadmap progress is stored locally, while learner accounts connect enrollments to Laravel.",
            },
          ],
        },
        {
          title: { ar: "معايير الإصدار", en: "Release standards" },
          paragraphs: [
            {
              ar: "نراجع قابلية الاستخدام، العربية والإنجليزية، الاستجابة للشاشات، وضوح الأزرار، سلامة البنية، واختبارات الإنتاج قبل كل إصدار.",
              en: "Every release reviews usability, Arabic and English support, responsive behavior, action clarity, structural integrity, and production checks.",
            },
          ],
        },
      ]}
      aside={{
        title: { ar: "ابدأ من المسار الصحيح", en: "Start with the right path" },
        description: {
          ar: "اختر خريطة طريق واحفظ تقدمك خطوة بخطوة.",
          en: "Choose a roadmap and save your progress step by step.",
        },
        href: "/roadmaps",
        action: { ar: "استكشف المسارات", en: "Explore roadmaps" },
      }}
    />
  );
}
