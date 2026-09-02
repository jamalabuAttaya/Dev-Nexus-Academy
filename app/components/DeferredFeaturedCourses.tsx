"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { homeCourses } from "../data/home";
import { ArrowIcon } from "./HomeIcons";
import { useLanguage } from "./LanguageProvider";
import useNearViewport from "./useNearViewport";

const FeaturedCourses = dynamic(() => import("./FeaturedCourses"), {
  ssr: false,
});

function FeaturedCoursesPreview() {
  const { language, tr } = useLanguage();

  return (
    <section
      className="courses-section section deferred-courses-preview"
      id="courses"
    >
      <div className="shell">
        <div className="section-heading">
          <div>
            <div className="eyebrow dark">
              <span /> {tr("دورات البداية المميزة", "Featured starting points")}
            </div>
            <h2>
              {tr("ابدأ من الأساس.", "Build the foundations.")}
              <br />
              <em>{tr("ثم اختر تخصصك.", "Then choose your field.")}</em>
            </h2>
          </div>
          <p>
            {tr(
              "استعرض نماذج البداية، وستعمل أدوات البحث والتصفية فور وصولك إلى هذا القسم.",
              "Browse the starting points; search and filters activate as this section enters view.",
            )}
          </p>
        </div>

        <div className="course-grid deferred-course-grid">
          {homeCourses.slice(0, 3).map((course) => (
            <article className="course-card" key={course.id}>
              <div className={`course-cover ${course.accent}`}>
                <span className="course-level">
                  {language === "ar" ? course.level : course.levelEn}
                </span>
                <strong dir="ltr">{course.code}</strong>
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
                <Link className="deferred-card-link" href="/courses">
                  {tr("فتح مركز الكورسات", "Open course center")} <ArrowIcon />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DeferredFeaturedCourses() {
  const { targetRef, isNear } = useNearViewport<HTMLDivElement>("320px 0px");

  return (
    <div className="deferred-home-block" ref={targetRef}>
      {isNear ? <FeaturedCourses /> : <FeaturedCoursesPreview />}
    </div>
  );
}
