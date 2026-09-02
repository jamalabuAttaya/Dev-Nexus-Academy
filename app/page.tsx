import Link from "next/link";
import CoursePreviewButton from "./components/CoursePreviewButton";
import DeferredFeaturedCourses from "./components/DeferredFeaturedCourses";
import DeferredResourceHub from "./components/DeferredResourceHub";
import HeroCodeDemo from "./components/HeroCodeDemo";
import { ArrowIcon } from "./components/HomeIcons";
import HomeNavigation from "./components/HomeNavigation";
import HomeStaticSections from "./components/HomeStaticSections";
import LocalizedText from "./components/LocalizedText";
import MotionScene from "./components/MotionScene";
import SiteFooter from "./components/SiteFooter";
import { homeCourses } from "./data/home";

export default function Home() {
  return (
    <main id="main-content">
      <HomeNavigation />

      <section className="hero" id="top">
        <MotionScene variant="home" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="shell hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              <span />{" "}
              <LocalizedText
                ar="برمجة · أمن · بيانات · Cloud"
                en="Programming · Security · Data · Cloud"
              />
            </div>
            <h1>
              <LocalizedText ar="ادخل نقطة اتصال" en="Enter the nexus of" />
              <br />
              <em>
                <LocalizedText ar="المستقبل الرقمي." en="digital creation." />
              </em>
            </h1>
            <p>
              <LocalizedText
                ar="في Dev Nexus Academy لا تشاهد التقنية فقط؛ بل تعيشها داخل تجربة كودية نابضة تربط البرمجة والأمن والبيانات والسحابة."
                en="At Dev Nexus Academy, you do not just watch technology—you experience it through a living code universe connecting programming, security, data, and cloud."
              />
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/courses">
                <LocalizedText ar="ابدأ الاستكشاف" en="Start exploring" />{" "}
                <ArrowIcon />
              </Link>
              <CoursePreviewButton course={homeCourses[2]} />
            </div>
            <div className="student-proof">
              <div className="avatar-stack" aria-hidden="true">
                <span>س</span>
                <span>م</span>
                <span>ع</span>
                <span>ن</span>
              </div>
              <p>
                <strong>20</strong>{" "}
                <LocalizedText
                  ar="قسمًا رسميًا في تجربة تعلم واحدة"
                  en="official sections in one learning experience"
                />
              </p>
            </div>
          </div>

          <div className="hero-visual" aria-labelledby="hero-visual-label">
            <span className="sr-only" id="hero-visual-label">
              <LocalizedText
                ar="نموذج بصري لتجربة التعلم"
                en="Visual preview of the learning experience"
              />
            </span>
            <HeroCodeDemo />
            <div className="floating-card progress-card">
              <span className="mini-icon">↗</span>
              <div>
                <small>
                  <LocalizedText ar="تعلّم منظم" en="Structured learning" />
                </small>
                <strong>
                  13 <LocalizedText ar="مجالًا" en="fields" />
                </strong>
              </div>
              <svg viewBox="0 0 80 34" aria-hidden="true">
                <path d="M2 31C14 27 14 22 25 23c10 1 10-12 22-9 11 3 12-9 31-12" />
              </svg>
            </div>
            <div className="floating-card badge-card">
              <span>✓</span>
              <div>
                <small>
                  <LocalizedText ar="محتوى موثوق" en="Trusted content" />
                </small>
                <strong>
                  <LocalizedText ar="مصادر مفتوحة" en="Open resources" />
                </strong>
              </div>
            </div>
            <div className="tech-tag tag-react">React</div>
            <div className="tech-tag tag-laravel">Laravel</div>
          </div>
        </div>

        <div className="trust-strip">
          <div className="shell trust-inner">
            <span>
              <LocalizedText
                ar="مجالات تقنية عملية في مكان واحد"
                en="Practical technology fields in one place"
              />
            </span>
            <b>JavaScript</b>
            <b>React</b>
            <b>Python</b>
            <b>Data Analytics</b>
            <b>Software Design</b>
            <b>Laravel</b>
          </div>
        </div>
      </section>

      <DeferredResourceHub />
      <DeferredFeaturedCourses />
      <HomeStaticSections />
      <SiteFooter />
    </main>
  );
}
