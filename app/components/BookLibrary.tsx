"use client";
/* eslint-disable react-hooks/set-state-in-effect -- request lifecycle state is synchronized by abortable effects */

import { useEffect, useMemo, useState } from "react";
import { techDomains } from "../data/techDomains";
import { useLanguage } from "./LanguageProvider";

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
type OpenLibraryResponse = { numFound?: number; docs?: OpenBook[] };
type ArchiveFile = { name: string; format?: string; size?: string };
type ArchiveMetadata = { files?: ArchiveFile[] };

function publicBooks(payload: OpenLibraryResponse) {
  return (payload.docs ?? []).filter(
    (book) =>
      book.ebook_access === "public" &&
      book.public_scan_b &&
      book.has_fulltext &&
      book.ia?.length,
  );
}

export default function BookLibrary() {
  const { tr } = useLanguage();
  const [query, setQuery] = useState("computer programming");
  const [submittedQuery, setSubmittedQuery] = useState(query);
  const [activeDomain, setActiveDomain] = useState("languages");
  const [books, setBooks] = useState<OpenBook[]>([]);
  const [selected, setSelected] = useState<OpenBook | null>(null);
  const [downloads, setDownloads] = useState<ArchiveFile[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [readerLoading, setReaderLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const fields =
      "key,title,author_name,first_publish_year,cover_i,ia,ebook_access,public_scan_b,has_fulltext,subject";
    fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(submittedQuery)}&has_fulltext=true&public_scan_b=true&fields=${fields}&limit=40&page=${page}`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) throw new Error("open_library_error");
        return response.json() as Promise<OpenLibraryResponse>;
      })
      .then((payload) => {
        const readable = publicBooks(payload);
        setTotal(payload.numFound ?? readable.length);
        setBooks((current) =>
          page === 1
            ? readable
            : [
                ...current,
                ...readable.filter(
                  (book) => !current.some((item) => item.key === book.key),
                ),
              ],
        );
      })
      .catch((reason: Error) => {
        if (reason.name !== "AbortError")
          setError(
            tr(
              "تعذر الاتصال بالمكتبة المفتوحة الآن. جرّب مرة أخرى.",
              "Could not reach the open library. Please try again.",
            ),
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [submittedQuery, page, retryNonce, tr]);

  useEffect(() => {
    const identifier = selected?.ia?.[0];
    setDownloads([]);
    if (!identifier) return;
    const controller = new AbortController();
    setReaderLoading(true);
    setMetadataLoading(true);
    fetch(`https://archive.org/metadata/${encodeURIComponent(identifier)}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("archive_metadata_error");
        return response.json() as Promise<ArchiveMetadata>;
      })
      .then((payload) => {
        const files = (payload.files ?? []).filter((file) => {
          const value = `${file.name} ${file.format ?? ""}`.toLowerCase();
          return (
            (value.includes("pdf") || value.includes("epub")) &&
            !value.includes("bw pdf") &&
            !file.name.endsWith("_text.pdf")
          );
        });
        const preferred = files.sort(
          (a, b) =>
            (a.name.endsWith(".pdf") ? -1 : 1) -
            (b.name.endsWith(".pdf") ? -1 : 1),
        );
        setDownloads(
          preferred
            .filter(
              (file, index, all) =>
                all.findIndex(
                  (candidate) =>
                    candidate.name.split(".").pop() ===
                    file.name.split(".").pop(),
                ) === index,
            )
            .slice(0, 2),
        );
      })
      .catch((reason: Error) => {
        if (reason.name !== "AbortError") setDownloads([]);
      })
      .finally(() => setMetadataLoading(false));
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

  const downloadableCount = useMemo(
    () => books.filter((book) => book.ia?.length).length,
    [books],
  );
  const archiveId = selected?.ia?.[0];

  function runSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim();
    if (!normalized) return;
    setBooks([]);
    setPage(1);
    setActiveDomain("");
    setSubmittedQuery(normalized);
  }

  function selectDomain(id: string, bookQuery: string) {
    setActiveDomain(id);
    setQuery(bookQuery);
    setBooks([]);
    setPage(1);
    setSubmittedQuery(bookQuery);
  }

  function openBook(book: OpenBook) {
    setSelected(book);
    setReaderLoading(true);
  }

  function downloadHref(file: ArchiveFile) {
    const identifier = selected?.ia?.[0] ?? "";
    const source = `https://archive.org/download/${encodeURIComponent(identifier)}/${encodeURIComponent(file.name)}`;
    return `/api/book-download?url=${encodeURIComponent(source)}&filename=${encodeURIComponent(file.name)}`;
  }

  return (
    <section className="library-shell free-library">
      <div className="free-library-banner">
        <span>∞</span>
        <div>
          <strong>
            {tr(
              "مكتبة معرفة مفتوحة بلا حدود",
              "An open library without limits",
            )}
          </strong>
          <p>
            {tr(
              "اقرأ الكتب العامة داخل Dev Nexus Academy عبر Open Library وInternet Archive، ونزّل الملفات المتوفرة.",
              "Read public-access books inside Dev Nexus Academy through Open Library and Internet Archive, with available downloads.",
            )}
          </p>
        </div>
        <b>PUBLIC ACCESS ONLY</b>
      </div>
      <form className="library-search" onSubmit={runSearch}>
        <div>
          <span aria-hidden="true">⌕</span>
          <label className="sr-only" htmlFor="book-search">
            {tr("ابحث في مكتبة الكتب", "Search the book library")}
          </label>
          <input
            id="book-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tr(
              "ابحث عن لغة، إطار عمل أو تخصص...",
              "Search a language, framework, or field...",
            )}
          />
          <button type="submit">{tr("بحث", "Search")}</button>
        </div>
        <nav
          className="domain-strip"
          aria-label={tr("تخصصات الكتب", "Book topics")}
        >
          {techDomains.map((domain) => (
            <button
              type="button"
              key={domain.id}
              className={activeDomain === domain.id ? "active" : ""}
              onClick={() => selectDomain(domain.id, domain.bookQuery)}
            >
              <b>{domain.short}</b>
              {tr(domain.label, domain.labelEn)}
            </button>
          ))}
        </nav>
      </form>
      <div className="library-summary">
        <div>
          <strong>{loading && !books.length ? "…" : books.length}</strong>
          <span>{tr("كتابًا عامًا محملًا", "public books loaded")}</span>
        </div>
        <div>
          <strong>{downloadableCount}</strong>
          <span>
            {tr("قابلًا للفتح والتنزيل", "readable and downloadable")}
          </span>
        </div>
        <div>
          <strong>{total > 999 ? "+999" : total}</strong>
          <span>{tr("نتيجة في المصدر", "source results")}</span>
        </div>
        <p>
          Open Library · Internet Archive <i />
        </p>
      </div>
      {error && books.length ? (
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
      {loading && !books.length ? (
        <div className="portal-loading" aria-live="polite">
          <i />
          <strong>
            {tr("نبحث في المكتبة المفتوحة…", "Searching the open library...")}
          </strong>
        </div>
      ) : error && !books.length ? (
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
      ) : books.length ? (
        <>
          <div className="book-grid">
            {books.map((book) => {
              const cover = book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                : "";
              return (
                <button
                  type="button"
                  className="book-card"
                  key={`${book.key}-${book.ia?.[0]}`}
                  onClick={() => openBook(book)}
                  aria-label={`${tr("فتح الكتاب", "Open book")}: ${book.title}`}
                >
                  <span className="book-cover">
                    <span className="book-cover-fallback">
                      <b>DN</b>
                      <small>{book.subject?.[0] ?? "OPEN TECH BOOK"}</small>
                    </span>
                    {cover && (
                      <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.hidden = true;
                        }}
                      />
                    )}
                    <i>▶ {tr("اقرأ داخل المنصة", "Read inside")}</i>
                    <em className="free-ribbon">{tr("عام", "PUBLIC")}</em>
                  </span>
                  <span className="book-copy">
                    <small>{book.subject?.[0] ?? "Technology"}</small>
                    <strong>{book.title}</strong>
                    <span>
                      {book.author_name?.slice(0, 2).join("، ") ??
                        tr("مؤلف غير محدد", "Unknown author")}
                    </span>
                    <footer>
                      <b>{book.first_publish_year ?? "BOOK"}</b>
                      <em>{tr("قراءة + تنزيل", "Read + download")}</em>
                    </footer>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="load-more-row">
            <button
              type="button"
              onClick={() => setPage((value) => value + 1)}
              disabled={loading}
            >
              {loading
                ? tr("جارٍ تحميل المزيد…", "Loading more...")
                : tr("تحميل 40 كتابًا إضافيًا", "Load 40 more books")}
              <span>↓</span>
            </button>
          </div>
        </>
      ) : (
        <div className="portal-empty">
          <span>⌕</span>
          <h3>
            {tr(
              "لا توجد كتب عامة قابلة للقراءة بهذا البحث",
              "No public-access readable books matched this search",
            )}
          </h3>
          <button
            type="button"
            onClick={() => selectDomain("languages", "computer programming")}
          >
            {tr("استعرض كتب البرمجة", "Browse programming books")}
          </button>
        </div>
      )}

      {selected && archiveId && (
        <div
          className="detail-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelected(null);
          }}
        >
          <article
            className="detail-drawer book-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="selected-book-title"
          >
            <button
              className="detail-close"
              type="button"
              aria-label={tr("إغلاق", "Close")}
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <div className="book-reader-area">
              <iframe
                src={`https://archive.org/embed/${encodeURIComponent(archiveId)}?ui=embed`}
                title={selected.title}
                loading="lazy"
                onLoad={() => setReaderLoading(false)}
              />
              {readerLoading && (
                <div className="reader-message" aria-live="polite">
                  <i />
                  <strong>
                    {tr(
                      "يتم فتح الكتاب داخل Dev Nexus…",
                      "Opening the book inside Dev Nexus...",
                    )}
                  </strong>
                </div>
              )}
            </div>
            <div className="detail-copy">
              <span className="detail-kicker">
                PUBLIC EBOOK · OPEN LIBRARY · INTERNET ARCHIVE
              </span>
              <h2 id="selected-book-title">{selected.title}</h2>
              <p className="detail-byline">
                {selected.author_name?.join("، ") ??
                  tr("مؤلف غير محدد", "Unknown author")}
              </p>
              <p className="detail-description">
                {tr(
                  "نسخة رقمية متاحة للوصول العام، تُعرض مباشرة داخل المنصة عبر قارئ Internet Archive.",
                  "A public-access digital edition displayed directly inside the platform using the Internet Archive reader.",
                )}
              </p>
              <div className="detail-facts">
                <span>{tr("وصول عام", "Public access")}</span>
                <span>{tr("قراءة داخل المنصة", "In-platform reader")}</span>
                {selected.first_publish_year && (
                  <span>{selected.first_publish_year}</span>
                )}
              </div>
              <div className="book-actions">
                {downloads.map((file) => (
                  <a href={downloadHref(file)} key={file.name}>
                    {tr("تنزيل", "Download")}{" "}
                    {file.name.toLowerCase().endsWith(".epub") ? "EPUB" : "PDF"}{" "}
                    ↓
                  </a>
                ))}
                {metadataLoading && (
                  <span>
                    {tr(
                      "جاري التحقق من ملفات التنزيل…",
                      "Checking available download files...",
                    )}
                  </span>
                )}
                {!metadataLoading && !downloads.length && (
                  <span>
                    {tr(
                      "الكتاب متاح للقراءة داخل المنصة، ولا يوفّر المصدر ملف تنزيل مباشرًا.",
                      "This book is readable inside the platform, but the source does not provide a direct download file.",
                    )}
                  </span>
                )}
              </div>
              <small>
                {tr(
                  "الإتاحة والحقوق يحددهما Open Library وInternet Archive؛ لا تعرض Dev Nexus Academy كتبًا مدفوعة في هذا القسم.",
                  "Availability and rights are determined by Open Library and Internet Archive; Dev Nexus Academy shows no paid books in this section.",
                )}
              </small>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
