"use client";

import { useState } from "react";
import Link from "next/link";
import { LanguageSwitch, useLanguage } from "./LanguageProvider";
import BrandLogo from "./BrandLogo";

type PortalHeaderProps = {
  active?:
    | "home"
    | "courses"
    | "books"
    | "articles"
    | "roadmaps"
    | "about"
    | "account"
    | "none";
};

const links = [
  { id: "home", href: "/", ar: "الرئيسية", en: "Home" },
  { id: "courses", href: "/courses", ar: "الكورسات", en: "Courses" },
  { id: "books", href: "/books", ar: "مكتبة الكتب", en: "Free Books" },
  { id: "articles", href: "/articles", ar: "المقالات", en: "Articles" },
  { id: "roadmaps", href: "/roadmaps", ar: "خرائط الطريق", en: "Roadmaps" },
  { id: "about", href: "/about", ar: "عن المنصة", en: "About" },
] as const;

export default function PortalHeader({ active = "home" }: PortalHeaderProps) {
  const [open, setOpen] = useState(false);
  const { tr } = useLanguage();

  return (
    <header className="portal-header">
      <div className="portal-container portal-header-inner">
        <Link
          className="portal-brand"
          href="/"
          aria-label="Dev Nexus Academy - الرئيسية"
        >
          <BrandLogo />
        </Link>
        <button
          className="portal-menu"
          type="button"
          aria-label="فتح قائمة التنقل"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
        <nav
          className={open ? "portal-nav open" : "portal-nav"}
          aria-label="أقسام المنصة"
        >
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={active === link.id ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {tr(link.ar, link.en)}
            </Link>
          ))}
        </nav>
        <div className="portal-actions">
          <LanguageSwitch compact />
          <Link className="portal-cta" href="/account">
            {tr("حسابي", "My account")} <span>←</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
