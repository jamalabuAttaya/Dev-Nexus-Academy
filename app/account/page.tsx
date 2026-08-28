import type { Metadata } from "next";
import AccountPortal from "../components/AccountPortal";

export const metadata: Metadata = {
  title: "حساب المتعلم",
  description: "تسجيل الدخول وإدارة تقدم التعلم في Dev Nexus Academy.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountPortal />;
}
