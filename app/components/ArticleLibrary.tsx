"use client";
/* eslint-disable react-hooks/set-state-in-effect -- request lifecycle state is synchronized by abortable effects */

import { useEffect, useMemo, useState } from "react";
import { techDomains } from "../data/techDomains";
import { useLanguage } from "./LanguageProvider";

type Article = {
  id: number;
  title: string;
  description: string | null;
  url: string;
  cover_image: string | null;
  social_image: string | null;
  published_at: string;
  reading_time_minutes: number;
  tag_list: string[];
  positive_reactions_count: number;
  comments_count: number;
  body_html?: string;
  user: { name: string; username: string; profile_image_90?: string };
};

function sanitizeArticle(html: string) {
  if (!html || typeof window === "undefined") return "";
  const documentFragment = new DOMParser().parseFromString(html, "text/html");
  documentFragment
    .querySelectorAll(
      "script,style,iframe,object,embed,form,link,meta,svg,math",
    )
    .forEach((element) => element.remove());
  documentFragment.querySelectorAll<HTMLElement>("*").forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (
        name.startsWith("on") ||
        name === "srcdoc" ||
        name === "style" ||
        ((name === "href" || name === "src") && value.startsWith("javascript:"))
      )
        element.removeAttribute(attribute.name);
    });
  });
  documentFragment.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
    link.target = "_blank";
    link.rel = "noreferrer noopener";
  });
  documentFragment
    .querySelectorAll<HTMLImageElement>("img")
    .forEach((image) => {
      image.loading = "lazy";
    });
  return documentFragment.body.innerHTML;
}

