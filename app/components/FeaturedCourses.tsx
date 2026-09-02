"use client";

import { useCallback, useMemo, useState } from "react";
import { homeCourseFilters, homeCourses, type HomeCourse } from "../data/home";
import CoursePreviewModal from "./CoursePreviewModal";
import { ArrowIcon, SearchIcon } from "./HomeIcons";
import { useLanguage } from "./LanguageProvider";

export default function FeaturedCourses() {
  const { language, tr } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<HomeCourse | null>(null);
  const closeModal = useCallback(() => setSelectedCourse(null), []);

  const visibleCourses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return homeCourses.filter((course) => {
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

  return (
    <>
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
              {homeCourseFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={activeFilter === filter.id ? "active" : ""}
                  aria-pressed={activeFilter === filter.id}
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
                type="search"
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

      <CoursePreviewModal course={selectedCourse} onClose={closeModal} />
    </>
  );
}
