"use client";
/* eslint-disable react-hooks/set-state-in-effect -- session restoration runs after hydration */

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import PortalHeader from "./PortalHeader";
import SiteFooter from "./SiteFooter";
import { useLanguage } from "./LanguageProvider";
import { academyApi } from "../../lib/api";

type Dashboard = Awaited<ReturnType<typeof academyApi.dashboard>>;

export default function AccountPortal() {
  const { tr } = useLanguage();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("dev-nexus-token");
    if (!token) return;
    academyApi.setToken(token);
    setBusy(true);
    academyApi
      .dashboard()
      .then((payload) => {
        setDashboard(payload);
        setAuthenticated(true);
      })
      .catch(() => {
        sessionStorage.removeItem("dev-nexus-token");
        academyApi.setToken(null);
      })
      .finally(() => setBusy(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response =
        mode === "login"
          ? await academyApi.login({ email, password })
          : await academyApi.register({
              name,
              email,
              password,
              password_confirmation: confirmation,
            });
      sessionStorage.setItem("dev-nexus-token", response.token);
      academyApi.setToken(response.token);
      setDashboard(await academyApi.dashboard());
      setAuthenticated(true);
      setPassword("");
      setConfirmation("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : tr("تعذر إكمال الطلب.", "The request could not be completed."),
      );
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await academyApi.logout();
    } catch {
      // The local session is cleared even if the remote token expired.
    } finally {
      sessionStorage.removeItem("dev-nexus-token");
      academyApi.setToken(null);
      setAuthenticated(false);
      setDashboard(null);
      setBusy(false);
    }
  }

  return (
    <main className="portal-page account-page" id="main-content">
      <PortalHeader active="account" />
      <section className="account-shell portal-container">
        <header className="account-intro">
          <span>LEARNER SPACE</span>
          <h1>
            {authenticated
              ? tr("لوحة تعلمك.", "Your learning dashboard.")
              : tr("مسارك، محفوظ ومنظم.", "Your path, saved and organized.")}
          </h1>
          <p>
            {tr(
              "سجّل الدخول لإدارة الالتحاقات ومتابعة تقدم الدورات المرتبطة بخدمة المنصة.",
              "Sign in to manage enrollments and track course progress connected to the platform service.",
            )}
          </p>
        </header>

        {authenticated && dashboard ? (
          <section className="learner-dashboard">
            <div className="dashboard-toolbar">
              <div>
                <small>{tr("حالة الحساب", "Account status")}</small>
                <strong>{tr("متصل وآمن", "Connected and secure")}</strong>
              </div>
              <button type="button" onClick={logout} disabled={busy}>
                {tr("تسجيل الخروج", "Sign out")}
              </button>
            </div>
            <div className="dashboard-stats">
              <article>
                <span>{dashboard.stats.active_courses}</span>
                <p>{tr("دورات نشطة", "Active courses")}</p>
              </article>
              <article>
                <span>{dashboard.stats.completed_courses}</span>
                <p>{tr("دورات مكتملة", "Completed courses")}</p>
              </article>
              <article>
                <span>{dashboard.stats.average_progress}%</span>
                <p>{tr("متوسط التقدم", "Average progress")}</p>
              </article>
            </div>
            <div className="enrollment-list">
              <header>
                <h2>{tr("دوراتي", "My courses")}</h2>
                <Link href="/courses">
                  {tr("استكشف الكورسات", "Explore courses")} ↗
                </Link>
              </header>
              {dashboard.enrollments.length ? (
                dashboard.enrollments.map((enrollment) => (
                  <article key={enrollment.id}>
                    <div>
                      <small>{enrollment.course.level}</small>
                      <strong>
                        <Link
                          className="dashboard-course-link"
                          href={`/courses/${enrollment.course.slug}`}
                        >
                          {enrollment.course.title}
                        </Link>
                      </strong>
                    </div>
                    <span>{enrollment.progress_percent}%</span>
                    <i>
                      <b style={{ width: `${enrollment.progress_percent}%` }} />
                    </i>
                  </article>
                ))
              ) : (
                <div className="dashboard-empty">
                  <span>＋</span>
                  <h3>{tr("لم تلتحق بدورة بعد", "No enrollments yet")}</h3>
                  <p>
                    {tr(
                      "استكشف كتالوج الدورات واختر نقطة البداية.",
                      "Explore the course catalog and choose a starting point.",
                    )}
                  </p>
                  <Link href="/courses">
                    {tr("فتح الكتالوج", "Open catalog")}
                  </Link>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="auth-panel">
            <div className="auth-tabs">
              <button
                type="button"
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                {tr("تسجيل الدخول", "Sign in")}
              </button>
              <button
                type="button"
                className={mode === "register" ? "active" : ""}
                onClick={() => setMode("register")}
              >
                {tr("إنشاء حساب", "Create account")}
              </button>
            </div>
            <form onSubmit={submit}>
              {mode === "register" && (
                <label>
                  <span>{tr("الاسم", "Name")}</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                    maxLength={100}
                  />
                </label>
              )}
              <label>
                <span>{tr("البريد الإلكتروني", "Email address")}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                <span>{tr("كلمة المرور", "Password")}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  required
                  minLength={8}
                />
              </label>
              {mode === "register" && (
                <label>
                  <span>{tr("تأكيد كلمة المرور", "Confirm password")}</span>
                  <input
                    type="password"
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                </label>
              )}
              {message && <p className="auth-message">{message}</p>}
              <button className="auth-submit" type="submit" disabled={busy}>
                {busy
                  ? tr("جارٍ التحقق…", "Checking…")
                  : mode === "login"
                    ? tr("دخول آمن", "Secure sign in")
                    : tr("إنشاء الحساب", "Create account")}
              </button>
            </form>
            <p className="auth-note">
              {tr(
                "يُحفظ رمز الجلسة مؤقتًا في هذا التبويب ولا يُشارك مع خدمات المحتوى.",
                "The session token is stored temporarily in this tab and is not shared with content providers.",
              )}
            </p>
          </section>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
