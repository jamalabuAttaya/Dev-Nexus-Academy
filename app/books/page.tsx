import type { Metadata } from "next";
import BookLibrary from "../components/BookLibrary";
import PortalHeader from "../components/PortalHeader";
import PortalHero from "../components/PortalHero";
import SiteFooter from "../components/SiteFooter";

export const metadata: Metadata = {
  title: "مكتبة كتب البرمجة والتكنولوجيا | Dev Nexus Academy",
  description:
    "مكتبة ضخمة من كتب التكنولوجيا المجانية فقط، مع القراءة والتنزيل من داخل Dev Nexus Academy.",
};

export default function BooksPage() {
  return (
    <main className="portal-page books-page" id="main-content">
      <PortalHeader active="books" />
      <PortalHero
        motion="books"
        kicker="OPEN LIBRARY · INTERNET ARCHIVE"
        title={{ ar: "افتح المعرفة.", en: "Open knowledge." }}
        accent={{ ar: "واجعلها تتحرك.", en: "Let it move you." }}
        description={{
          ar: "كتب عامة مجانية تتحول إلى مساحة قراءة حية داخل Dev Nexus Academy.",
          en: "Free public-access books become a living reading space inside Dev Nexus Academy.",
        }}
        metrics={[
          {
            value: "40+",
            label: { ar: "نتيجة لكل دفعة", en: "results per page" },
          },
          {
            value: "Public",
            label: { ar: "وصول عام فقط", en: "public access only" },
          },
          {
            value: "AR + EN",
            label: { ar: "واجهة ثنائية اللغة", en: "bilingual interface" },
          },
        ]}
      />
      <div className="portal-container portal-body">
        <BookLibrary />
      </div>
      <SiteFooter />
    </main>
  );
}
