import Link from "next/link";
import BrandLogo from "./BrandLogo";
import LocalizedText from "./LocalizedText";

const portfolioUrl = "https://jamalabuattaya-portfolio.netlify.app";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner footer-official">
        <section className="footer-brand-block">
          <Link className="brand light" href="/" aria-label="Dev Nexus Academy">
            <BrandLogo inverse />
          </Link>
          <p>
            <LocalizedText
              ar="منصة تقنية ثنائية اللغة تساعدك على اكتشاف المسار، اختيار المصدر، وبناء معرفة عملية موثوقة."
              en="A bilingual technology platform for discovering paths, choosing trusted resources, and building practical knowledge."
            />
          </p>
          <span className="footer-status">
            <i />{" "}
            <LocalizedText
              ar="المحتوى متاح عالميًا"
              en="Content available worldwide"
            />
          </span>
        </section>

        <nav className="footer-column" aria-labelledby="footer-learning">
          <strong id="footer-learning">
            <LocalizedText ar="التعلم" en="Learning" />
          </strong>
          <Link href="/courses">
            <LocalizedText ar="الكورسات" en="Courses" />
          </Link>
          <Link href="/books">
            <LocalizedText ar="الكتب المجانية" en="Free books" />
          </Link>
          <Link href="/articles">
            <LocalizedText ar="المقالات" en="Articles" />
          </Link>
          <Link href="/roadmaps">
            <LocalizedText ar="خرائط الطريق" en="Roadmaps" />
          </Link>
        </nav>

        <nav className="footer-column" aria-labelledby="footer-platform">
          <strong id="footer-platform">
            <LocalizedText ar="المنصة" en="Platform" />
          </strong>
          <Link href="/about">
            <LocalizedText ar="عن المنصة" en="About" />
          </Link>
          <Link href="/account">
            <LocalizedText ar="حساب المتعلم" en="Learner account" />
          </Link>
          <Link href="/faq">
            <LocalizedText ar="الأسئلة الشائعة" en="FAQ" />
          </Link>
          <Link href="/contact">
            <LocalizedText ar="تواصل معنا" en="Contact" />
          </Link>
        </nav>

        <nav className="footer-column" aria-labelledby="footer-legal">
          <strong id="footer-legal">
            <LocalizedText ar="قانوني" en="Legal" />
          </strong>
          <Link href="/content-policy">
            <LocalizedText ar="سياسة المحتوى" en="Content policy" />
          </Link>
          <Link href="/privacy">
            <LocalizedText ar="سياسة الخصوصية" en="Privacy" />
          </Link>
          <Link href="/terms">
            <LocalizedText ar="شروط الاستخدام" en="Terms" />
          </Link>
          <Link href="/accessibility">
            <LocalizedText ar="إمكانية الوصول" en="Accessibility" />
          </Link>
        </nav>

        <a
          className="developer-signature"
          href={portfolioUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="developer-mark" aria-hidden="true">
            <b>JA</b>
            <i />
          </span>
          <span>
            <small>
              <LocalizedText
                ar="طُوّرت بعناية بواسطة"
                en="Crafted with care by"
              />
            </small>
            <strong dir="ltr">Jamal Abu Attaya</strong>
          </span>
          <em aria-hidden="true">↗</em>
        </a>

        <div className="footer-bottom">
          <span className="footer-copyright">© 2026 Dev Nexus Academy</span>
          <span>
            <LocalizedText
              ar="معرفة مفتوحة. تعلّم مسؤول."
              en="Open knowledge. Responsible learning."
            />
          </span>
        </div>
      </div>
    </footer>
  );
}
