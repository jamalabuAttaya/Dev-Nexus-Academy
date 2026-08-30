"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ResourceHub from "./components/ResourceHub";
import { LanguageSwitch, useLanguage } from "./components/LanguageProvider";
import MotionScene from "./components/MotionScene";
import SiteFooter from "./components/SiteFooter";
import BrandLogo from "./components/BrandLogo";

type Course = {
  id: number;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  categoryId: string;
  level: string;
  levelEn: string;
  lessons: number;
  hours: string;
  hoursEn: string;
  accent: string;
  code: string;
  description: string;
  descriptionEn: string;
};

const courses: Course[] = [
  {
    id: 1,
    title: "أساسيات HTML و CSS",
    titleEn: "HTML & CSS Foundations",
    category: "تطوير الويب",
    categoryEn: "Web Development",
    categoryId: "web",
    level: "مبتدئ",
    levelEn: "Beginner",
    lessons: 24,
    hours: "8 ساعات",
    hoursEn: "8 hours",
    accent: "mint",
    code: "</>",
    description:
      "ابنِ صفحات متجاوبة من الصفر وتعلّم أساسيات الويب الدلالية وتنسيق الواجهات الحديثة.",
    descriptionEn:
      "Build responsive pages from scratch while learning semantic HTML and modern CSS layout.",
  },
  {
    id: 2,
    title: "JavaScript من الصفر",
    titleEn: "JavaScript from Scratch",
    category: "جافاسكربت",
    categoryEn: "JavaScript",
    categoryId: "javascript",
    level: "مبتدئ",
    levelEn: "Beginner",
    lessons: 36,
    hours: "14 ساعة",
    hoursEn: "14 hours",
    accent: "yellow",
    code: "JS",
    description:
      "افهم المتغيرات والدوال وDOM والبرمجة غير المتزامنة عبر تمارين ومشاريع قصيرة.",
    descriptionEn:
      "Understand variables, functions, the DOM, and asynchronous programming through focused practice.",
  },
  {
    id: 3,
    title: "React للتطبيقات الحديثة",
    titleEn: "React for Modern Applications",
    category: "React",
    categoryEn: "React",
    categoryId: "react",
    level: "متوسط",
    levelEn: "Intermediate",
    lessons: 42,
    hours: "18 ساعة",
    hoursEn: "18 hours",
    accent: "blue",
    code: "⚛",
    description:
      "أنشئ تطبيقات React عملية باستخدام المكوّنات وHooks وإدارة الحالة وربط الواجهات البرمجية.",
    descriptionEn:
      "Create practical React apps with components, Hooks, state management, and API integration.",
  },
  {
    id: 4,
    title: "Laravel API باحتراف",
    titleEn: "Professional Laravel APIs",
    category: "Laravel",
    categoryEn: "Laravel",
    categoryId: "laravel",
    level: "متوسط",
    levelEn: "Intermediate",
    lessons: 38,
    hours: "16 ساعة",
    hoursEn: "16 hours",
    accent: "coral",
    code: "L",
    description:
      "طوّر REST API آمنة باستخدام Laravel وSanctum وقواعد البيانات وسياسات الصلاحيات.",
    descriptionEn:
      "Develop secure REST APIs with Laravel, Sanctum, databases, validation, and authorization policies.",
  },
  {
    id: 5,
    title: "TypeScript للمطورين",
    titleEn: "TypeScript for Developers",
    category: "جافاسكربت",
    categoryEn: "JavaScript",
    categoryId: "javascript",
    level: "متوسط",
    levelEn: "Intermediate",
    lessons: 28,
    hours: "10 ساعات",
    hoursEn: "10 hours",
    accent: "violet",
    code: "TS",
    description:
      "اكتب شيفرة أكثر أمانًا ووضوحًا وتعلّم الأنواع والواجهات والأنماط المتقدمة.",
    descriptionEn:
      "Write safer, clearer code while learning types, interfaces, generics, and advanced patterns.",
  },
  {
    id: 6,
    title: "مشروع Full Stack عملي",
    titleEn: "Practical Full-Stack Project",
    category: "مشاريع",
    categoryEn: "Projects",
    categoryId: "projects",
    level: "متقدم",
    levelEn: "Advanced",
    lessons: 32,
    hours: "22 ساعة",
    hoursEn: "22 hours",
    accent: "cream",
    code: "{•}",
    description:
      "ابنِ منصة تعليم مصغّرة بواجهة React وخلفية Laravel، من التخطيط حتى النشر.",
    descriptionEn:
      "Build a compact learning platform with React and Laravel, from planning through deployment.",
  },
];

