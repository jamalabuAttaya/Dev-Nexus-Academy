"use client";

import { useMemo, useState } from "react";
import {
  courseSections,
  learningMedia,
  type VideoItem,
} from "../data/courseCatalog";
import { useLanguage } from "./LanguageProvider";

export default function VideoExplorer() {
  const { language, tr } = useLanguage();
  const [selected, setSelected] = useState<VideoItem>(learningMedia[0]);
  const [sectionId, setSectionId] = useState("all");
  const [mediaType, setMediaType] = useState<"all" | "video" | "playlist">(
    "all",
  );
  const [query, setQuery] = useState("");
  const activeSection = courseSections.find(
    (section) => section.id === sectionId,
  );
  const minimumCourses = Math.min(
    ...courseSections.map((section) => section.courseIds.length),
  );
  const visible = useMemo(
    () =>
      learningMedia.filter((item) => {
        const normalized = query.trim().toLowerCase();
        return (
          (!activeSection || activeSection.courseIds.includes(item.id)) &&
          (mediaType === "all" || item.type === mediaType) &&
          (!normalized ||
            `${item.title} ${item.description} ${item.topic} ${item.source}`
              .toLowerCase()
              .includes(normalized))
        );
      }),
    [activeSection, mediaType, query],
  );
  const playerUrl =
    selected.type === "playlist"
      ? `https://www.youtube-nocookie.com/embed/videoseries?list=${selected.id}&rel=0`
      : `https://www.youtube-nocookie.com/embed/${selected.id}?rel=0`;

  function play(item: VideoItem) {
    setSelected(item);
    document
      .getElementById("watch-player")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function chooseSection(nextId: string) {
    setSectionId(nextId);
    const nextSection = courseSections.find((section) => section.id === nextId);
    const firstCourse = nextSection
      ? learningMedia.find((item) => nextSection.courseIds.includes(item.id))
      : learningMedia[0];
    if (firstCourse) setSelected(firstCourse);
  }

  return (
    <div className="video-explorer">
      <div className="course-scope">
        <div>
          <strong>{learningMedia.length}</strong>
          <span>
            {tr("كورسًا ومسارًا فريدًا", "unique courses and tracks")}
          </span>
        </div>
        <div>
          <strong>{courseSections.length}</strong>
          <span>{tr("قسمًا بالاسم الرسمي", "officially named sections")}</span>
        </div>
        <div>
          <strong>{minimumCourses}+</strong>
          <span>{tr("كورسات في كل قسم", "courses in every section")}</span>
        </div>
        <p>
          {tr(
            "مكتبة تقنية مصنفة رسميًا؛ كل قسم يحتوي على سبع دورات كاملة على الأقل وتعمل داخل المنصة.",
            "An officially categorized technology library; every section contains at least seven complete courses playable inside the platform.",
          )}
        </p>
      </div>

      <section className="watch-stage" id="watch-player">
        <div className="watch-frame">
          <iframe
            key={`${selected.type}-${selected.id}`}
            src={playerUrl}
            title={selected.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="watch-info">
          <div className="watch-badges">
            <span>
              {selected.type === "playlist"
                ? tr("قائمة تشغيل", "Playlist")
                : tr("فيديو", "Video")}
            </span>
            <span>{selected.topic}</span>
            <span>{selected.language}</span>
          </div>
          <h2>{selected.title}</h2>
          <p>{selected.description}</p>
          <footer>
            <div>
              <strong>{selected.source}</strong>
              <span>
                {selected.level} · {selected.topic}
              </span>
            </div>
            <a
              href={
                selected.type === "playlist"
                  ? `https://www.youtube.com/playlist?list=${selected.id}`
                  : `https://www.youtube.com/watch?v=${selected.id}`
              }
              target="_blank"
              rel="noreferrer noopener"
            >
              {tr("المصدر الأصلي", "Original source")} ↗
            </a>
          </footer>
        </div>
      </section>

      <section className="catalog-panel">
        <div className="catalog-tools expanded">
          <label>
            <span className="sr-only">
              {tr("ابحث في الكورسات", "Search courses")}
            </span>
            <b>⌕</b>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tr(
                "ابحث عن Python، Cybersecurity، SQL...",
                "Search Python, Cybersecurity, SQL...",
              )}
            />
          </label>
          <select
            value={sectionId}
            onChange={(event) => chooseSection(event.target.value)}
            aria-label={tr("قسم الكورس", "Course section")}
          >
            <option value="all">
              {tr("جميع الأقسام الرسمية", "All official sections")}
            </option>
            {courseSections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.officialName}
                {language === "ar" ? ` — ${section.arName}` : ""} (
                {section.courseIds.length})
              </option>
            ))}
          </select>
          <select
            value={mediaType}
            onChange={(event) =>
              setMediaType(event.target.value as typeof mediaType)
            }
            aria-label={tr("نوع المحتوى", "Media type")}
          >
            <option value="all">
              {tr("فيديو وقوائم تشغيل", "Videos and playlists")}
            </option>
            <option value="video">{tr("فيديوهات كاملة", "Full videos")}</option>
            <option value="playlist">{tr("قوائم تشغيل", "Playlists")}</option>
          </select>
        </div>

        <div
          className="course-section-grid"
          aria-label={tr(
            "الأقسام الرسمية للكورسات",
            "Official course sections",
          )}
        >
          {courseSections.map((section) => (
            <button
              type="button"
              key={section.id}
              data-motion={section.id}
              className={sectionId === section.id ? "active" : ""}
              onClick={() => chooseSection(section.id)}
              aria-pressed={sectionId === section.id}
            >
              <span className="section-motion" aria-hidden="true">
                <b>{section.glyph}</b>
                <i />
                <i />
                <i />
                <i />
                <code>{section.short}</code>
              </span>
              <span className="section-copy">
                <strong dir="ltr">{section.officialName}</strong>
                <small>
                  {language === "ar"
                    ? section.arName
                    : `${section.courseIds.length} curated courses`}
                </small>
              </span>
              <em>{section.courseIds.length}</em>
            </button>
          ))}
        </div>

        <div className="catalog-count">
          <strong>{visible.length}</strong>{" "}
          {tr("نتيجة منتقاة بعناية", "carefully curated results")}{" "}
          <span>
            <i />{" "}
            {tr("تشغيل كامل داخل المنصة", "full playback inside the platform")}
          </span>
        </div>
        {visible.length ? (
          <div className="video-grid">
            {visible.map((item) => (
              <button
                type="button"
                className={`video-card ${selected.id === item.id ? "selected" : ""}`}
                key={item.id}
                onClick={() => play(item)}
                aria-label={`${tr("تشغيل", "Play")}: ${item.title}`}
              >
                <span className="video-thumb">
                  <span className="playlist-art">
                    <b>{item.type === "playlist" ? "LIST" : "DN"}</b>
                    <small>{item.topic}</small>
                  </span>
                  {item.type === "video" && (
                    <img
                      src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                      }}
                    />
                  )}
                  <i>
                    {item.type === "playlist"
                      ? tr("▤ قائمة", "▤ Playlist")
                      : tr("▶ شاهد", "▶ Watch")}
                  </i>
                </span>
                <span className="video-card-body">
                  <small>
                    {item.topic} · {item.language}
                  </small>
                  <strong>{item.title}</strong>
                  <span>
                    {item.source} · {item.level}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="portal-empty">
            <span>⌕</span>
            <h3>{tr("لا توجد نتائج مطابقة", "No matching results")}</h3>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                chooseSection("all");
                setMediaType("all");
              }}
            >
              {tr("عرض كل الكورسات", "Show all courses")}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
