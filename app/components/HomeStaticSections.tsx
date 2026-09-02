import Link from "next/link";
import { ArrowIcon } from "./HomeIcons";
import LocalizedText from "./LocalizedText";

const timeline = [
  {
    number: "01",
    titleAr: "أساسيات الويب",
    titleEn: "Web foundations",
    detail: "HTML · CSS · Git",
    statusAr: "مكتمل",
    statusEn: "Complete",
    state: "done",
  },
  {
    number: "02",
    titleAr: "برمجة الواجهات",
    titleEn: "Frontend programming",
    detail: "JavaScript · DOM · APIs",
    statusAr: "جارٍ التعلم",
    statusEn: "In progress",
    state: "current",
  },
  {
    number: "03",
    titleAr: "تطوير React",
    titleEn: "React development",
    detail: "Components · Hooks · State",
    statusAr: "التالي",
    statusEn: "Next",
    state: "",
  },
  {
    number: "04",
    titleAr: "Laravel Backend",
    titleEn: "Laravel Backend",
    detail: "REST API · Sanctum · MySQL",
    statusAr: "قريبًا",
    statusEn: "Upcoming",
    state: "",
  },
  {
    number: "05",
    titleAr: "مشروع متكامل",
    titleEn: "Integrated project",
    detail: "React + Laravel",
    statusAr: "قريبًا",
    statusEn: "Upcoming",
    state: "",
  },
];