const filters = [
  { id: "all", ar: "الكل", en: "All" },
  { id: "web", ar: "تطوير الويب", en: "Web Development" },
  { id: "javascript", ar: "جافاسكربت", en: "JavaScript" },
  { id: "react", ar: "React", en: "React" },
  { id: "laravel", ar: "Laravel", en: "Laravel" },
  { id: "projects", ar: "مشاريع", en: "Projects" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 7 8 5-8 5V7Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export default function Home() {
  const { language, tr } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [codeRan, setCodeRan] = useState(false);

  const visibleCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesFilter =
        activeFilter === "all" || course.categoryId === activeFilter;
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.titleEn.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.categoryEn.toLowerCase().includes(query) ||
        course.level.toLowerCase().includes(query) ||
        course.levelEn.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  useEffect(() => {
    if (!selectedCourse) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCourse(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedCourse]);

  const scrollToCourses = () => {
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main id="main-content">
      <nav
        className="site-nav"
        aria-label={tr("التنقل الرئيسي", "Primary navigation")}
      >
        <div className="shell nav-inner">
          <Link
            className="brand"
            href="/"
            aria-label="Dev Nexus Academy - الرئيسية"
          >
            <BrandLogo inverse />
          </Link>

          <button
            className="menu-button"
            type="button"
            aria-label={tr("فتح القائمة", "Open menu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
          <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            <Link href="/courses" onClick={() => setMenuOpen(false)}>
              {tr("الكورسات والفيديو", "Courses & video")}
            </Link>

            <Link href="/books" onClick={() => setMenuOpen(false)}>
              {tr("مكتبة الكتب", "Free books")}
            </Link>

            <Link href="/articles" onClick={() => setMenuOpen(false)}>
              {tr("المقالات", "Articles")}
            </Link>

            <Link href="/roadmaps" onClick={() => setMenuOpen(false)}>
              {tr("خرائط الطريق", "Roadmaps")}
            </Link>

            <Link href="/about" onClick={() => setMenuOpen(false)}>
              {tr("عن المنصة", "About")}
            </Link>
          </div>

          <div className="nav-actions">
            <LanguageSwitch compact />
            <Link className="text-button" href="/account">
              {tr("حسابي", "My account")}
            </Link>
            <button
              className="button button-small"
              type="button"
              onClick={scrollToCourses}
            >
              {tr("ابدأ التعلم", "Start learning")}
            </button>
          </div>
        </div>
      </nav>

      <section className="hero" id="top">
        <MotionScene variant="home" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="shell hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              <span />{" "}
              {tr(
                "برمجة · أمن · بيانات · Cloud",
                "Programming · Security · Data · Cloud",
              )}
            </div>
            <h1>
              {tr("ادخل نقطة اتصال", "Enter the nexus of")}
              <br />
              <em>{tr("المستقبل الرقمي.", "digital creation.")}</em>
            </h1>
            <p>
              {tr(
                "في Dev Nexus Academy لا تشاهد التقنية فقط؛ بل تعيشها داخل تجربة كودية نابضة تربط البرمجة والأمن والبيانات والسحابة.",
                "At Dev Nexus Academy, you do not just watch technology—you experience it through a living code universe connecting programming, security, data, and cloud.",
              )}
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/courses">
                {tr("ابدأ الاستكشاف", "Start exploring")} <ArrowIcon />
              </Link>
              <button
                className="video-button"
                type="button"
                onClick={() => setSelectedCourse(courses[2])}
              >
                <span>
                  <PlayIcon />
                </span>{" "}
                {tr("شاهد كيف نتعلّم", "See how we learn")}
              </button>
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
                {tr(
                  "قسمًا رسميًا في تجربة تعلم واحدة",
                  "official sections in one learning experience",
                )}
              </p>
            </div>
          </div>

          <div
            className="hero-visual"
            aria-label={tr(
              "نموذج بصري لتجربة التعلم",
              "Visual preview of the learning experience",
            )}
          >
            <div className="code-card">
              <div className="window-bar">
                <span />
                <span />
                <span />
                <small>lesson.jsx</small>
              </div>
              <pre dir="ltr">
                <code>
                  <span className="pink">const</span>{" "}
                  <span className="blue">Nexus</span> ={" "}
                  <span className="pink">async</span> () =&gt; {"{"}
                  {"\n"} <span className="pink">const</span> skill ={" "}
                  <span className="pink">await</span> learn();{"\n"}{" "}
                  <span className="pink">return</span> &lt;
                  <span className="lime">Future</span>
                  {"\n"} poweredBy=
                  <span className="amber">{`"curiosity"`}</span>
                  {"\n"} level={"{"}skill + <span className="blue">1</span>
                  {"}"}
                  {"\n"} /&gt;;{"\n"}
                  {"}"};
                </code>
              </pre>
              <div
                className={`run-row ${codeRan ? "is-running" : ""}`}
                aria-live="polite"
              >
                <span className="success-dot" />{" "}
                {codeRan
                  ? tr(
                      "البيئة جاهزة — ابدأ التعلّم",
                      "Environment ready — start learning",
                    )
                  : tr("الكود جاهز للتجربة", "Code ready to run")}
                <button
                  type="button"
                  aria-label={tr("تشغيل نموذج الكود", "Run code preview")}
                  onClick={() => setCodeRan((value) => !value)}
                >
                  <PlayIcon />
                </button>
              </div>
            </div>
            <div className="floating-card progress-card">
              <span className="mini-icon">↗</span>
              <div>
                <small>{tr("تعلّم منظم", "Structured learning")}</small>
                <strong>13 {tr("مجالًا", "fields")}</strong>
              </div>
              <svg viewBox="0 0 80 34" aria-hidden="true">
                <path d="M2 31C14 27 14 22 25 23c10 1 10-12 22-9 11 3 12-9 31-12" />
              </svg>
            </div>
            <div className="floating-card badge-card">
              <span>✓</span>
              <div>
                <small>{tr("محتوى موثوق", "Trusted content")}</small>
                <strong>{tr("مصادر مفتوحة", "Open resources")}</strong>
              </div>
            </div>
            <div className="tech-tag tag-react">React</div>
            <div className="tech-tag tag-laravel">Laravel</div>
          </div>
        </div>
        <div className="trust-strip">
          <div className="shell trust-inner">
            <span>
              {tr(
                "مجالات تقنية عملية في مكان واحد",
                "Practical technology fields in one place",
              )}
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

      <ResourceHub />

      <section className="courses-section section" id="courses">
        <div className="shell">
          <div className="section-heading">
            <div>
              <div className="eyebrow dark">
                <span />{" "}
                {tr("دورات البداية المميزة", "Featured starting points")}
              </div>
              <h2>
                {tr("ابدأ من الأساس.", "Build the foundations.")}
                <br />
                <em>{tr("ثم اختر تخصصك.", "Then choose your field.")}</em>
              </h2>
            </div>
            <p>
              {tr(
                "هذه مجموعة البداية؛ مركز الكورسات الكامل يضم 37 مادة فريدة موزعة على 20 قسمًا رسميًا، بحد أدنى 7 مواد في كل قسم.",
                "This is the starter collection; the full course center contains 37 unique resources across 20 official sections, with at least 7 resources in each section.",
              )}
            </p>
          </div>

          <div className="course-controls">
            <div
              className="filters"
              role="group"
              aria-label={tr("تصفية الدورات", "Filter courses")}
            >
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={activeFilter === filter.id ? "active" : ""}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {tr(filter.ar, filter.en)}
                </button>
              ))}
            </div>
            <label className="search-box">
              <span className="sr-only">
                {tr("ابحث عن دورة", "Search courses")}
              </span>
              <SearchIcon />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={tr("ابحث عن دورة...", "Search courses...")}
              />
            </label>
          </div>

          {visibleCourses.length ? (
            <div className="course-grid">
              {visibleCourses.map((course) => (
                <article className="course-card" key={course.id}>
                  <div className={`course-cover ${course.accent}`}>
                    <span className="course-level">
                      {language === "ar" ? course.level : course.levelEn}
                    </span>
                    <strong dir="ltr">{course.code}</strong>
                    <div className="cover-lines" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                  <div className="course-body">
                    <small>
                      {language === "ar" ? course.category : course.categoryEn}
                    </small>
                    <h3>{language === "ar" ? course.title : course.titleEn}</h3>
                    <p>
                      {language === "ar"
                        ? course.description
                        : course.descriptionEn}
                    </p>
                    <div className="course-meta">
                      <span>
                        ◷ {language === "ar" ? course.hours : course.hoursEn}
                      </span>
                      <span>
                        ▤ {course.lessons} {tr("درسًا", "lessons")}
                      </span>
                    </div>
                    <div className="course-footer">
                      <span>
                        <b>✓ {tr("مسار منتقى", "Curated path")}</b>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedCourse(course)}
                      >
                        {tr("عرض التفاصيل", "View details")} <ArrowIcon />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>⌕</span>
              <h3>
                {tr("لم نجد دورة بهذا الاسم", "No course matched your search")}
              </h3>
              <p>
                {tr(
                  "جرّب كلمة أخرى أو اختر تصنيفًا مختلفًا.",
                  "Try another keyword or choose a different category.",
                )}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
              >
                {tr("عرض كل الدورات", "Show all courses")}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="path-section section" id="paths">
        <div className="shell path-grid">
          <div className="path-copy">
            <div className="eyebrow">
              <span />{" "}
              {tr("مسارك المهني خطوة بخطوة", "Your career path, step by step")}
            </div>
            <h2>
              {tr("ثمانية عشر طريقًا.", "Eighteen roadmaps.")}
              <br />
              <em>{tr("وهدفك واحد.", "One goal: progress.")}</em>
            </h2>
            <p>
              {tr(
                "اختر تخصصك، تابع مراحله التفاعلية، واحفظ تقدمك محليًا من الواجهة الأمامية حتى الأمن والبيانات والسحابة.",
                "Choose your field, follow its interactive stages, and save progress locally—from frontend to security, data, and cloud.",
              )}
            </p>
            <div className="path-stats">
              <div>
                <strong>16</strong>
                <span>{tr("خريطة طريق", "roadmaps")}</span>
              </div>
              <div>
                <strong>96</strong>
                <span>{tr("مرحلة", "stages")}</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>{tr("تفاعلية", "interactive")}</span>
              </div>
            </div>
            <a className="button button-primary" href="/roadmaps">
              {tr("استكشف كل الخرائط", "Explore all roadmaps")} <ArrowIcon />
            </a>
          </div>
          <div className="timeline">
            {[
              [
                "01",
                tr("أساسيات الويب", "Web foundations"),
                "HTML · CSS · Git",
                tr("مكتمل", "Complete"),
              ],
              [
                "02",
                tr("برمجة الواجهات", "Frontend programming"),
                "JavaScript · DOM · APIs",
                tr("جارٍ التعلم", "In progress"),
              ],
              [
                "03",
                tr("تطوير React", "React development"),
                "Components · Hooks · State",
                tr("التالي", "Next"),
              ],
              [
                "04",
                "Laravel Backend",
                "REST API · Sanctum · MySQL",
                tr("قريبًا", "Upcoming"),
              ],
              [
                "05",
                tr("مشروع متكامل", "Integrated project"),
                "React + Laravel",
                tr("قريبًا", "Upcoming"),
              ],
            ].map((item, index) => (
              <div
                className={`timeline-item ${index === 0 ? "done" : index === 1 ? "current" : ""}`}
                key={item[0]}
              >
                <span className="timeline-number">{item[0]}</span>
                <div>
                  <h3>{item[1]}</h3>
                  <p>{item[2]}</p>
                </div>
                <small>{item[3]}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-section section" id="why-us">
        <div className="shell">
          <div className="section-heading centered">
            <div className="eyebrow dark">
              <span />{" "}
              {tr("تجربة تعلم عملية", "A practical learning experience")}
            </div>
            <h2>
              {tr(
                "كل ما تحتاجه لتتقدم.",
                "Everything you need to move forward.",
              )}
            </h2>
            <p>
              {tr(
                "كل ميزة ظاهرة هنا تعمل فعلًا: تشغيل، قراءة، تصفية، بحث، وحفظ تقدم محلي.",
                "Every feature shown here is functional: playback, reading, filtering, search, and local progress tracking.",
              )}
            </p>
          </div>
          <div className="feature-grid">
            <article>
              <span className="feature-icon">▶</span>
              <h3>{tr("مشغّل فيديو داخلي", "In-platform video player")}</h3>
              <p>
                {tr(
                  "شاهد الدورات وقوائم التشغيل داخل المنصة مع رابط واضح للمصدر الأصلي.",
                  "Watch courses and playlists inside the platform with clear original-source attribution.",
                )}
              </p>
              <b>01</b>
            </article>
            <article>
              <span className="feature-icon">▤</span>
              <h3>{tr("قارئ معرفة متكامل", "Integrated knowledge reader")}</h3>
              <p>
                {tr(
                  "افتح الكتب العامة والمقالات الكاملة دون مغادرة تجربة التعلم.",
                  "Open public books and full articles without leaving the learning experience.",
                )}
              </p>
              <b>02</b>
            </article>
            <article>
              <span className="feature-icon">↗</span>
              <h3>{tr("تقدم محفوظ محليًا", "Locally saved progress")}</h3>
              <p>
                {tr(
                  "حدد مراحل خريطة الطريق المكتملة وارجع إليها لاحقًا على الجهاز نفسه.",
                  "Mark roadmap stages complete and return to them later on the same device.",
                )}
              </p>
              <b>03</b>
            </article>
            <article>
              <span className="feature-icon">AR</span>
              <h3>
                {tr("واجهة عربية وإنجليزية", "Arabic and English interface")}
              </h3>
              <p>
                {tr(
                  "بدّل اللغة فورًا مع اتجاه صحيح للنصوص وواجهة متجاوبة.",
                  "Switch languages instantly with correct text direction and responsive layouts.",
                )}
              </p>
              <b>04</b>
            </article>
          </div>
        </div>
      </section>

      <section className="mentors-section section" id="mentors">
        <div className="shell mentor-layout">
          <div className="mentor-copy">
            <div className="eyebrow dark">
              <span /> {tr("مصادر واضحة وموثوقة", "Clear, trusted sources")}
            </div>
            <h2>
              {tr("تعلّم من", "Learn from")}
              <br />
              <em>{tr("المصدر الصحيح.", "the right source.")}</em>
            </h2>
            <p>
              {tr(
                "تعرض المنصة المصدر والناشر بوضوح وتحافظ على روابط المحتوى الأصلي.",
                "The platform clearly identifies publishers and preserves links to original content.",
              )}
            </p>
          </div>
          <div className="mentor-list">
            <a
              href="https://cs50.harvard.edu/x/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <article>
                <div className="mentor-avatar avatar-one">CS</div>
                <div>
                  <h3>Harvard CS50</h3>
                  <p>
                    {tr(
                      "مقدمة أكاديمية لعلوم الحاسب",
                      "Academic introduction to computer science",
                    )}
                  </p>
                </div>
                <span>Computer Science</span>
              </article>
            </a>
            <a
              href="https://www.freecodecamp.org/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <article>
                <div className="mentor-avatar avatar-two">FC</div>
                <div>
                  <h3>freeCodeCamp</h3>
                  <p>
                    {tr(
                      "دورات تقنية كاملة ومفتوحة",
                      "Complete, open technology courses",
                    )}
                  </p>
                </div>
                <span>Code · Data · Cloud</span>
              </article>
            </a>
            <a
              href="https://elzero.org/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <article>
                <div className="mentor-avatar avatar-three">EZ</div>
                <div>
                  <h3>Elzero Web School</h3>
                  <p>
                    {tr(
                      "مسارات عربية لتطوير الويب",
                      "Arabic web development tracks",
                    )}
                  </p>
                </div>
                <span>Arabic · Web</span>
              </article>
            </a>
            <a
              href="https://roadmap.sh/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <article>
                <div className="mentor-avatar avatar-four">RM</div>
                <div>
                  <h3>roadmap.sh</h3>
                  <p>
                    {tr(
                      "مراجع بصرية للمسارات التقنية",
                      "Visual references for technology paths",
                    )}
                  </p>
                </div>
                <span>Career Roadmaps</span>
              </article>
            </a>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="shell cta-card">
          <div className="cta-code" aria-hidden="true">
            {"{"}
            <span>GO</span>
            {"}"}
          </div>
          <div>
            <div className="eyebrow">
              <span /> {tr("خطوتك الأولى اليوم", "Your first step today")}
            </div>
            <h2>
              {tr("جاهز تكتب أول سطر", "Ready to write the first line")}
              <br />
              {tr("في قصتك؟", "of your story?")}
            </h2>
            <p>
              {tr(
                "ابدأ بالمحتوى الذي يناسبك أو اختر خريطة طريق واضحة لتخصصك.",
                "Start with the content that fits you, or choose a clear roadmap for your field.",
              )}
            </p>
          </div>
          <div className="cta-actions">
            <Link className="button button-primary" href="/courses">
              {tr("استكشف الكورسات", "Explore courses")} <ArrowIcon />
            </Link>

            <Link className="button button-ghost" href="/roadmaps">
              {tr("اختر خريطة طريق", "Choose a roadmap")}
            </Link>

            <small>
              {tr(
                "محتوى مجاني ومصادر موثقة",
                "Free content with attributed sources",
              )}
            </small>
          </div>
        </div>
      </section>

      <SiteFooter />

      {selectedCourse ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setSelectedCourse(null)}
        >
          <section
            className="course-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              aria-label={tr("إغلاق", "Close")}
              onClick={() => setSelectedCourse(null)}
            >
              ×
            </button>
            <div className={`modal-symbol ${selectedCourse.accent}`}>
              {selectedCourse.code}
            </div>
            <span className="modal-kicker">
              {language === "ar"
                ? selectedCourse.category
                : selectedCourse.categoryEn}{" "}
              ·{" "}
              {language === "ar"
                ? selectedCourse.level
                : selectedCourse.levelEn}
            </span>
            <h2 id="course-modal-title">
              {language === "ar"
                ? selectedCourse.title
                : selectedCourse.titleEn}
            </h2>
            <p>
              {language === "ar"
                ? selectedCourse.description
                : selectedCourse.descriptionEn}
            </p>
            <div className="modal-facts">
              <span>
                {selectedCourse.lessons} {tr("درسًا", "lessons")}
              </span>
              <span>
                {language === "ar"
                  ? selectedCourse.hours
                  : selectedCourse.hoursEn}
              </span>
              <span>{tr("مسار منتقى", "Curated path")}</span>
            </div>
            <Link className="button button-primary modal-cta" href="/courses">
              {tr("افتح مركز الكورسات", "Open the course center")} <ArrowIcon />
            </Link>
            <small>
              {tr(
                "الدورات وقوائم التشغيل تعمل داخل مركز الكورسات مع إظهار المصدر الأصلي.",
                "Courses and playlists play inside the course center with clear original-source attribution.",
              )}
            </small>
          </section>
        </div>
      ) : null}
    </main>
  );
}
