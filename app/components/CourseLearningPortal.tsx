"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  academyApi,
  ApiRequestError,
  type ApiCourse,
  type ApiLessonSummary,
  type LearningCourseResponse,
  type LessonProgressSummary,
  type LessonResponse,
} from "../../lib/api";
import { useLanguage } from "./LanguageProvider";
import PortalHeader from "./PortalHeader";
import SiteFooter from "./SiteFooter";

type CourseLearningPortalProps = {
  slug: string;
};

function youtubeEmbedUrl(value: string | null) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/").filter(Boolean)[1] ?? null;
      } else {
        videoId = url.searchParams.get("v");
      }
    }

    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return null;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

export default function CourseLearningPortal({
  slug,
}: CourseLearningPortalProps) {
  const { tr } = useLanguage();

  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [learning, setLearning] = useState<LearningCourseResponse | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LessonResponse | null>(
    null,
  );

  const [signedIn, setSignedIn] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const embedUrl = useMemo(
    () => youtubeEmbedUrl(selectedLesson?.lesson.video_url ?? null),
    [selectedLesson],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      let token = sessionStorage.getItem("dev-nexus-token");
      academyApi.setToken(token);

      try {
        const publicCourse = await academyApi.course(slug);

        let nextCourse = publicCourse.data;
        let nextLearning: LearningCourseResponse | null = null;
        let nextLesson: LessonResponse | null = null;
        let nextSignedIn = Boolean(token);
        let nextEnrolled = false;

        if (token) {
          try {
            const dashboard = await academyApi.dashboard();

            nextEnrolled = dashboard.enrollments.some(
              (item) => item.course.slug === slug,
            );

            if (nextEnrolled) {
              nextLearning = await academyApi.learningCourse(slug);
              nextCourse = nextLearning.course;
            }
          } catch (requestError) {
            if (
              requestError instanceof ApiRequestError &&
              requestError.status === 401
            ) {
              sessionStorage.removeItem("dev-nexus-token");
              academyApi.setToken(null);
              token = null;
              nextSignedIn = false;
            }
          }
        }

        const initialLesson = nextCourse.lessons?.find(
          (item) => nextEnrolled || item.is_preview,
        );

        if (nextSignedIn && initialLesson) {
          try {
            nextLesson = await academyApi.lesson(initialLesson.id);
          } catch {
            nextLesson = null;
          }
        }

        if (cancelled) {
          return;
        }

        setCourse(nextCourse);
        setLearning(nextLearning);
        setSelectedLesson(nextLesson);
        setSignedIn(nextSignedIn);
        setEnrolled(nextEnrolled);
        setLoading(false);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : tr("تعذر تحميل الدورة.", "Unable to load this course."),
        );
        setLoading(false);
      }
    }

    void loadPage();

    return () => {
      cancelled = true;
    };
  }, [slug, tr]);

  function lessonProgress(lessonId: number): LessonProgressSummary | undefined {
    return learning?.lesson_progress.find(
      (item) => item.lesson_id === lessonId,
    );
  }

  function formatLessonDuration(seconds: number) {
    const minutes = Math.max(1, Math.ceil(seconds / 60));

    return tr(`${minutes} دقيقة`, `${minutes} min`);
  }

  function formatCourseDuration(minutes: number) {
    const hours = Math.max(1, Math.ceil(minutes / 60));

    return tr(`${hours} ساعة`, `${hours} hr`);
  }

  async function openLesson(lesson: ApiLessonSummary) {
    if (!signedIn) {
      setError(
        tr("سجّل الدخول أولًا لفتح الدروس.", "Sign in first to open lessons."),
      );
      return;
    }

    if (!enrolled && !lesson.is_preview) {
      setError(
        tr(
          "التحق بالدورة لفتح هذا الدرس.",
          "Enroll in the course to open this lesson.",
        ),
      );
      return;
    }

    setLessonLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await academyApi.lesson(lesson.id);
      setSelectedLesson(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : tr("تعذر فتح الدرس.", "Unable to open the lesson."),
      );
    } finally {
      setLessonLoading(false);
    }
  }

  async function enroll() {
    if (!course) {
      return;
    }

    if (!signedIn) {
      setError(
        tr(
          "سجّل الدخول أولًا للالتحاق بالدورة.",
          "Sign in first to enroll in the course.",
        ),
      );
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    try {
      await academyApi.enroll(course.id);

      const learningResponse = await academyApi.learningCourse(slug);

      const firstLesson = learningResponse.course.lessons?.[0];

      let lessonResponse: LessonResponse | null = null;

      if (firstLesson) {
        lessonResponse = await academyApi.lesson(firstLesson.id);
      }

      setCourse(learningResponse.course);
      setLearning(learningResponse);
      setSelectedLesson(lessonResponse);
      setEnrolled(true);

      setNotice(
        tr(
          "تم الالتحاق بالدورة. يمكنك الآن فتح جميع الدروس.",
          "You are enrolled. All lessons are now available.",
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : tr("تعذر الالتحاق بالدورة.", "Unable to enroll in this course."),
      );
    } finally {
      setBusy(false);
    }
  }

  async function completeLesson() {
    if (!selectedLesson || !selectedLesson.can_update_progress) {
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const result = await academyApi.updateProgress(
        selectedLesson.lesson.id,
        selectedLesson.lesson.duration_seconds,
        true,
      );

      setSelectedLesson((current) => {
        if (
          !current ||
          current.lesson.id !== result.lesson_progress.lesson_id
        ) {
          return current;
        }

        return {
          ...current,
          progress: {
            watched_seconds: result.lesson_progress.watched_seconds,
            completed: result.lesson_progress.completed,
            completed_at: result.lesson_progress.completed_at,
          },
        };
      });

      setLearning((current) => {
        if (!current) {
          return current;
        }

        const progressExists = current.lesson_progress.some(
          (item) => item.lesson_id === result.lesson_progress.lesson_id,
        );

        return {
          ...current,
          enrollment: {
            ...current.enrollment,
            progress_percent: result.course_progress_percent,
            status:
              result.course_progress_percent === 100 ? "completed" : "active",
          },
          lesson_progress: progressExists
            ? current.lesson_progress.map((item) =>
                item.lesson_id === result.lesson_progress.lesson_id
                  ? result.lesson_progress
                  : item,
              )
            : [...current.lesson_progress, result.lesson_progress],
        };
      });

      setNotice(
        result.course_progress_percent === 100
          ? tr("أكملت الدورة بنجاح!", "You completed the course!")
          : tr("تم حفظ تقدم الدرس.", "Lesson progress was saved."),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : tr("تعذر حفظ التقدم.", "Unable to save progress."),
      );
    } finally {
      setBusy(false);
    }
  }

  const lessons = course?.lessons ?? [];
  const courseProgress = learning?.enrollment.progress_percent ?? 0;

  return (
    <main className="portal-page course-learning-page" id="main-content">
      <PortalHeader active="courses" />

      <section className="course-learning-shell portal-container">
        <Link className="course-learning-back" href="/courses">
          {tr("العودة إلى الكورسات", "Back to courses")} ←
        </Link>

        {loading ? (
          <div className="course-learning-state">
            {tr("جارٍ تحميل الدورة…", "Loading course…")}
          </div>
        ) : error && !course ? (
          <div className="course-learning-error" role="alert">
            {error}
          </div>
        ) : course ? (
          <>
            <header className="course-learning-hero">
              <div>
                <div className="course-learning-meta">
                  <span>{course.category}</span>
                  <span>{course.level}</span>
                  <span>{formatCourseDuration(course.duration_minutes)}</span>
                  <span>
                    {course.lessons_count ?? course.lessons?.length ?? 0}{" "}
                    {tr("دروس", "lessons")}
                  </span>
                </div>

                <h1>{course.title}</h1>
                <p>{course.description}</p>
              </div>

              <div className="course-learning-action">
                {!signedIn ? (
                  <Link href="/account">
                    {tr("تسجيل الدخول", "Sign in to learn")}
                  </Link>
                ) : enrolled ? (
                  <span className="course-enrolled-badge">
                    {tr("أنت ملتحق بالدورة", "You are enrolled")}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      void enroll();
                    }}
                  >
                    {busy
                      ? tr("جارٍ الالتحاق…", "Enrolling…")
                      : tr("التحاق بالدورة", "Enroll now")}
                  </button>
                )}
              </div>
            </header>

            {enrolled && (
              <section
                className="course-progress-summary"
                aria-label={tr("تقدم الدورة", "Course progress")}
              >
                <div>
                  <strong>{courseProgress}%</strong>
                  <span>{tr("نسبة إكمال الدورة", "Course completion")}</span>
                </div>

                <i>
                  <b
                    style={{
                      width: `${courseProgress}%`,
                    }}
                  />
                </i>
              </section>
            )}

            {notice && (
              <div
                className="course-learning-notice"
                role="status"
                aria-live="polite"
              >
                {notice}
              </div>
            )}

            {error && (
              <div className="course-learning-error" role="alert">
                {error}
              </div>
            )}

            <div className="course-learning-layout">
              <aside className="course-lessons">
                <header>
                  <span>{tr("محتوى الدورة", "Course content")}</span>
                  <strong>
                    {lessons.length} {tr("دروس", "lessons")}
                  </strong>
                </header>

                <div className="course-lesson-list">
                  {lessons.map((lesson) => {
                    const progress = lessonProgress(lesson.id);
                    const completed = progress?.completed ?? false;
                    const locked = !enrolled && !lesson.is_preview;
                    const active = selectedLesson?.lesson.id === lesson.id;

                    return (
                      <button
                        type="button"
                        key={lesson.id}
                        className={[
                          "course-lesson-button",
                          active ? "active" : "",
                          completed ? "completed" : "",
                          locked ? "locked" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-current={active ? "true" : undefined}
                        disabled={lessonLoading}
                        onClick={() => {
                          void openLesson(lesson);
                        }}
                      >
                        <span className="course-lesson-number">
                          {completed ? "✓" : lesson.position}
                        </span>

                        <span>
                          <strong>{lesson.title}</strong>
                          <small>
                            {!signedIn
                              ? tr("يتطلب تسجيل الدخول", "Sign in required")
                              : locked
                                ? tr("درس مقفل", "Locked lesson")
                                : lesson.is_preview && !enrolled
                                  ? tr("معاينة مجانية", "Free preview")
                                  : formatLessonDuration(
                                      lesson.duration_seconds,
                                    )}
                          </small>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <section className="course-lesson-stage">
                {lessonLoading ? (
                  <div className="course-learning-state">
                    {tr("جارٍ فتح الدرس…", "Opening lesson…")}
                  </div>
                ) : !signedIn ? (
                  <div className="course-lesson-placeholder">
                    <span>◎</span>
                    <h2>
                      {tr(
                        "سجّل الدخول لبدء التعلم",
                        "Sign in to start learning",
                      )}
                    </h2>
                    <p>
                      {tr(
                        "بعد تسجيل الدخول يمكنك مشاهدة الدرس التجريبي والالتحاق بالدورة.",
                        "After signing in, you can watch the preview and enroll.",
                      )}
                    </p>
                    <Link href="/account">
                      {tr("فتح الحساب", "Open account")}
                    </Link>
                  </div>
                ) : selectedLesson ? (
                  <article className="course-active-lesson">
                    <header>
                      <span>
                        {tr("الدرس", "Lesson")} {selectedLesson.lesson.position}
                      </span>
                      <h2>{selectedLesson.lesson.title}</h2>
                    </header>

                    {embedUrl ? (
                      <div className="course-video-frame">
                        <iframe
                          src={embedUrl}
                          title={selectedLesson.lesson.title}
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="course-video-empty">
                        <span>▶</span>
                        <p>
                          {tr(
                            "هذا الدرس نصي حاليًا ولا يحتوي على فيديو.",
                            "This is currently a written lesson without a video.",
                          )}
                        </p>
                      </div>
                    )}

                    <div className="course-lesson-content">
                      <h3>{tr("محتوى الدرس", "Lesson content")}</h3>
                      <p>
                        {selectedLesson.lesson.content ??
                          tr(
                            "سيتم إضافة محتوى هذا الدرس قريبًا.",
                            "Lesson content will be added soon.",
                          )}
                      </p>
                    </div>

                    <footer className="course-lesson-footer">
                      <span>
                        {formatLessonDuration(
                          selectedLesson.lesson.duration_seconds,
                        )}
                      </span>

                      {selectedLesson.progress.completed ? (
                        <strong>✓ {tr("درس مكتمل", "Lesson completed")}</strong>
                      ) : selectedLesson.can_update_progress ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            void completeLesson();
                          }}
                        >
                          {busy
                            ? tr("جارٍ الحفظ…", "Saving…")
                            : tr("تحديد كمكتمل", "Mark as completed")}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            void enroll();
                          }}
                        >
                          {tr(
                            "التحق لمتابعة التقدم",
                            "Enroll to track progress",
                          )}
                        </button>
                      )}
                    </footer>
                  </article>
                ) : (
                  <div className="course-lesson-placeholder">
                    <span>▶</span>
                    <h2>
                      {tr("اختر درسًا للبدء", "Choose a lesson to begin")}
                    </h2>
                    <p>
                      {tr(
                        "استخدم قائمة الدروس لفتح المحتوى المتاح.",
                        "Use the lesson list to open available content.",
                      )}
                    </p>
                  </div>
                )}
              </section>
            </div>
          </>
        ) : null}
      </section>

      <SiteFooter />
    </main>
  );
}
