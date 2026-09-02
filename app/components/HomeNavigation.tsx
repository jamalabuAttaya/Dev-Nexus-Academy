"use client";

import Link from "next/link";
import { useState } from "react";
import BrandLogo from "./BrandLogo";
import { LanguageSwitch, useLanguage } from "./LanguageProvider";

export default function HomeNavigation() {
  const { tr } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const scrollToCourses = () => {
    closeMenu();
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="site-nav"
      aria-label={tr("التنقل الرئيسي", "Primary navigation")}
    >
      <div className="shell nav-inner">
        <Link
          className="brand"
          href="/"
          aria-label="Dev Nexus Academy"
          onClick={closeMenu}
        >
          <BrandLogo inverse />
        </Link>

        <button
          className="menu-button"
          type="button"
          aria-label={tr("فتح القائمة", "Open menu")}
          aria-expanded={menuOpen}
          aria-controls="home-navigation-links"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <div
          className={`nav-links ${menuOpen ? "is-open" : ""}`}
          id="home-navigation-links"
        >
          <Link href="/courses" onClick={closeMenu}>
            {tr("الكورسات والفيديو", "Courses & video")}
          </Link>
          <Link href="/books" onClick={closeMenu}>
            {tr("مكتبة الكتب", "Free books")}
          </Link>
          <Link href="/articles" onClick={closeMenu}>
            {tr("المقالات", "Articles")}
          </Link>
          <Link href="/roadmaps" onClick={closeMenu}>
            {tr("خرائط الطريق", "Roadmaps")}
          </Link>
          <Link href="/about" onClick={closeMenu}>
            {tr("عن المنصة", "About")}
          </Link>
        </div>

        <div className="nav-actions">
          <LanguageSwitch compact />
          <Link className="text-button" href="/account">
            {tr("حسابي", "My account")}
          </Link>
          <button
            className="button button-small"
            type="button"
            onClick={scrollToCourses}
          >
            {tr("ابدأ التعلم", "Start learning")}
          </button>
        </div>
      </div>
    </nav>
  );
}
