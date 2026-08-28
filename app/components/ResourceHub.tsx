"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLanguage } from "./LanguageProvider";

type ResourceType = "books" | "courses" | "articles";

type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string | null;
  source: string;
  meta: string;
  tag: string;
};

type OpenBook = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  ia?: string[];
  ebook_access?: string;
  public_scan_b?: boolean;
  has_fulltext?: boolean;
  subject?: string[];
};

type DevArticle = {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image?: string | null;
  social_image?: string | null;
  user: { name: string };
  reading_time_minutes: number;
  tag_list: string[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const tabs: {
  id: ResourceType;
  ar: string;
  en: string;
  icon: string;
  hint: string;
}[] = [
  {
    id: "books",
    ar: "كتب",
    en: "Books",
    icon: "▤",
    hint: "React, JavaScript, Laravel...",
  },
  {
    id: "courses",
    ar: "كورسات",
    en: "Courses",
    icon: "▶",
    hint: "HTML, CSS, React...",
  },
  {
    id: "articles",
    ar: "مقالات",
    en: "Articles",
    icon: "✦",
    hint: "webdev, react, php...",
  },
];

const curatedCourses: Resource[] = [
  {
    id: "yt-html-ar",
    title: "تعلّم HTML بالعربية",
    description:
      "مسار عربي من Elzero Web School يبدأ من أساسيات الصفحة وحتى العناصر الدلالية.",
    url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAw_t_XWUFbBX-c9MafPk9ji",
    source: "YouTube · Elzero",
    meta: "مسار مجاني",
    tag: "HTML",
  },
  {
    id: "yt-css-ar",
    title: "تعلّم CSS بالعربية",
    description:
      "شرح متدرج للتنسيق، التخطيطات، Flexbox، Grid، وبناء واجهات متجاوبة.",
    url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAzjsz06gkzlSrlev53MGIKe",
    source: "YouTube · Elzero",
    meta: "مسار مجاني",
    tag: "CSS",
  },
  {
    id: "yt-js-ar",
    title: "JavaScript من الصفر بالعربية",
    description:
      "مسار شامل يشرح لغة JavaScript بالتدرج مع تدريبات وأمثلة عملية.",
    url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAx3kiplQR_oeDqLDBUDYwVv",
    source: "YouTube · Elzero",
    meta: "مسار مجاني",
    tag: "JavaScript",
  },
  {
    id: "yt-react-modern-ar",
    title: "Modern React بالعربية",
    description:
      "مقدمة عملية إلى React الحديثة، المكوّنات، الحالة، وبناء تطبيقات الواجهة.",
    url: "https://www.youtube.com/playlist?list=PLfDx4cQoUNOaNyHVdV6mmF6kCzq9KTyee",
    source: "YouTube",
    meta: "مسار مجاني",
    tag: "React",
  },
  {
    id: "yt-react-ts-ar",
    title: "React مع TypeScript بالعربية",
    description:
      "تعلم إعداد React مع TypeScript وكتابة مكوّنات أكثر أمانًا وتنظيمًا.",
    url: "https://www.youtube.com/playlist?list=PLxRKoQzM5m3K3OFcL4zUtpUgq8cMMceNO",
    source: "YouTube",
    meta: "مسار مجاني",
    tag: "TypeScript",
  },
  {
    id: "yt-jest-ar",
    title: "اختبار JavaScript باستخدام Jest",
    description:
      "مسار عربي يضيف مهارة الاختبارات الآلية إلى أدوات مطور الواجهة الأمامية.",
    url: "https://www.youtube.com/playlist?list=PLDoPjvoNmBAwSrfBPERTnCmWAbcMAwG9O",
    source: "YouTube · Elzero",
    meta: "20 درسًا",
    tag: "Testing",
  },
];

const fallbackBooks: Resource[] = [
  {
    id: "fallback-ejs",
    title: "Eloquent JavaScript",
    description: "مدخل عملي ومفتوح إلى JavaScript والبرمجة الحديثة.",
    url: "https://eloquentjavascript.net/",
    source: "المؤلف",
    meta: "قراءة مجانية",
    tag: "JavaScript",
  },
  {
    id: "fallback-ydkjs",
    title: "You Don't Know JS Yet",
    description: "سلسلة مجانية متعمقة لفهم آليات JavaScript الأساسية.",
    url: "https://github.com/getify/You-Dont-Know-JS",
    source: "GitHub",
    meta: "مفتوح المصدر",
    tag: "JavaScript",
  },
  {
    id: "fallback-think-python",
    title: "Think Python",
    description: "كتاب مجاني لتعلّم البرمجة وعلوم الحاسب باستخدام Python.",
    url: "https://greenteapress.com/wp/think-python-2e/",
    source: "Green Tea Press",
    meta: "قراءة مجانية",
    tag: "Python",
  },
];

const fallbackArticles: Resource[] = [
  {
    id: "fallback-mdn",
    title: "دليل JavaScript على MDN",
    description: "مرجع موثوق للمفاهيم الأساسية والمتقدمة في JavaScript.",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    source: "MDN",
    meta: "مرجع",
    tag: "JavaScript",
  },
  {
    id: "fallback-react",
    title: "تعلم React",
    description: "المسار الرسمي لتعلّم المكوّنات والحالة والتفاعل.",
    url: "https://react.dev/learn",
    source: "React",
    meta: "توثيق رسمي",
    tag: "React",
  },
  {
    id: "fallback-laravel",
    title: "Laravel Documentation",
    description: "التوثيق الرسمي لبناء تطبيقات وواجهات API باستخدام Laravel.",
    url: "https://laravel.com/docs",
    source: "Laravel",
    meta: "توثيق رسمي",
    tag: "PHP",
  },
];

function matchesQuery(resource: Resource, query: string) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return true;
  return `${resource.title} ${resource.description} ${resource.tag}`
    .toLocaleLowerCase()
    .includes(normalized);
}

export default function ResourceHub() {
  const { tr } = useLanguage();
  const [activeTab, setActiveTab] = useState<ResourceType>("books");
  const [draftQuery, setDraftQuery] = useState("computer programming");
  const [query, setQuery] = useState("computer programming");
  const [resources, setResources] = useState<Resource[]>(fallbackBooks);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const activeTabDetails = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) ?? tabs[0],
    [activeTab],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadResources() {
      setLoading(true);
      setNotice(null);

      if (activeTab === "courses" && !API_BASE) {
        setResources(
          curatedCourses.filter((resource) => matchesQuery(resource, query)),
        );
        setLoading(false);
        return;
      }

      try {
        if (API_BASE) {
          const response = await fetch(
            `${API_BASE}/catalog/${activeTab}?search=${encodeURIComponent(query)}`,
            {
              signal: controller.signal,
              headers: { Accept: "application/json" },
            },
          );
          if (!response.ok) throw new Error("gateway_error");
          const payload = (await response.json()) as { data: Resource[] };
          setResources(payload.data);
          return;
        }

        if (activeTab === "books") {
          const response = await fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(query || "computer programming")}&has_fulltext=true&public_scan_b=true&fields=key,title,author_name,first_publish_year,cover_i,ia,ebook_access,public_scan_b,has_fulltext,subject&limit=12`,
            { signal: controller.signal },
          );
          if (!response.ok) throw new Error("books_error");
          const payload = (await response.json()) as { docs?: OpenBook[] };
          setResources(
            (payload.docs ?? [])
              .filter(
                (book) =>
                  book.ebook_access === "public" &&
                  book.public_scan_b &&
                  book.has_fulltext &&
                  book.ia?.length,
              )
              .slice(0, 6)
              .map((book) => ({
                id: `${book.key}-${book.ia?.[0]}`,
                title: book.title ?? "Open technology book",
                description:
                  book.author_name?.slice(0, 2).join("، ") || "Open Library",
                url: `https://archive.org/details/${book.ia?.[0]}`,
                image: book.cover_i
                  ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                  : null,
                source: "Open Library · Internet Archive",
                meta: book.first_publish_year
                  ? String(book.first_publish_year)
                  : "Public book",
                tag: book.subject?.[0] || "Programming",
              })),
          );
          return;
        }

        const tag =
          (query || "webdev")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9+#-]/g, "") || "webdev";
        const response = await fetch(
          `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=6&top=30`,
          {
            signal: controller.signal,
            headers: { Accept: "application/vnd.forem.api-v1+json" },
          },
        );
        if (!response.ok) throw new Error("articles_error");
        const payload = (await response.json()) as DevArticle[];
        setResources(
          payload.map((article) => ({
            id: String(article.id),
            title: article.title,
            description: article.description || `مقال من ${article.user.name}`,
            url: article.url,
            image: article.cover_image || article.social_image,
            source: `DEV · ${article.user.name}`,
            meta: `${article.reading_time_minutes || 1} دقائق قراءة`,
            tag: article.tag_list[0] || tag,
          })),
        );
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        const fallback =
          activeTab === "books"
            ? fallbackBooks
            : activeTab === "articles"
              ? fallbackArticles
              : curatedCourses;
        setResources(
          fallback.filter((resource) => matchesQuery(resource, query)),
        );
        setNotice(
          tr(
            "تعذّر الوصول للمصدر الآن، لذلك نعرض اختيارات موثوقة محفوظة.",
            "The live source is unavailable, so trusted saved selections are shown.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    void loadResources();
    return () => controller.abort();
  }, [activeTab, query, tr]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(draftQuery.trim());
  }

  function selectTab(tab: ResourceType) {
    setActiveTab(tab);
    const nextQuery =
      tab === "books"
        ? "computer programming"
        : tab === "articles"
          ? "webdev"
          : "";
    setDraftQuery(nextQuery);
    setQuery(nextQuery);
  }

  return (
    <section className="resource-section section" id="library">
      <div className="shell">
        <div className="resource-topline">
          <div>
            <div className="eyebrow dark">
              <span />{" "}
              {tr(
                "مكتبة متجددة من أفضل المصادر",
                "A growing library from trusted sources",
              )}
            </div>
            <h2>
              {tr("كل ما تحتاجه لتتعلّم", "Everything you need to learn")}
              <br />
              <em>{tr("في مكان واحد.", "in one place.")}</em>
            </h2>
          </div>
          <div
            className="api-status"
            title={tr(
              "المحتوى يُحدّث من المصادر الخارجية",
              "Content updates from external sources",
            )}
          >
            <i /> {tr("محتوى حي عبر API", "Live API content")}
          </div>
        </div>

        <div className="resource-workspace">
          <div
            className="resource-sidebar"
            role="tablist"
            aria-label={tr("أنواع مصادر التعلم", "Learning resource types")}
          >
            <span>{tr("استكشف المحتوى", "Explore content")}</span>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={activeTab === tab.id ? "active" : ""}
                onClick={() => selectTab(tab.id)}
              >
                <b>{tab.icon}</b>
                <span>{tr(tab.ar, tab.en)}</span>
                <small>←</small>
              </button>
            ))}
            <div className="source-note">
              <strong>{tr("مصادر موثوقة", "Trusted sources")}</strong>
              <p>
                Open Library
                <br />
                Internet Archive
                <br />
                DEV · YouTube
              </p>
            </div>
          </div>

          <div className="resource-content">
            <form className="resource-search" onSubmit={submitSearch}>
              <label htmlFor="resource-query">
                {tr("ابحث في", "Search")}{" "}
                {tr(activeTabDetails.ar, activeTabDetails.en)}
              </label>
              <div>
                <span aria-hidden="true">⌕</span>
                <input
                  id="resource-query"
                  value={draftQuery}
                  onChange={(event) => setDraftQuery(event.target.value)}
                  placeholder={activeTabDetails.hint}
                />
                <button type="submit">{tr("بحث", "Search")}</button>
              </div>
            </form>

            <div className="resource-results-head">
              <div>
                <strong>
                  {tr(activeTabDetails.ar, activeTabDetails.en)}{" "}
                  {tr("مقترحة", "suggestions")}
                </strong>
                <span>
                  {loading
                    ? tr("جارٍ التحديث...", "Updating...")
                    : `${resources.length} ${tr("نتائج", "results")}`}
                </span>
              </div>
              {notice ? (
                <p>{notice}</p>
              ) : (
                <small>
                  <i /> {tr("تم التحديث من المصدر", "Updated from source")}
                </small>
              )}
            </div>

            {loading ? (
              <div
                className="resource-grid"
                aria-label={tr("جارٍ تحميل النتائج", "Loading results")}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="resource-skeleton" key={index}>
                    <i />
                    <span />
                    <span />
                  </div>
                ))}
              </div>
            ) : resources.length ? (
              <div className="resource-grid">
                {resources.map((resource, index) => (
                  <a
                    className={`resource-card resource-${activeTab}`}
                    href={
                      activeTab === "books"
                        ? "/books"
                        : activeTab === "articles"
                          ? "/articles"
                          : "/courses"
                    }
                    key={resource.id}
                    aria-label={`${tr("فتح قسم", "Open")} ${tr(activeTabDetails.ar, activeTabDetails.en)}: ${resource.title}`}
                  >
                    <div className="resource-media">
                      <div className="resource-placeholder">
                        <span>
                          {activeTab === "books"
                            ? "▤"
                            : activeTab === "articles"
                              ? "✦"
                              : "▶"}
                        </span>
                        <b>{resource.tag}</b>
                      </div>
                      {resource.image && (
                        <img
                          src={resource.image}
                          alt=""
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.hidden = true;
                          }}
                        />
                      )}
                      <span className="resource-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="resource-card-body">
                      <span className="resource-tag">{resource.tag}</span>
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                      <footer>
                        <span>{resource.source}</span>
                        <b>
                          {resource.meta} · {tr("استكشف", "Explore")} →
                        </b>
                      </footer>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="resource-empty">
                <span>⌕</span>
                <h3>
                  {tr(
                    "لا توجد نتائج بهذا البحث",
                    "No results matched this search",
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setDraftQuery("");
                    setQuery("");
                  }}
                >
                  {tr("عرض المقترحات", "Show suggestions")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