export default function ArticleLibrary() {
  const { language, tr } = useLanguage();
  const [tag, setTag] = useState("webdev");
  const [activeDomain, setActiveDomain] = useState("web");
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Article | null>(null);
  const [articleBody, setArticleBody] = useState("");
  const [bodyLoading, setBodyLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(
      `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=30&page=${page}&top=30`,
      {
        signal: controller.signal,
        headers: { Accept: "application/vnd.forem.api-v1+json" },
      },
    )
      .then((response) => {
        if (!response.ok) throw new Error("articles_api_error");
        return response.json() as Promise<Article[]>;
      })
      .then((payload) =>
        setArticles((current) =>
          page === 1
            ? payload
            : [
                ...current,
                ...payload.filter(
                  (article) => !current.some((item) => item.id === article.id),
                ),
              ],
        ),
      )
      .catch((reason: Error) => {
        if (reason.name !== "AbortError")
          setError(
            tr(
              "تعذر تحميل المقالات الآن. حاول مرة أخرى بعد قليل.",
              "Articles are temporarily unavailable. Please try again.",
            ),
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [tag, page, retryNonce, tr]);

  useEffect(() => {
    if (!selected) {
      setArticleBody("");
      return;
    }
    const controller = new AbortController();
    setBodyLoading(true);
    setArticleBody("");
    fetch(`https://dev.to/api/articles/${selected.id}`, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.forem.api-v1+json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("article_body_error");
        return response.json() as Promise<Article>;
      })
      .then((article) => setArticleBody(article.body_html ?? ""))
      .catch((reason: Error) => {
        if (reason.name !== "AbortError") setArticleBody("");
      })
      .finally(() => setBodyLoading(false));
    return () => controller.abort();
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return articles;
    return articles.filter((article) =>
      `${article.title} ${article.description ?? ""} ${article.tag_list.join(" ")} ${article.user.name}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [articles, query]);
  const safeBody = useMemo(() => sanitizeArticle(articleBody), [articleBody]);

  function chooseDomain(id: string, nextTag: string) {
    setActiveDomain(id);
    setTag(nextTag);
    setArticles([]);
    setPage(1);
    setQuery("");
  }

  return (
    <section className="library-shell article-library">
      <div className="article-reader-banner">
        <span>✦</span>
        <div>
          <strong>
            {tr("أفكار حية داخل Dev Nexus", "Living ideas inside Dev Nexus")}
          </strong>
          <p>
            {tr(
              "افتح أي مقال لقراءة نصه الكامل داخل قارئ المنصة مع حفظ اسم الكاتب ورابط المصدر.",
              "Open any article to read the full text in our in-platform reader while preserving author and source attribution.",
            )}
          </p>
        </div>
        <b>LIVE DEV FEED</b>
      </div>
      <div className="article-toolbar">
        <label>
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">
            {tr("ابحث في المقالات", "Search articles")}
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tr(
              "ابحث داخل المقالات المحملة...",
              "Search loaded articles...",
            )}
          />
        </label>
        <select
          value={activeDomain}
          onChange={(event) => {
            const domain = techDomains.find(
              (item) => item.id === event.target.value,
            );
            if (domain) chooseDomain(domain.id, domain.articleTag);
          }}
          aria-label={tr("اختر مجال المقالات", "Choose article field")}
        >
          {techDomains.map((domain) => (
            <option key={domain.id} value={domain.id}>
              {tr(domain.label, domain.labelEn)}
            </option>
          ))}
        </select>
      </div>
      <nav
        className="domain-grid"
        aria-label={tr("مجالات المقالات", "Article fields")}
      >
        {techDomains.map((domain) => (
          <button
            type="button"
            key={domain.id}
            className={activeDomain === domain.id ? "active" : ""}
            onClick={() => chooseDomain(domain.id, domain.articleTag)}
          >
            <b>{domain.short}</b>
            <span>{tr(domain.label, domain.labelEn)}</span>
            <i>#{domain.articleTag}</i>
          </button>
        ))}
      </nav>
      <div className="library-summary">
        <div>
          <strong>{loading && !articles.length ? "…" : visible.length}</strong>
          <span>{tr("مقالًا محملًا", "articles loaded")}</span>
        </div>
        <div>
          <strong>{tag.toUpperCase()}</strong>
          <span>{tr("التصنيف النشط", "active tag")}</span>
        </div>
        <div>
          <strong>FULL</strong>
          <span>{tr("قارئ داخلي", "in-platform reader")}</span>
        </div>
        <p>
          DEV Community API <i />
        </p>
      </div>
      {error && articles.length ? (
        <div className="library-inline-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setRetryNonce((value) => value + 1)}
          >
            {tr("إعادة المحاولة", "Try again")}
          </button>
        </div>
      ) : null}
      {loading && !articles.length ? (
        <div className="portal-loading" aria-live="polite">
          <i />
          <strong>
            {tr("نجمع أفضل مقالات التخصص…", "Loading top articles...")}
          </strong>
        </div>
      ) : error && !articles.length ? (
        <div className="portal-empty" role="alert">
          <span>!</span>
          <h3>{error}</h3>
          <button
            type="button"
            onClick={() => setRetryNonce((value) => value + 1)}
          >
            {tr("إعادة المحاولة", "Try again")}
          </button>
        </div>
      ) : visible.length ? (
        <>
          <div className="article-grid">
            {visible.map((article) => (
              <button
                type="button"
                className="article-card"
                key={article.id}
                onClick={() => setSelected(article)}
                aria-label={`${tr("قراءة المقال", "Read article")}: ${article.title}`}
              >
                <span className="article-media">
                  <span className="article-media-fallback">
                    <b>{article.tag_list[0]?.toUpperCase() ?? "DEV"}</b>
                    <i>{"{ read(); learn(); build(); }"}</i>
                  </span>
                  {(article.cover_image || article.social_image) && (
                    <img
                      src={article.cover_image ?? article.social_image ?? ""}
                      alt=""
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                      }}
                    />
                  )}
                  <em>
                    {article.reading_time_minutes} {tr("دقائق", "min")}
                  </em>
                  <i className="inside-badge">
                    {tr("قراءة داخلية", "READ HERE")}
                  </i>
                </span>
                <span className="article-copy">
                  <small>
                    {article.tag_list
                      .slice(0, 3)
                      .map((item) => `#${item}`)
                      .join("  ")}
                  </small>
                  <strong>{article.title}</strong>
                  <span>
                    {article.description ??
                      tr(
                        "مقال تقني من مجتمع المطورين.",
                        "A technical article from the developer community.",
                      )}
                  </span>
                  <footer>
                    <b>{article.user.name}</b>
                    <em>
                      {article.positive_reactions_count}{" "}
                      {tr("تفاعل", "reactions")} · {article.comments_count}{" "}
                      {tr("تعليق", "comments")}
                    </em>
                  </footer>
                </span>
              </button>
            ))}
          </div>
          <div className="load-more-row">
            <button
              type="button"
              onClick={() => setPage((value) => value + 1)}
              disabled={loading}
            >
              {loading
                ? tr("جارٍ تحميل المزيد…", "Loading more...")
                : tr("تحميل 30 مقالًا إضافيًا", "Load 30 more articles")}
              <span>↓</span>
            </button>
          </div>
        </>
      ) : (
        <div className="portal-empty">
          <span>⌕</span>
          <h3>{tr("لا توجد مقالات مطابقة", "No matching articles")}</h3>
          <button type="button" onClick={() => setQuery("")}>
            {tr("مسح البحث", "Clear search")}
          </button>
        </div>
      )}

      {selected && (
        <div
          className="detail-backdrop article-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelected(null);
          }}
        >
          <article
            className="article-reader-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="selected-article-title"
          >
            <button
              className="detail-close"
              type="button"
              aria-label={tr("إغلاق", "Close")}
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <header>
              <span className="article-header-fallback">DEV</span>
              {(selected.cover_image || selected.social_image) && (
                <img
                  src={selected.cover_image ?? selected.social_image ?? ""}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
              )}
              <div>
                <span className="detail-kicker">
                  {selected.tag_list
                    .slice(0, 5)
                    .map((item) => `#${item}`)
                    .join("  ")}
                </span>
                <h2 id="selected-article-title">{selected.title}</h2>
                <div className="author-row">
                  {selected.user.profile_image_90 && (
                    <img
                      src={selected.user.profile_image_90}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                      }}
                    />
                  )}
                  <div>
                    <strong>{selected.user.name}</strong>
                    <span>@{selected.user.username}</span>
                  </div>
                  <p>
                    {new Intl.DateTimeFormat(
                      language === "ar" ? "ar-EG" : "en-US",
                      { dateStyle: "medium" },
                    ).format(new Date(selected.published_at))}{" "}
                    · {selected.reading_time_minutes}{" "}
                    {tr("دقائق قراءة", "min read")}
                  </p>
                </div>
              </div>
            </header>
            <div className="article-reader-content">
              {bodyLoading ? (
                <div className="portal-loading" aria-live="polite">
                  <i />
                  <strong>
                    {tr(
                      "يتم فتح المقال داخل المنصة…",
                      "Opening the article inside the platform...",
                    )}
                  </strong>
                </div>
              ) : safeBody ? (
                <div
                  className="article-reader-body"
                  dir="auto"
                  dangerouslySetInnerHTML={{ __html: safeBody }}
                />
              ) : (
                <div className="portal-empty">
                  <span>!</span>
                  <h3>
                    {tr(
                      "تعذر تحميل النص الكامل",
                      "Could not load the full text",
                    )}
                  </h3>
                  <a
                    className="detail-action"
                    href={selected.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {tr("قراءة المقال من المصدر", "Read from source")} ↗
                  </a>
                </div>
              )}
            </div>
            <footer>
              <div>
                <strong>
                  {tr("المصدر: DEV Community", "Source: DEV Community")}
                </strong>
                <span>
                  {tr(
                    "المحتوى والحقوق محفوظة للكاتب المذكور أعلاه.",
                    "Content and rights belong to the credited author.",
                  )}
                </span>
              </div>
              <a href={selected.url} target="_blank" rel="noreferrer noopener">
                {tr("عرض النسخة الأصلية", "View original")} ↗
              </a>
            </footer>
          </article>
        </div>
      )}
    </section>
  );
}
