"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import type { HomeCourse } from "../data/home";
import { ArrowIcon } from "./HomeIcons";
import { useLanguage } from "./LanguageProvider";

type CoursePreviewModalProps = {
  course: HomeCourse | null;
  onClose: () => void;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function CoursePreviewModal({
  course,
  onClose,
}: CoursePreviewModalProps) {
  const { language, tr } = useLanguage();
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!course) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("hidden"));

      const first = focusableElements[0];
      const last = focusableElements.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [course, onClose]);

  if (!course) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="course-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          className="modal-close"
          ref={closeButtonRef}
          type="button"
          aria-label={tr("إغلاق", "Close")}
          onClick={onClose}
        >
          ×
        </button>
        <div className={`modal-symbol ${course.accent}`}>{course.code}</div>
        <span className="modal-kicker">
          {language === "ar" ? course.category : course.categoryEn} ·{" "}
          {language === "ar" ? course.level : course.levelEn}
        </span>
        <h2 id={titleId}>
          {language === "ar" ? course.title : course.titleEn}
        </h2>
        <p>{language === "ar" ? course.description : course.descriptionEn}</p>
        <div className="modal-facts">
          <span>
            {course.lessons} {tr("درسًا", "lessons")}
          </span>
          <span>{language === "ar" ? course.hours : course.hoursEn}</span>
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
  );
}
