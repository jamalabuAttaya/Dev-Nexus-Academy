"use client";

import { useCallback, useState } from "react";
import type { HomeCourse } from "../data/home";
import CoursePreviewModal from "./CoursePreviewModal";
import { PlayIcon } from "./HomeIcons";
import { useLanguage } from "./LanguageProvider";

export default function CoursePreviewButton({
  course,
}: {
  course: HomeCourse;
}) {
  const { tr } = useLanguage();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        className="video-button"
        type="button"
        onClick={() => setOpen(true)}
      >
        <span>
          <PlayIcon />
        </span>{" "}
        {tr("شاهد كيف نتعلّم", "See how we learn")}
      </button>
      <CoursePreviewModal course={open ? course : null} onClose={close} />
    </>
  );
}
