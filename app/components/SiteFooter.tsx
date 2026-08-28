"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import BrandLogo from "./BrandLogo";

const portfolioUrl = "https://jamalabuattaya-portfolio.netlify.app";

export default function SiteFooter() {
  const { tr } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="shell footer-inner footer-official">
        <section className="footer-brand-block">
          <Link
            className="brand light"
            href="/"
            aria-label={tr(
              "Dev Nexus Academy — الرئيسية",
              "Dev Nexus Academy — Home",
            )}
          >
            <BrandLogo inverse />
          </Link>
          <p>
            {tr(
              "منصة تقنية ثنائية اللغة تساعدك على اكتشاف المسار، اختيار المصدر، وبناء معرفة عملية موثوقة.",
              "A bilingual technology platform for discovering paths, choosing trusted resources, and building practical knowledge.",
            )}
          </p>
          <span className="footer-status">
            <i /> {tr("المحتوى متاح عالميًا", "Content available worldwide")}
          </span>
        </section>
        <nav className="footer-column" aria-label={tr("التعلم", "Learning")}>
          <strong>{tr("التعلم", "Learning")}</strong>
          <Link href="/courses">{tr("الكورسات", "Courses")}</Link>
          <Link href="/books">{tr("الكتب المجانية", "Free books")}</Link>
          <Link href="/articles">{tr("المقالات", "Articles")}</Link>
          <Link href="/roadmaps">{tr("خرائط الطريق", "Roadmaps")}</Link>
        </nav>
        <nav className="footer-column" aria-label={tr("المنصة", "Platform")}>
          <strong>{tr("المنصة", "Platform")}</strong>
          <Link href="/about">{tr("عن المنصة", "About")}</Link>
          <Link href="/account">{tr("حساب المتعلم", "Learner account")}</Link>
          <Link href="/faq">{tr("الأسئلة الشائعة", "FAQ")}</Link>
          <Link href="/contact">{tr("تواصل معنا", "Contact")}</Link>
        </nav>
        <nav className="footer-column" aria-label={tr("قانوني", "Legal")}>
          <strong>{tr("قانوني", "Legal")}</strong>
          <Link href="/content-policy">
            {tr("سياسة المحتوى", "Content policy")}
          </Link>
          <Link href="/privacy">{tr("سياسة الخصوصية", "Privacy")}</Link>
          <Link href="/terms">{tr("شروط الاستخدام", "Terms")}</Link>
          <Link href="/accessibility">
            {tr("إمكانية الوصول", "Accessibility")}
          </Link>
        </nav>
        <a
          className="developer-signature"
          href={portfolioUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={tr(
            "زيارة ملف مطور المنصة جمال أبو عطايا",
            "Visit platform developer Jamal Abu Attaya's portfolio",
          )}
        >
          <span className="developer-mark" aria-hidden="true">
            <b>JA</b>
            <i />
          </span>
          <span>
            <small>{tr("طُوّرت بعناية بواسطة", "Crafted with care by")}</small>
            <strong dir="ltr">Jamal Abu Attaya</strong>
          </span>
          <em aria-hidden="true">↗</em>
        </a>
        <div className="footer-bottom">
          <span className="footer-copyright">© 2026 Dev Nexus Academy</span>
          <span>
            {tr(
              "معرفة مفتوحة. تعلّم مسؤول.",
              "Open knowledge. Responsible learning.",
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
