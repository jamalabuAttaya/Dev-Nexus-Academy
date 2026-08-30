"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { academyApi, type ApiCourse } from "../../lib/api";
import { useLanguage } from "./LanguageProvider";

export default function EnrollmentCatalog() {
  const { tr } = useLanguage();

  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyCourseId, setBusyCourseId] = useState<number | null>(
    null,
  );
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCourses() {
      const token = sessionStorage.getItem("dev-nexus-token");

      academyApi.setToken(token);

      const [catalogResult, dashboardResult] =
        await Promise.allSettled([
          academyApi.courses(),
          token
            ? academyApi.dashboard()
            : Promise.resolve(null),
        ]);

      if (cancelled) {
        return;
      }

      setSignedIn(Boolean(token));

      if (catalogResult.status === "fulfilled") {
        setCourses(catalogResult.value.data);
      } else {
        setError(
          tr(
            "تعذر تحميل دورات المنصة. انتظر قليلًا ثم حدّث الصفحة.",
            "Unable to load platform courses. Wait a moment, then refresh the page.",
          ),
        );
      }

      if (
        dashboardResult.status === "fulfilled" &&
        dashboardResult.value
      ) {
        const ids = dashboardResult.value.enrollments.map(
          (item) => item.course.id,
        );

        setEnrolledIds(new Set(ids));
      }

      setLoading(false);
    }

    void loadCourses();

    return () => {
      cancelled = true;
    };
  }, [tr]);

  async function enroll(courseId: number) {
    if (!signedIn) {
      return;
    }

    setBusyCourseId(courseId);
    setNotice("");
    setError("");

    try {
      await academyApi.enroll(courseId);

      setEnrolledIds((current) => {
        const next = new Set(current);
        next.add(courseId);
        return next;
      });

      setNotice(
        tr(
          "تم الالتحاق بالدورة بنجاح. ستظهر الآن في لوحة حسابك.",
          "Enrollment completed. The course will now appear on your dashboard.",
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : tr(
              "تعذر الالتحاق بالدورة.",
              "Unable to enroll in this course.",
            ),
      );
    } finally {
      setBusyCourseId(null);
    }
  }

  function levelLabel(level: ApiCourse["level"]) {
    const labels = {
      beginner: tr("مبتدئ", "Beginner"),
      intermediate: tr("متوسط", "Intermediate"),
      advanced: tr("متقدم", "Advanced"),
    };

    return labels[level];
  }

  function durationLabel(minutes: number) {
    const hours = Math.max(1, Math.ceil(minutes / 60));

    return tr(`${hours} ساعة`, `${hours} hr`);
  }

  return (
    <section
      className="enrollment-catalog"
      aria-labelledby="enrollment-catalog-title"
    >
      <div className="enrollment-catalog-head">
        <div>
          <span className="enrollment-catalog-kicker">
            {tr("كتالوج المتعلم", "LEARNER CATALOG")}
          </span>

          <h2 id="enrollment-catalog-title">
            {tr(
              "دورات مرتبطة بحسابك",
              "Courses connected to your account",
            )}
          </h2>

          <p>
            {tr(
              "التحق بإحدى دورات المنصة وتابعها من لوحة حسابك.",
              "Enroll in a platform course and track it from your dashboard.",
            )}
          </p>
        </div>

        {!signedIn && (
          <Link
            className="enrollment-sign-in"
            href="/account"
          >
            {tr(
              "سجّل الدخول للالتحاق",
              "Sign in to enroll",
            )}
          </Link>
        )}
      </div>

      {notice && (
        <div
          className="enrollment-notice"
          role="status"
          aria-live="polite"
        >
          {notice}
        </div>
      )}

      {error && (
        <div
          className="enrollment-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <p className="enrollment-loading">
          {tr(
            "جارٍ تحميل الدورات…",
            "Loading courses…",
          )}
        </p>
      ) : courses.length === 0 ? (
        <p className="enrollment-loading">
          {tr(
            "لا توجد دورات متاحة حاليًا.",
            "No courses are available yet.",
          )}
        </p>
      ) : (
        <div className="enrollment-course-grid">
          {courses.map((course) => {
            const enrolled = enrolledIds.has(course.id);
            const busy = busyCourseId === course.id;

            return (
              <article
                className="enrollment-course-card"
                key={course.id}
              >
                <div className="enrollment-course-meta">
                  <span>{course.category}</span>
                  <span>{levelLabel(course.level)}</span>
                </div>

                <h3>{course.title}</h3>

                <p>{course.description}</p>

                <div className="enrollment-course-footer">
                  <div>
                    <span>
                      {course.lessons_count ?? 0}{" "}
                      {tr("دروس", "lessons")}
                    </span>

                    <span>
                      {durationLabel(
                        course.duration_minutes,
                      )}
                    </span>
                  </div>

                  {signedIn ? (
                    <button
                      type="button"
                      disabled={enrolled || busy}
                      onClick={() => {
                        void enroll(course.id);
                      }}
                    >
                      {enrolled
                        ? tr("ملتحق", "Enrolled")
                        : busy
                          ? tr(
                              "جارٍ الالتحاق…",
                              "Enrolling…",
                            )
                          : tr(
                              "التحاق بالدورة",
                              "Enroll",
                            )}
                    </button>
                  ) : (
                    <Link href="/account">
                      {tr(
                        "تسجيل الدخول",
                        "Sign in",
                      )}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}