export default function HomeStaticSections() {
  return (
    <>
      <section
        className="path-section section deferred-render-section"
        id="paths"
      >
        <div className="shell path-grid">
          <div className="path-copy">
            <div className="eyebrow">
              <span />{" "}
              <LocalizedText
                ar="مسارك المهني خطوة بخطوة"
                en="Your career path, step by step"
              />
            </div>
            <h2>
              <LocalizedText ar="ثمانية عشر طريقًا." en="Eighteen roadmaps." />
              <br />
              <em>
                <LocalizedText ar="وهدفك واحد." en="One goal: progress." />
              </em>
            </h2>
            <p>
              <LocalizedText
                ar="اختر تخصصك، تابع مراحله التفاعلية، واحفظ تقدمك محليًا من الواجهة الأمامية حتى الأمن والبيانات والسحابة."
                en="Choose your field, follow its interactive stages, and save progress locally—from frontend to security, data, and cloud."
              />
            </p>
            <div className="path-stats">
              <div>
                <strong>16</strong>
                <span>
                  <LocalizedText ar="خريطة طريق" en="roadmaps" />
                </span>
              </div>
              <div>
                <strong>96</strong>
                <span>
                  <LocalizedText ar="مرحلة" en="stages" />
                </span>
              </div>
              <div>
                <strong>100%</strong>
                <span>
                  <LocalizedText ar="تفاعلية" en="interactive" />
                </span>
              </div>
            </div>
            <Link className="button button-primary" href="/roadmaps">
              <LocalizedText ar="استكشف كل الخرائط" en="Explore all roadmaps" />{" "}
              <ArrowIcon />
            </Link>
          </div>

          <div className="timeline">
            {timeline.map((item) => (
              <div
                className={`timeline-item ${item.state}`.trim()}
                key={item.number}
              >
                <span className="timeline-number">{item.number}</span>
                <div>
                  <h3>
                    <LocalizedText ar={item.titleAr} en={item.titleEn} />
                  </h3>
                  <p>{item.detail}</p>
                </div>
                <small>
                  <LocalizedText ar={item.statusAr} en={item.statusEn} />
                </small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="why-section section deferred-render-section"
        id="why-us"
      >
        <div className="shell">
          <div className="section-heading centered">
            <div className="eyebrow dark">
              <span />{" "}
              <LocalizedText
                ar="تجربة تعلم عملية"
                en="A practical learning experience"
              />
            </div>
            <h2>
              <LocalizedText
                ar="كل ما تحتاجه لتتقدم."
                en="Everything you need to move forward."
              />
            </h2>
            <p>
              <LocalizedText
                ar="كل ميزة ظاهرة هنا تعمل فعلًا: تشغيل، قراءة، تصفية، بحث، وحفظ تقدم محلي."
                en="Every feature shown here is functional: playback, reading, filtering, search, and local progress tracking."
              />
            </p>
          </div>

          <div className="feature-grid">
            <article>
              <span className="feature-icon">▶</span>
              <h3>
                <LocalizedText
                  ar="مشغّل فيديو داخلي"
                  en="In-platform video player"
                />
              </h3>
              <p>
                <LocalizedText
                  ar="شاهد الدورات وقوائم التشغيل داخل المنصة مع رابط واضح للمصدر الأصلي."
                  en="Watch courses and playlists inside the platform with clear original-source attribution."
                />
              </p>
              <b>01</b>
            </article>
            <article>
              <span className="feature-icon">▤</span>
              <h3>
                <LocalizedText
                  ar="قارئ معرفة متكامل"
                  en="Integrated knowledge reader"
                />
              </h3>
              <p>
                <LocalizedText
                  ar="افتح الكتب العامة والمقالات الكاملة دون مغادرة تجربة التعلم."
                  en="Open public books and full articles without leaving the learning experience."
                />
              </p>
              <b>02</b>
            </article>
            <article>
              <span className="feature-icon">↗</span>
              <h3>
                <LocalizedText
                  ar="تقدم محفوظ محليًا"
                  en="Locally saved progress"
                />
              </h3>
              <p>
                <LocalizedText
                  ar="حدد مراحل خريطة الطريق المكتملة وارجع إليها لاحقًا على الجهاز نفسه."
                  en="Mark roadmap stages complete and return to them later on the same device."
                />
              </p>
              <b>03</b>
            </article>
            <article>
              <span className="feature-icon">AR</span>
              <h3>
                <LocalizedText
                  ar="واجهة عربية وإنجليزية"
                  en="Arabic and English interface"
                />
              </h3>
              <p>
                <LocalizedText
                  ar="بدّل اللغة فورًا مع اتجاه صحيح للنصوص وواجهة متجاوبة."
                  en="Switch languages instantly with correct text direction and responsive layouts."
                />
              </p>
              <b>04</b>
            </article>
          </div>
        </div>
      </section>

      <section
        className="mentors-section section deferred-render-section"
        id="mentors"
      >
        <div className="shell mentor-layout">
          <div className="mentor-copy">
            <div className="eyebrow dark">
              <span />{" "}
              <LocalizedText
                ar="مصادر واضحة وموثوقة"
                en="Clear, trusted sources"
              />
            </div>
            <h2>
              <LocalizedText ar="تعلّم من" en="Learn from" />
              <br />
              <em>
                <LocalizedText ar="المصدر الصحيح." en="the right source." />
              </em>
            </h2>
            <p>
              <LocalizedText
                ar="تعرض المنصة المصدر والناشر بوضوح وتحافظ على روابط المحتوى الأصلي."
                en="The platform clearly identifies publishers and preserves links to original content."
              />
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
                    <LocalizedText
                      ar="مقدمة أكاديمية لعلوم الحاسب"
                      en="Academic introduction to computer science"
                    />
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
                    <LocalizedText
                      ar="دورات تقنية كاملة ومفتوحة"
                      en="Complete, open technology courses"
                    />
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
                    <LocalizedText
                      ar="مسارات عربية لتطوير الويب"
                      en="Arabic web development tracks"
                    />
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
                    <LocalizedText
                      ar="مراجع بصرية للمسارات التقنية"
                      en="Visual references for technology paths"
                    />
                  </p>
                </div>
                <span>Career Roadmaps</span>
              </article>
            </a>
          </div>
        </div>
      </section>

      <section className="cta-section deferred-render-section">
        <div className="shell cta-card">
          <div className="cta-code" aria-hidden="true">
            {"{"}
            <span>GO</span>
            {"}"}
          </div>
          <div>
            <div className="eyebrow">
              <span />{" "}
              <LocalizedText
                ar="خطوتك الأولى اليوم"
                en="Your first step today"
              />
            </div>
            <h2>
              <LocalizedText
                ar="جاهز تكتب أول سطر"
                en="Ready to write the first line"
              />
              <br />
              <LocalizedText ar="في قصتك؟" en="of your story?" />
            </h2>
            <p>
              <LocalizedText
                ar="ابدأ بالمحتوى الذي يناسبك أو اختر خريطة طريق واضحة لتخصصك."
                en="Start with the content that fits you, or choose a clear roadmap for your field."
              />
            </p>
          </div>
          <div className="cta-actions">
            <Link className="button button-primary" href="/courses">
              <LocalizedText ar="استكشف الكورسات" en="Explore courses" />{" "}
              <ArrowIcon />
            </Link>
            <Link className="button button-ghost" href="/roadmaps">
              <LocalizedText ar="اختر خريطة طريق" en="Choose a roadmap" />
            </Link>
            <small>
              <LocalizedText
                ar="محتوى مجاني ومصادر موثقة"
                en="Free content with attributed sources"
              />
            </small>
          </div>
        </div>
      </section>
    </>
  );
}
